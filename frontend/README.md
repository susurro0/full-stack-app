# Contact Management App - Frontend

## Overview
This is the frontend for the Contact Management application, built using React and Material-UI. The application allows users to manage contacts, including creating, updating, deleting, and viewing a list of contacts.

## Features
- Display a list of contacts
- Add new contacts
- Edit existing contacts
- Delete contacts
- Copy contact ID to clipboard
- Validation for contact fields
- Snackbar notifications for success and error messages

## Tech Stack
- React
- TypeScript
- Material-UI
- Formik & Yup (for form handling and validation)

## Setup Instructions

### Prerequisites
- Node.js (>= 14.x)
- npm or yarn

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/contact-management-frontend.git
   cd contact-management-frontend
   ```
2. Install dependencies:
   ```sh
   npm install  # or yarn install
   ```
3. Start the development server:
   ```sh
   npm start  # or yarn start
   ```

## Testing

To run tests, use the following command:
    ```
    npm test
    ```

This will execute unit and integration tests to ensure the application functions as expected.

## Project Structure
```
├── src
│   ├── components       # Reusable UI components
│   ├── services         # API service functions
│   ├── types            # TypeScript type definitions
│   ├── utils            # Utility functions (e.g., logger)
│   ├── App.tsx          # Main application component
│   ├── index.tsx        # Entry point
├── public               # Static assets
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Documentation
```

## API Endpoints
The frontend interacts with a backend service via the following endpoints:
- `GET /contacts` - Fetch all contacts
- `GET /contacts/:id` - Fetch a contact by ID
- `POST /contacts` - Create a new contact
- `PUT /contacts/:id` - Update a contact
- `DELETE /contacts/:id` - Delete a contact

## Environment Variables
To configure the API base URL, create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:9001
```

## Contributing
1. Fork the repository
2. Create a new feature branch (`git checkout -b feature-name`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

## License
This project is licensed under the MIT License.