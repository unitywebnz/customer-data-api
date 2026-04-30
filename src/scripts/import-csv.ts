import fs from "fs";
import csv from "csv-parser";
import { database, Customer } from "../models/database";
import path from "path";

const CSV_PATH = path.join(__dirname, "../../data/customers.csv");

async function importCSV(): Promise<void> {
  console.log("Starting CSV import...");

  try {
    // Connect to database
    await database.connect();
    console.log("Connected to database");

    // Initialise schema
    await database.initialiseSchema();
    console.log("Database schema initialised");

    // Read and parse CSV
    const customers: Customer[] = [];
    let processedCount = 0;

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(CSV_PATH)
        .pipe(csv())
        .on("data", (row) => {
          const customer: Customer = {
            id: parseInt(row.id, 10),
            first_name: row.first_name || "",
            last_name: row.last_name || "",
            email: row.email || "",
            gender: row.gender || null,
            ip_address: row.ip_address || null,
            company: row.company || null,
            city: row.city || null,
            title: row.title || null,
            website: row.website || null,
          };
          customers.push(customer);
          processedCount++;

          if (processedCount % 100 === 0) {
            console.log(`Processed ${processedCount} records...`);
          }
        })
        .on("end", async () => {
          console.log(`CSV parsing complete. Total records: ${processedCount}`);
          resolve();
        })
        .on("error", (err) => {
          reject(err);
        });
    });

    // Insert customers into database
    console.log("Inserting customers into database...");
    let insertedCount = 0;
    let failedCount = 0;

    for (const customer of customers) {
      try {
        await database.insertCustomer(customer);
        insertedCount++;

        if (insertedCount % 100 === 0) {
          console.log(`Inserted ${insertedCount} records...`);
        }
      } catch (err) {
        failedCount++;
        console.error(`Error inserting customer ID ${customer.id}:`, err);
      }
    }

    console.log(
      `Import complete. Successfully inserted ${insertedCount} records.`,
    );
    if (failedCount > 0) {
      console.log(`Failed to insert ${failedCount} records.`);
    }

    // Close database connection
    await database.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error during import:", error);
    await database.close();
    process.exit(1);
  }
}

// Run import
importCSV();
