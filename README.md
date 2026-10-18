# Node.js TypeScript Express Server

This repository contains a Node.js server built with Express and TypeScript. It follows a structured architecture with service, controller, and middleware layers. The server includes token-based authentication and logging configured to automatically switch between JSON logging (for production) and console-based logging (for local development). Logs are stored and can be accessed via an endpoint. In production, logs are stored in a volume to persist across redeploys.

## Features
- **Express.js** as the web framework
- **TypeScript** for type safety
- **Token-based authentication** 
- **Service-Controller architecture**
- **Middleware support**
- **OpenAPI 3.0** contract ([`openapi.yaml`](openapi.yaml)) with Spectral linting
- **Cursor-paginated list API** (`GET /api/v1/items`) with rate-limit headers
- **Logging:**
  - JSON logging in production
  - Text-based logging in local development
  - Logs stored in a text file
  - Endpoint to download logs
  - Automatic switching between logging formats
  - Production logs persist across redeploys using a volume

## Installation

```sh
# Clone the repository
git clone <repo-url>
cd <repo-folder>

# Install dependencies
npm install
```

## Environment Variables
Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3000
NODE_ENV=development  # Change to 'production' in production
HEALTH_SECRET=your_secret_here
LOGS_SECRET=your_logs_secret_here
```

## Running the Server

### Development Mode
```sh
npm run dev
```
This runs the server with `ts-node-dev` and text-based logging.

### Production Mode
```sh
npm run build
npm start
```
This compiles TypeScript and runs the server with JSON logging.

## Project Structure
```
/src
│── controllers  # Handles HTTP requests and responses
│── services     # Business logic and database interactions
│── middleware   # Express middleware (e.g., authentication, logging)
│── utils        # Helper functions
│── config       # Configuration files
│── types        # Shared API types (pagination contract)
│── app.ts       # Main Express server setup
│── server.ts    # Server entry point
openapi.yaml     # OpenAPI 3.0 specification (repo root)
.spectral.yaml   # Spectral rules for contract linting
```

## Authentication
To access protected routes, include a valid token in the `Authorization` header.

## API contract (paginated list)

The authoritative contract is [`openapi.yaml`](openapi.yaml). The demo list endpoint is:

- **`GET /api/v1/items`** — query params `cursor` (optional), `limit` (optional, default 20, max 100)
- **200 body:** `{ success, data[], meta: { next_cursor, total_count, limit } }`
- **Timestamps:** each item includes `created_at` and `updated_at` as ISO 8601 UTC (`format: date-time` in OpenAPI)
- **Rate limits:** responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`; `429` responses include `Retry-After`

Serve the spec from a running server at **`GET /openapi.yaml`**.

### Lint the OpenAPI spec

```sh
npm run lint:openapi
# or
npm run check:api-contract
```

Spectral extends `spectral:oas` and enforces team pagination rules via [`.spectral.yaml`](.spectral.yaml) (required `meta` fields, nullable `next_cursor`, ISO timestamps, documented rate-limit headers).

### Smoke test (manual)

With `npm run dev` running and `.env` configured:

```sh
# First page (inspect headers and meta)
curl -i 'http://localhost:3000/api/v1/items?limit=2'

# Next page (replace CURSOR with meta.next_cursor from the previous response)
curl -s 'http://localhost:3000/api/v1/items?limit=2&cursor=CURSOR'
```

Verify `total_count` stays constant, cursors chain until `meta.next_cursor` is `null` on the last page, and rate-limit headers are present.

### Pre-release assessment (avoid breaking consumers)

1. Change [`openapi.yaml`](openapi.yaml) first; bump `info.version` for breaking changes.
2. Run `npm run lint:openapi` — zero errors required.
3. Align [`src/types/pagination.ts`](src/types/pagination.ts) and the items handler/service with the spec.
4. Run the curl smoke tests above.
5. Treat these as **breaking** without a major version: renaming or removing `meta.*`, changing `next_cursor` semantics, dropping `total_count`, or changing datetime format.

## Logging Configuration
Logging automatically switches based on the `NODE_ENV`:
- **Development:** Logs in text format for readability and stored in a text file (`logs/server.log`).
- **Production:** Logs in JSON format for structured logging, stored in a volume to persist across redeploys.

## Contributing
1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push to your fork and submit a pull request.

## License
This project is licensed under the MIT License.
