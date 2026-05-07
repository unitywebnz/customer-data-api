# Customer Data API

A RESTful API that imports CSV customer data into a SQLite database and exposes it with pagination, plus a simple web frontend.

## Quick Start

```bash
npm install
npm run import
npm run dev
```

Then open http://localhost:3000

## Tech Stack

- **Backend**: TypeScript + Node.js + Express.js
- **Database**: SQLite (file-based, zero configuration)
- **CSV Parsing**: csv-parser (streaming parser)
- **Frontend**: Vanilla HTML/CSS/JavaScript (no build step required)

## Features

- CSV data import from `data/customers.csv`
- RESTful API with customer endpoints
- Pagination (default 10 items per page, max 100)
- Search functionality (by first_name, last_name, email, or company)
  - Supports multi-term search (e.g., "John Smith" matches both terms)
  - Spaces separate search terms with AND logic
- Input validation and error handling
- Simple web frontend with asynchronous data loading
- Database indexes for performance

## API Example

```bash
# Get first page
curl http://localhost:3000/api/customers

# Get page 2 with 20 items
curl http://localhost:3000/api/customers?page=2&limit=20

# Search by single term (matches first_name, last_name, email, or company)
curl http://localhost:3000/api/customers?search=john

# Search by multiple terms (spaces separate terms with AND logic)
curl http://localhost:3000/api/customers?search="john smith"
```

**Response Shape**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1000,
    "totalPages": 100
  }
}
```

## Project Structure

```
customer-data-api/
├── data/
│   ├── customers.csv          # Source CSV data (provided)
│   └── customers.db           # SQLite database (created on import)
├── src/
│   ├── controllers/
│   │   └── customerController.ts  # Business logic
│   ├── models/
│   │   └── database.ts        # SQLite database layer
│   ├── routes/
│   │   └── customerRoutes.ts  # API route definitions
│   ├── scripts/
│   │   └── import-csv.ts      # CSV import script
│   ├── utils/
│   │   └── validation.ts      # Input validation
│   └── server.ts              # Express server setup
├── public/
│   └── index.html             # Web frontend
├── plan.md                    # Technical decisions
├── package.json
├── tsconfig.json
└── README.md
```

## Available Scripts

- `npm install` - Install dependencies
- `npm run import` - Import CSV data into database
- `npm run dev` - Run in development mode
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run in production mode

## Database Schema

```sql
CREATE TABLE customers (
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
);

CREATE INDEX idx_email ON customers(email);
CREATE INDEX idx_last_name ON customers(last_name);
```

## Security & Performance

- Input validation on all query parameters
- SQL injection prevention via parameterized queries
- XSS prevention in frontend (HTML escaping)
- Database indexes on frequently queried fields
- Pagination limits to prevent large responses

## Architectural Decisions

See `plan.md` for detailed architectural decisions, trade-offs, and implementation rationale.

## License

MIT
