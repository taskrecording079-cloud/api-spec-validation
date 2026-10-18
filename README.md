# Node.js TypeScript Express Server

This repository contains a Node.js server built with Express and TypeScript. It follows a structured architecture with service, controller, and middleware layers. The server includes token-based authentication and logging configured to automatically switch between JSON logging (for production) and console-based logging (for local development). Logs are stored and can be accessed via an endpoint. In production, logs are stored in a volume to persist across redeploys.

## Features
- **Express.js** as the web framework
- **TypeScript** for type safety
- **Token-based authentication** 
- **Service-Controller architecture**
- **Middleware support**
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
│── app.ts       # Main Express server setup
│── server.ts    # Server entry point
```

## Authentication
To access protected routes, include a valid token in the `Authorization` header.


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
