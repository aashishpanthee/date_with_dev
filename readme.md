# Date with Dev API

> A Social Networking API for connecting developers. Find your perfect coding partner!

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Profile](#profile-endpoints)
  - [Connection Requests](#connection-request-endpoints)
  - [User](#user-endpoints)
- [Error Handling](#error-handling)
- [Data Models](#data-models)
  - [User](#user)
  - [ConnectionRequest](#connectionrequest)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

This API allows developers to connect with each other, send connection requests, and manage their profiles. Think of it as a "Tinder for Developers," facilitating networking and collaboration opportunities.

## Features

- **User Management:** Create, update, and retrieve developer profiles.
- **Connection Requests:** Send, accept, and reject connection requests.
- **Authentication:** Secure API using JWT (JSON Web Tokens).
- **Profile Matching:** (Future Enhancement) Suggest potential connections based on skills and interests.
- **Real-time Chat:** (Future Enhancement) Enable real-time communication between connected developers.

## Authentication

This API uses JSON Web Tokens (JWT) for authentication. Upon successful login, a token is issued which must be included in subsequent API requests in the Authorization header using the Bearer scheme.

Example:

```
Authorization: Bearer <your_jwt_token>
```

Tokens expire after 1 hour, requiring users to re-authenticate.

## API Endpoints

### Authentication Endpoints

- **POST /auth/signup** - Register a new user
- **POST /auth/login** - Authenticate and receive a JWT token
- **POST /auth/logout** - Invalidate the current JWT token

### Profile Endpoints

- **GET /profile/view** - View your profile
- **PATCH /profile/edit** - Update your profile information
- **PATCH /profile/password** - Update your password

### Connection Request Endpoints

- **POST /request/send/interested/:userId** - Send an interested request to a user
- **POST /request/send/ignore/:userId** - Ignore a user
- **POST /request/review/accepted/:requestId** - Accept a connection request
- **POST /request/review/rejected/:requestId** - Reject a connection request

### User Endpoints

- **GET /user/connections** - Get all your connections
- **GET /user/requests/received** - Get all connection requests received
- **GET /user/feed** - Get profiles of other users on the platform

## Error Handling

The API uses conventional HTTP response codes to indicate the success or failure of requests:

- **2xx** - Success
- **4xx** - Client errors (invalid request, unauthorized)
- **5xx** - Server errors

Each error response includes:

- **status** - HTTP status code
- **message** - Human-readable error description
- **error** - Error details when applicable

Example error response:

```json
{
  "status": 400,
  "message": "Invalid request parameters",
  "error": "First name is required"
}
```

## Data Models

### User

```javascript
{
  firstName: String,         // Required, 4-50 chars
  lastName: String,          // Optional, max 30 chars
  emailId: String,           // Required, unique, valid email
  password: String,          // Required, strong password
  age: Number,               // Required, min 18
  gender: String,            // Required, enum: ["male", "female", "other"]
  photoUrl: String,          // Default profile picture URL
  about: String,             // Optional, max 500 chars
  skills: [String]           // Optional, max 15 skills
}
```

### ConnectionRequest

```javascript
{
  fromUserId: ObjectId,      // Required, reference to User
  toUserId: ObjectId,        // Required, reference to User
  status: String             // Required, enum: ["rejected", "accepted", "ignore", "interested"]
}
```

## Getting Started

### Prerequisites

- Node.js (version 14.x or higher)
- npm (version 6.x or higher) or yarn
- MongoDB (version 4.x or higher)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/date-developer.git
   cd date-developer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the root directory based on `example.env`:

   ```bash
   cp example.env .env
   ```

2. Update the environment variables in the `.env` file:
   ```
   MONGODB_URL=mongodb://localhost:27017/date-developer
   JWT_SECRET=your_jwt_secret_here
   ```

### Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. The API will be available at `http://localhost:4000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Contact

For questions or support, please contact [Aashish Panthee](mailto:aashishpanthee060@gmail.com).
