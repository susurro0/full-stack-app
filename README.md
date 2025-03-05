# Contact Management Application

This project is a full-stack contact management application that includes both a backend API built with Express.js and SQLite, and a frontend application built with React and Material-UI. The app allows users to manage contacts with full CRUD (Create, Read, Update, Delete) functionality.

## Overview

- **Backend**: A serverless API built with Express and SQLite for lightweight storage and CRUD operations on contacts.
- **Frontend**: A React-based frontend application for managing contacts, providing a user interface to interact with the backend API.

## Features

### Backend (Express API)
- Serverless deployment with the Serverless Framework
- SQLite database for storing contact information
- CORS enabled for cross-origin requests
- UUID for unique contact identification
- API endpoints for CRUD operations on contacts

### Frontend (React)
- Display a list of contacts
- Add, edit, and delete contacts
- Copy contact ID to clipboard
- Validation for contact fields
- Snackbar notifications for success/error messages

## Technologies Used

- **Backend**:
  - Express.js
  - SQLite (for lightweight database)
  - Serverless Framework
  - CORS
  - UUID
  - Node.js

- **Frontend**:
  - React
  - TypeScript
  - Material-UI
  - Formik & Yup (for form handling and validation)
  
## Folder Structure

### Backend
```
backend/
├── routes/              # API routing (Express.js) 
├── server.ts            # Main entry point for Express API
├── serverless.yml       # Serverless Framework configuration
└── db.ts                # SQLite database files
```

### Frontend
```
frontend/
│
├── src/
│   ├── components/      # Reusable UI components
│   ├── services/        # Functions for API interaction
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions (e.g., logger)
│   ├── App.tsx          # Main app component
│   ├── index.tsx        # Entry point for React app
└── package.json         # Project metadata and dependencies
```

## Installation & Setup

### Prerequisites
- **Node.js** (>= 14.x)
- **Serverless Framework** (for backend deployment)
- **npm** or **yarn**

### Backend Setup

1. **Clone the repository**:
   ```sh
   git clone https://github.com/susurro0/full-stack-app.git
   cd backend
   ```

2. **Install dependencies**:
   ```sh
   npm install
   ```

3. **Run the backend locally**:
   ```sh
   npm run dev
   ```
   The API will be available at `http://localhost:9001` by default.

5. **Deploy with Serverless Framework** (optional for deployment):
   ```sh
   serverless deploy
   ```

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```sh
   cd frontend
   ```

2. **Install dependencies**:
   ```sh
   npm install  # or yarn install
   ```

3. **Start the development server**:
   ```sh
   npm start  # or yarn start
   ```
   The frontend will be available at `http://localhost:3000`.

4. **Set API URL**:
   In the frontend directory, create a `.env` file and set:
   ```
   REACT_APP_API_URL=http://localhost:9001
   ```

## API Endpoints

### Backend API
- **GET /contacts**: Fetch all contacts
- **GET /contacts/:id**: Fetch a contact by ID
- **POST /contacts**: Create a new contact
- **PUT /contacts/:id**: Update an existing contact
- **DELETE /contacts/:id**: Delete a contact

## Testing

### Backend Testing
Run tests for the backend using:
```sh
npm test
```

### Frontend Testing
To run tests for the frontend, use:
```sh
npm test
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries, feel free to reach out to:

- **Deniz Cingoez** - [dcingoez@yahoo.com](mailto:dcingoez@yahoo.com)
