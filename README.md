# Hospital Management System

A full-stack hospital management system project with a Node.js/Express backend and a React frontend.

## Project Overview

- **Backend:** Express server with MySQL database connectivity for patient management APIs.
- **Frontend:** React application built with Vite, using Tailwind CSS for styling and Axios for API requests.

## Key Features

- Fetch patient records from the backend
- Add new patient records to the database
- Modular frontend and backend structure for easier development

## Technologies Used

- Backend: Node.js, Express, MySQL, CORS
- Frontend: React, Vite, Tailwind CSS, Axios

## Getting Started

### Backend

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```
4. The backend listens on `http://localhost:5000`.

> Note: The backend expects a MySQL database named `hospital_db`. Update the credentials in `Backend/server.js` if needed.

### Frontend

1. Open a terminal and navigate to the frontend folder:
   ```bash
   cd "Hosp Management Sys"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

## Project Structure

```
Hospital Management System/
├── Backend/
│   ├── package.json
│   ├── server.js
│   └── node_modules/ (generated)
├── Hosp Management Sys/
│   ├── public/
│   ├── src/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── assets/
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── README.md
├── README.md
```

## Notes

- The frontend currently contains the base React/Vite scaffold and can be extended with API calls.
- The backend includes patient list and add patient endpoints.
- For production use, secure database credentials and add validation/error handling.
