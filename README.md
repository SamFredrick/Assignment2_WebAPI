# CSC3916 – Assignment 2 Web API

## Links

## Live API (Render)

Base URL (intentionally rejected per assignment requirements):  
https://assignment2-webapi.onrender.com

### Available Routes
- **POST** `/signup`  
  https://assignment2-webapi.onrender.com/signup

- **POST** `/signin`  
  https://assignment2-webapi.onrender.com/signin

- **GET / POST / PUT / DELETE** `/movies`  
  https://assignment2-webapi.onrender.com/movies

> Note: The base URL `/` intentionally returns an error message, as required by the assignment.
- **GitHub Repository:** https://github.com/SamFredrick/Assignment2_WebAPI

---

## Overview

This project is a Node.js Web API that:

- Accepts GET, POST, PUT, DELETE requests
- Rejects unsupported HTTP methods
- Uses environment variables
- Implements Basic Authentication and JWT Authentication
- Returns headers, query parameters, and environment data
- Is deployed using Render
- Includes Postman tests verifying requirements

---

## Environment Variables

### Local Setup

Create a `.env` file in the project root with the following variables:

```
UNIQUE_KEY=CSC3916_SAMFREDRICK_HW2_9f3b2a71c4e8
SECRET_KEY=9f6c2d4e7a1b8c3f5d0e2a4b6c8d1f3a7e9b2c4d
```

 **Note:** The `.env` file is gitignored and not stored in the repository.

### Render Deployment

Add the same variables in the Render dashboard:

```
Render → Service → Environment Variables
```

---

## Getting Started

### Installation

Install dependencies:

```bash
npm install
```

### Run Locally

Start the server:

```bash
node server.js
```

The API will run on: `http://localhost:8080`

---

## Authentication

### Basic Authentication

Used for: `DELETE /movies`

Credentials are hardcoded in the auth module.

### JWT Authentication

Used for: `PUT /movies`

**Flow:**

1. Call `POST /signin` to receive a token
2. Response includes:
   ```json
   {
     "success": true,
     "token": "JWT <token>"
   }
   ```
3. Include the token in subsequent requests:
   ```
   Authorization: JWT <token>
   ```

---

## API Routes

### POST `/signup`

Create a new user account.

**Request:** Username and password required

**Success Response:**
```json
{
  "success": true,
  "msg": "Successful created new user."
}
```

**Supported Methods:** POST only

---

### POST `/signin`

Sign in and receive a JWT token.

**Success Response:**
```json
{
  "success": true,
  "token": "JWT <token>"
}
```

**Error Response:** `401 Unauthorized` for invalid users

**Supported Methods:** POST only

---

### GET `/movies`

Retrieve movies.

**Success Response:**
```json
{
  "status": 200,
  "message": "GET movies",
  "headers": {},
  "query": {},
  "env": "UNIQUE_KEY"
}
```

---

### POST `/movies`

Save a new movie.

**Success Response:**
```json
{
  "status": 200,
  "message": "movie saved",
  "headers": {},
  "query": {},
  "env": "UNIQUE_KEY"
}
```

---

### PUT `/movies`

Update a movie. **Requires JWT Authentication**

**Success Response:**
```json
{
  "status": 200,
  "message": "movie updated",
  "headers": {},
  "query": {},
  "env": "UNIQUE_KEY"
}
```

---

### DELETE `/movies`

Delete a movie. **Requires Basic Authentication**

**Success Response:**
```json
{
  "status": 200,
  "message": "movie deleted",
  "headers": {},
  "query": {},
  "env": "UNIQUE_KEY"
}
```

---

## Unsupported HTTP Methods

Any unsupported HTTP method returns:

```
This route doesn't support the HTTP method.
```

---

## Base Route

Requests to the root path `/` are rejected.

---

## Postman Tests

The Postman collection includes comprehensive tests for:

- Valid requests for all endpoints
- Failed authentication requests
- Basic Auth (correct and incorrect credentials)
- JWT authentication flow (signin → token storage → PUT /movies)

### Token Storage Script

Postman automatically stores the token from the signin response:

```javascript
const data = pm.response.json();
pm.collectionVariables.set("token", data.token);
```

This token is then used in subsequent authenticated requests.

---

## Additional Notes

- All responses include headers, query parameters, and environment variable data
- The API validates authentication before processing requests
- Environment variables are securely managed through Render


[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/52007893-d200f4e0-007c-4f45-91a9-ecbcae858a3f?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D52007893-d200f4e0-007c-4f45-91a9-ecbcae858a3f%26entityType%3Dcollection%26workspaceId%3De0becdfd-a376-4b15-b712-e43c8f8ce6f3#?env%5BAssignment2%20Env%5D=W3sia2V5IjoiYmFzZVVybFx0aHR0cHM6Ly9hc3NpZ25tZW50Mi13ZWJhcGkub25yZW5kZXIuY29tIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6Imh0dHBzOi8vYXNzaWdubWVudDItd2ViYXBpLm9ucmVuZGVyLmNvbSIsImNvbXBsZXRlU2Vzc2lvblZhbHVlIjoiaHR0cHM6Ly9hc3NpZ25tZW50Mi13ZWJhcGkub25yZW5kZXIuY29tIiwic2Vzc2lvbkluZGV4IjowfSx7ImtleSI6InRva2VuIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6IkpXVC4uLiIsImNvbXBsZXRlU2Vzc2lvblZhbHVlIjoiSldUIGV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwWkNJNklqQXhNRE0zTkdFMFltVm1PRFZtTW1RMVpqbGhNR1V6TldabU5EUXhZVGt3WTJZd1lUTTFOakVpTENKMWMyVnlibUZ0WlNJNkluTmhiU0lzSW1saGRDSTZNVGMzTWpReU1UUTBNSDAuR2JZQ3hNZjJDT0xnYWp3Mnh6V191MnV2dkVFUi1WQ3IzU3hqLWo2Mmh1TSIsInNlc3Npb25JbmRleCI6MX1d)
