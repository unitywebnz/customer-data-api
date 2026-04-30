import sqlite3 from "sqlite3";
import path from "path";

const DB_PATH = path.join(__dirname, "../../data/customers.db");

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string | null;
  ip_address: string | null;
  company: string | null;
  city: string | null;
  title: string | null;
  website: string | null;
}

export class Database {
  private db: sqlite3.Database | null = null;

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(DB_PATH, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async initialiseSchema(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        gender TEXT,
        ip_address TEXT,
        company TEXT,
        city TEXT,
        title TEXT,
        website TEXT
      )
    `;

    const createIndexesSQL = [
      "CREATE INDEX IF NOT EXISTS idx_email ON customers(email)",
      "CREATE INDEX IF NOT EXISTS idx_last_name ON customers(last_name)",
    ];

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

      this.db.run(createTableSQL, (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Create indexes
        let completed = 0;
        createIndexesSQL.forEach((indexSQL) => {
          this.db!.run(indexSQL, (indexErr) => {
            if (indexErr) {
              reject(indexErr);
              return;
            }
            completed++;
            if (completed === createIndexesSQL.length) {
              resolve();
            }
          });
        });
      });
    });
  }

  async getCustomers(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ): Promise<{
    data: Customer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const offset = (page - 1) * limit;

    let countSQL = "SELECT COUNT(*) as total FROM customers";
    let dataSQL = "SELECT * FROM customers";
    const params: any[] = [];

    if (search) {
      // Split search terms by spaces and search each term in multiple fields
      const searchTerms = search.trim().split(/\s+/);
      const searchConditions: string[] = [];

      searchTerms.forEach((term) => {
        const pattern = `%${term}%`;
        searchConditions.push(
          `(first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR company LIKE ?)`,
        );
        params.push(pattern, pattern, pattern, pattern);
      });

      const whereClause = ` WHERE ${searchConditions.join(" AND ")}`;
      countSQL += whereClause;
      dataSQL += whereClause;
    }

    dataSQL += " ORDER BY id LIMIT ? OFFSET ?";
    params.push(limit, offset);

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

      // Get total count
      this.db!.get(
        countSQL,
        params.slice(0, params.length - 2),
        (err, row: any) => {
          if (err) {
            reject(err);
            return;
          }

          const total = row.total;
          const totalPages = Math.ceil(total / limit);

          // Get paginated data
          this.db!.all(dataSQL, params, (dataErr, rows: Customer[]) => {
            if (dataErr) {
              reject(dataErr);
              return;
            }

            resolve({
              data: rows,
              pagination: {
                page,
                limit,
                total,
                totalPages,
              },
            });
          });
        },
      );
    });
  }

  async getCustomerById(id: number): Promise<Customer | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

      this.db.get<Customer>(
        "SELECT * FROM customers WHERE id = ?",
        [id],
        (err, row) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(row || null);
        },
      );
    });
  }

  async insertCustomer(customer: Customer): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error("Database not connected"));
        return;
      }

      const sql = `
        INSERT INTO customers (id, first_name, last_name, email, gender, ip_address, company, city, title, website)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      this.db.run(
        sql,
        [
          customer.id,
          customer.first_name,
          customer.last_name,
          customer.email,
          customer.gender,
          customer.ip_address,
          customer.company,
          customer.city,
          customer.title,
          customer.website,
        ],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        },
      );
    });
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        resolve();
        return;
      }

      this.db.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        this.db = null;
        resolve();
      });
    });
  }
}

export const database = new Database();
