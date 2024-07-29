# Aqua Dinner and Drinks Schema

This project is a web application for managing dinner and drink schedules. It consists of a client-side application built with React and a server-side REST API built with Node.js and Express.

## Table of Contents

- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [API Endpoints](#api-endpoints)
- [Learn More](#learn-more)

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```

2. Install dependencies for the client:
    ```sh
    cd client
    npm install
    ```

3. Install dependencies for the server:
    ```sh
    cd ../server
    npm install
    ```

### Running the Application

1. Start the server:
    ```sh
    cd server
    npm run dev
    ```

2. Start the client:
    ```sh
    cd ../client
    npm start
    ```

Open [http://localhost:3000](http://localhost:3000) to view the client application in your browser.

## Available Scripts

### Client

In the `client` directory, you can run:

- `npm start`: Runs the app in development mode.
- `npm test`: Launches the test runner in interactive watch mode.
- `npm run build`: Builds the app for production.
- `npm run eject`: Ejects the configuration files and dependencies.

### Server

In the `server` directory, you can run:

- `npm start`: Starts the server.
- `npm run dev`: Starts the server with nodemon for development.


## Dependencies

### Client

- `react`: JavaScript library for building user interfaces.
- `react-scripts`: Scripts and configuration used by Create React App.
- `tailwindcss`: Utility-first CSS framework.

### Server

- `express`: Web framework for Node.js.
- `mongoose`: MongoDB object modeling tool.
- `jsonwebtoken`: JSON Web Token implementation.
- `bcryptjs`: Library to hash passwords.
- `body-parser`: Node.js body parsing middleware.
- `cookie-parser`: Parse Cookie header and populate req.cookies.
- `cors`: Middleware to enable CORS.
- `dotenv`: Loads environment variables from a .env file.
- `joi`: Data validation library.
- `nodemon`: Utility that monitors for changes in source and automatically restarts the server.

## API Endpoints

### User

- `POST /api/users`: Create a new user.
- `GET /api/users/:id`: Get user by ID.
- `PUT /api/users/:id`: Update user by ID.
- `DELETE /api/users/:id`: Delete user by ID.

### Shift

- `POST /api/shifts`: Create a new shift.
- `GET /api/shifts/:id`: Get shift by ID.
- `PUT /api/shifts/:id`: Update shift by ID.
- `DELETE /api/shifts/:id`: Delete shift by ID.

### Availability

- `POST /api/availability`: Create a new availability.
- `GET /api/availability/:id`: Get availability by ID.
- `PUT /api/availability/:id`: Update availability by ID.
- `DELETE /api/availability/:id`: Delete availability by ID.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
