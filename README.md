# DEV-NOTIFY Tracker

A web application that helps users stay updated on upcoming hackathons and LeetCode contests. The platform allows users to view, register, and set reminders for these events, ensuring they never miss important contests or deadlines.

## Features

- User authentication (signup, login, profile management)
- Browse and filter hackathons and coding contests
- Save favorite events
- Set reminders for upcoming events
- Search functionality
- Responsive design for all devices

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

This project is organized as a monorepo with separate frontend and backend directories:

\`\`\`
Dev-Notify/
├── frontend/         # React frontend application
├── backend/          # Node.js/Express backend
└── package.json      # Root package.json with scripts to run both
\`\`\`

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   \`\`\`
   git clone https://github.com/SnehaChaursia/DevNotify.git
   cd .\DevNotify\
   \`\`\`

2. Install all dependencies (frontend and backend)
   \`\`\`
   npm run install:all
   \`\`\`

   Alternatively, you can install dependencies separately:
   \`\`\`
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   \`\`\`

3. Set up environment variables:

   For the backend:
   \`\`\`
   # In the backend directory
   cp .env.example .env
   \`\`\`
   Then edit the `.env` file with your MongoDB connection string, JWT secret, and other settings.

   For the frontend:
   \`\`\`
   # In the frontend directory
   cp .env.example .env
   \`\`\`
   Edit the `.env` file to point to your backend API URL.

### Running the Application

You can run both frontend and backend concurrently:

\`\`\`
npm start
\`\`\`

Or run them separately:

1. Start the backend server
   \`\`\`
   npm run start:backend
   \`\`\`

2. In a new terminal, start the frontend
   \`\`\`
   npm run start:frontend
   \`\`\`

3. Open your browser and navigate to `http://localhost:3000`

## Development

### Backend Development

The backend is a Node.js/Express application located in the `backend` directory.

\`\`\`
cd backend
npm run dev
\`\`\`

The server will run on `http://localhost:5000` by default.

### Frontend Development

The frontend is a React application located in the `frontend` directory.

\`\`\`
cd frontend
npm start
\`\`\`

The development server will run on `http://localhost:3000`.

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
\`\`\`

Let's create a script to help set up the environment files:
