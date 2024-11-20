# Event Management Platform

This is an Event Management API built using **Node.js** and **Express**. The API provides functionalities for user registration, login, event creation, event registration, and role-based access control for event organizers and participants.

## Features

- **User Authentication & Authorization**
  - User registration and login with JWT-based authentication
  - Role-based authorization (organizers can manage events, attendees can register for events)

- **Event Management**
  - Create, read, update, and delete events (organizers only)
  - Participants can register for events

- **Middleware**
  - Request validation using Celebrate
  - Authentication and role-based authorization
  - Standardized API responses with custom error handling

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register a new user
  - Request body: 
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```
  
- `POST /login` - Login an existing user
  - Request body:
    ```json
    {
      "email": "john.doe@example.com",
      "password": "password123"
    }
    ```

### Event Routes (`/api/event`)

- `POST /` - Create a new event (Only accessible by organizers)
  - Request body: 
    ```json
    {
      "title": "Tech Conference",
      "description": "A tech event for developers",
      "date": "2024-12-01",
      "time": "10:00 AM",
      "location": "San Francisco"
    }
    ```
  
- `POST /:id/register` - Register for an event (User must be authenticated)
  - Path parameter: `id` (Event ID)

- `GET /` - Get all events

- `GET /:id` - Get details of a specific event by ID
  - Path parameter: `id` (Event ID)

- `PUT /:id` - Update an existing event (Only accessible by organizers)
  - Path parameter: `id` (Event ID)
  - Request body:
    ```json
    {
      "title": "Updated Event Title",
      "description": "Updated event description",
      "date": "2024-12-02",
      "time": "2:00 PM",
      "location": "Updated Location"
    }
    ```

- `DELETE /:id` - Delete an event (Only accessible by organizers)
  - Path parameter: `id` (Event ID)

## Current Test Coverage

File                                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
---------------------------------------|---------|----------|---------|---------|-------------------
All files                              |   92.55 |    68.18 |     100 |   92.55 |                   
 event-management-platform             |     100 |      100 |     100 |     100 |                   
  app.js                               |     100 |      100 |     100 |     100 |                   
 event-management-platform/config      |     100 |     87.5 |     100 |     100 |                   
  env.js                               |     100 |     87.5 |     100 |     100 | 5                 
 event-management-platform/controllers |   93.75 |      100 |     100 |   93.75 |                   
  authController.js                    |     100 |      100 |     100 |     100 |                   
  eventController.js                   |   91.66 |      100 |     100 |   91.66 | 13,36,45          
 event-management-platform/middlewares |   84.31 |       50 |     100 |   84.31 |                   
  authenticate.js                      |   82.35 |       50 |     100 |   82.35 | 10,16,22          
  authorizeRole.js                     |      80 |       50 |     100 |      80 | 12,16             
  errorHandler.js                      |      75 |       50 |     100 |      75 | 11-12,21          
  requestLogger.js                     |     100 |      100 |     100 |     100 |                   
  validateRequest.js                   |     100 |      100 |     100 |     100 |                   
 event-management-platform/models      |     100 |      100 |     100 |     100 |                   
  event.js                             |     100 |      100 |     100 |     100 |                   
 event-management-platform/routes      |     100 |      100 |     100 |     100 |                   
  authRoute.js                         |     100 |      100 |     100 |     100 |                   
  eventRoute.js                        |     100 |      100 |     100 |     100 |                   
 event-management-platform/services    |   91.93 |    77.27 |     100 |   91.93 |                   
  authService.js                       |     100 |      100 |     100 |     100 |                   
  eventService.js                      |   86.84 |    68.75 |     100 |   86.84 | 15,19,43,51,66    
 event-management-platform/utils       |     100 |       25 |     100 |     100 |                   
  apiResponse.js                       |     100 |       25 |     100 |     100 | 9-37              
  logger.js                            |     100 |      100 |     100 |     100 |                   

## Setup Instructions

### Prerequisites

- **Node.js** (v12 or higher)
- **MongoDB** (local or remote database)
- **Postman or cURL** (for testing the API)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Tejas150/event-management-platform.git
   cd event-management-platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory and add the following:
   
     ```env
     PORT=8080
     NODE_ENV=development
     MONGO_URI=mongodb://localhost:27017/eventDB  # MongoDB connection URI
     JWT_SECRET=your_jwt_secret_here  # Secret for JWT
     ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:8080` by default.

### Testing

You can test the API using tools like **Postman** or **cURL**. Here are some example requests:

#### Register a New User

- **Endpoint:** `POST /api/auth/register`
- **Body:** 
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

#### Login a User

- **Endpoint:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

#### Create an Event (Organizer Only)

- **Endpoint:** `POST /api/event`
- **Authorization:** Bearer token (from login)
- **Body:**
  ```json
  {
    "title": "Tech Conference",
    "description": "A tech event for developers",
    "date": "2024-12-01",
    "time": "10:00 AM",
    "location": "San Francisco"
  }
  ```

#### Get All Events

- **Endpoint:** `GET /api/event`

#### Register for an Event (User Only)

- **Endpoint:** `POST /api/event/:id/register`
- **Authorization:** Bearer token (from login)

## Error Handling

The API has custom error handling. Some common errors include:

- **400**: Bad Request (Invalid request)
- **401**: Unauthorized (No token or invalid token)
- **403**: Forbidden (User does not have the right permissions)
- **404**: Not Found (Event not found)
- **500**: Internal Server Error

## Middleware

### Authentication Middleware (`authenticate.js`)

This middleware checks for a valid JWT token in the `Authorization` header. If valid, it attaches the user's information to the `req.user` object.

### Authorization Middleware (`authorizeRole.js`)

This middleware checks the user's role (e.g., `organizer` or `attendee`). Only users with the correct role can perform certain actions, such as creating or updating events.

### Validation Middleware (`validateRequest.js`)

- Validates the request body using **Celebrate** for user registration, login, and event creation.

### Response Handler (`apiResponse.js`)

This module provides standardized API responses, including success and error responses, to ensure consistent output.

## Technologies Used

- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web framework for Node.js
- **MongoDB** - NoSQL database for storing user and event data
- **JWT** - JSON Web Tokens for user authentication
- **Celebrate** - Validation middleware for Express.js
- **Mongoose** - MongoDB ORM for data modeling
- **Winston** - Logger for application logs
- **Jest** - Testing framework for unit and integration tests
