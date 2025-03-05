# Serverless Contacts API

This project is a serverless API built with Express, SQLite, and Serverless Framework to manage contacts. The API allows CRUD operations (Create, Read, Update, Delete) on contacts.

## Features
- Serverless deployment
- SQLite database for lightweight storage
- Express for API routing
- CORS enabled for cross-origin requests
- UUID for unique contact identification

## Installation & Setup

### Prerequisites
- Node.js (>= 14.x)
- Serverless Framework (if deploying)

### Install Dependencies
```sh
npm install
```

### Run Locally
```sh
npm start
```
The server runs on `http://localhost:9001` by default.

### Environment Variables
Create a `.env` file and set:
```
PORT=9001
NODE_ENV=development
```

## API Endpoints

### Get all contacts
```http
GET /contacts
```

### Get a contact by ID
```http
GET /contacts/:id
```

### Create a new contact
```http
POST /contacts
```
**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "1234567890",
  "age": 30
}
```

### Update a contact
```http
PUT /contacts/:id
```
**Body:** Same as `POST` request

### Delete a contact
```http
DELETE /contacts/:id
```

## Deployment

### Deploy with Serverless Framework
```sh
serverless deploy
```

### Invoke Function Locally
```sh
serverless invoke local --function handler
```

## Testing
Run tests using:
```sh
npm test
```

## License
This project is licensed under the MIT License.

