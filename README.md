# DEV-NOTIFY Tracker

A web application that helps users stay updated on upcoming hackathons and LeetCode contests. The platform allows users to view, register, and set reminders for these events, ensuring they never miss important contests or deadlines.

## Features

- User authentication (signup, login, profile management)
- Browse and filter hackathons and coding contests
- Save favorite events
- Set reminders for upcoming events with real-time notifications
- Search functionality
- Responsive design for all devices
- Real-time notifications using Socket.IO
- Browser notifications support

## Tech Stack

- **Frontend**: React.js, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Notifications**: Browser Notifications API, Socket.IO

## Project Structure

This project is organized as a monorepo with separate frontend and backend directories:

```
Dev-Notify/
├── frontend/         # React frontend application
├── backend/          # Node.js/Express backend
└── package.json      # Root package.json with scripts to run both

```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Modern web browser with notifications support

### Installation

1. Clone the repository
```

git clone [https://github.com/SnehaChaursia/DevNotify.git](https://github.com/SnehaChaursia/DevNotify.git)
cd DevNotify

```

2. Install all dependencies (frontend and backend)
```

npm run install\:all

```

Alternatively, you can install dependencies separately:
```

# Install root dependencies

npm install

# Install frontend dependencies

cd frontend
npm install

# Install backend dependencies

cd ../backend
npm install

```

3. Set up environment variables:

#### Manual Setup:

For the backend:
```

# In the backend directory

cp .env.example .env

```
Then edit the `.env` file with your MongoDB connection string, JWT secret, and other settings.

For the frontend:
```

# In the frontend directory

cp .env.example .env

```
Edit the `.env` file to point to your backend API URL.

#### 🔁 Or use the setup script:

To simplify setup, you can use the `setup-env.sh` script (for Mac/Linux):

```

bash setup-env.sh

```

This script will:

- Copy `.env.example` → `.env` in both `frontend` and `backend`
- Remind you to update environment variables manually

> 💡 For Windows, use Git Bash or do the above steps manually.

---

### Running the Application

You can run both frontend and backend concurrently:

```

npm start

```

Or run them separately:

1. Start the backend server
```

npm run start\:backend

```

2. In a new terminal, start the frontend
```

npm run start\:frontend

```

3. Open your browser and navigate to `http://localhost:3000`

---

## Reminder System

The application includes a comprehensive reminder system:

### Features
- Set reminders for any event
- Real-time notifications using Socket.IO
- Browser notifications support
- Email notifications (for authenticated users)
- Reminder management dashboard

### How to Use Reminders
1. Navigate to any event detail page
2. Click the bell icon to set a reminder
3. Grant notification permissions when prompted
4. Receive notifications when the event is approaching

### Notification Types
- Browser notifications
- In-app notifications
- Email notifications (for authenticated users)

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - If port 3000 is in use, the frontend will ask to use a different port
   - If port 5000 is in use, you can kill the process:
     ```bash
     lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9
     ```

2. **MongoDB Connection Issues**
   - Ensure MongoDB is running locally or your Atlas connection string is correct
   - Check the MongoDB connection in the backend logs

3. **Notification Permission Issues**
   - Ensure your browser supports notifications
   - Check browser settings to allow notifications for localhost
   - Clear browser cache if notifications are not working

4. **Socket.IO Connection Issues**
   - Check if the backend server is running
   - Ensure the FRONTEND_URL in backend .env matches your frontend URL
   - Check browser console for connection errors

---

## Development

### Backend Development

The backend is a Node.js/Express application located in the `backend` directory.

```

cd backend
npm run dev

```

The server will run on `http://localhost:5000` by default.

### Frontend Development

The frontend is a React application located in the `frontend` directory.

```

cd frontend
npm start

```

The development server will run on `http://localhost:3000`.

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

---

## Contributing

1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add some amazing feature'`)  
4. Push to the branch (`git push origin feature/amazing-feature`)  
5. Open a Pull Request  

## License

This project is licensed under the MIT License - see the LICENSE file for details.


