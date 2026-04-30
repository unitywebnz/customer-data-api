# Backend Developer Test - Plan

## Task Overview
Create a backend API that imports CSV customer data into a database and exposes it via a REST API with pagination, plus a simple web frontend to consume the API.

## Tech Stack Selection

### Backend
- **Language**: TypeScript + Node.js
  - Rationale: Type safety, modern ecosystem, excellent for APIs
  - Alternative considered: Python (good, but TypeScript preferred for consistency with modern web stacks)

- **Framework**: Express.js
  - Rationale: Lightweight, widely adopted, minimal setup required
  - Alternative considered: Fastify (faster but smaller ecosystem)

- **Database**: SQLite
  - Rationale: Zero configuration, file-based, perfect for this test scenario
  - Alternative considered: PostgreSQL (overkill for this test)

- **CSV Parsing**: csv-parser
  - Rationale: Streaming parser, memory efficient for large files

- **Validation**: Manual validation (parseInt, clamp, basic guards)
  - Rationale: Simple, no additional dependency, sufficient for this use case

### Frontend
- **Technology**: Vanilla HTML/CSS/JavaScript
  - Rationale: No build step required, demonstrates fundamental skills
  - Alternative considered: React (overkill for simple list view)

## Architecture

### Project Structure
```
customer-data-api/
├── data/
│   └── customers.csv          # Source CSV data (provided)
├── src/
│   ├── models/
│   │   └── database.ts        # SQLite database connection and schema
│   ├── controllers/
│   │   └── customerController.ts  # Business logic for customer operations
│   ├── routes/
│   │   └── customerRoutes.ts  # API route definitions
│   ├── scripts/
│   │   └── import-csv.ts      # CSV import script
│   ├── utils/
│   │   └── validation.ts      # Input validation schemas
│   └── server.ts              # Express server setup
├── public/
│   └── index.html             # Simple web frontend
├── package.json
├── tsconfig.json
└── README.md
```

### Database Schema
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

### API Endpoints
- `GET /api/customers` - List customers with pagination and search
  - Query params: `page` (default: 1), `limit` (default: 10, max: 100), `search` (optional, searches first_name and email)
  - Response: `{ data: Customer[], pagination: { page, limit, total, totalPages } }`
- `GET /api/customers/:id` - Get single customer by ID
- `GET /` - Serve static frontend

### Pagination Strategy
- Offset-based pagination (simple, sufficient for this use case)
- Default: 10 items per page
- Maximum: 100 items per page (prevent abuse)
- Return total count for client-side pagination controls

## Implementation Order

1. **Project Setup**
   - Initialize Node.js project with TypeScript
   - Install dependencies
   - Create directory structure

2. **Database Layer**
   - Set up SQLite connection
   - Create schema with indexes
   - Test basic CRUD operations

3. **CSV Import**
   - Write streaming CSV parser
   - Insert data into database
   - Skip bad rows instead of failing entire import
   - Log count of failed rows
   - Add progress logging

4. **API Development**
   - Set up Express server
   - Create customer controller with pagination
   - Add input validation
   - Implement error handling

5. **Frontend**
   - Create simple HTML page
   - Fetch API data asynchronously
   - Render customer list
   - Add pagination controls
   - Add loading states
   - Disable buttons while fetching

6. **Documentation**
   - Write comprehensive README
   - Document setup steps
   - Include API usage examples

7. **Testing** (time permitting)
   - Add unit tests for controller
   - Test pagination logic
   - Test validation

## Success Criteria

- [x] CSV data successfully imports into SQLite database
- [x] API returns customer data with working pagination
- [x] Input validation prevents invalid requests
- [x] Frontend loads and displays data asynchronously
- [x] README provides clear setup instructions
- [x] Code is clean, typed, and well-documented
- [x] Project can be set up and run smoothly

## Trade-offs & Constraints

### Time Constraint (1-4 hours)
- Using vanilla JS for frontend (no build step)
- SQLite instead of PostgreSQL (simpler setup)
- Minimal test coverage (focus on core functionality)
- Inline TypeScript types where appropriate

### Security Considerations
- Input validation on all query parameters
- Rate limiting could be added (not implementing for this test)
- SQL injection prevention (parameterized queries)
- CORS enabled for development

### Performance Considerations
- Database indexes on frequently queried fields
- Streaming CSV import (memory efficient)
- Pagination limits to prevent large responses

## Known Issues / Limitations

- No authentication/authorization (out of scope)
- No rate limiting (would add for production)
- No database migrations tool (using setup script instead)
- Frontend is minimal (functional but not polished)

## Next Steps

1. Get approval on this plan
2. Begin implementation following the order above
3. Adjust approach if issues arise during development
