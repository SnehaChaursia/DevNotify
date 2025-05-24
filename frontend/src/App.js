"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Introduction from "./components/Introduction"
import EventsList from "./components/EventsList"
import EventDetail from "./components/EventDetail"
import MyReminders from "./components/MyReminders"
import ProfilePage from "./pages/ProfilePage"
import AuthPage from "./pages/AuthPage"
import ConnectionStatus from "./components/ConnectionStatus"
import eventsData from "./data/eventsData"
import { checkReminders } from "./services/ReminderService"
import { NotificationProvider } from './context/NotificationContext'
import NotificationBell from './components/NotificationBell'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// EventDetail wrapper component to handle params
const EventDetailWrapper = ({ events, onBack, onViewDetails }) => {
  const { eventId } = useParams();
  const event = events.find((event) => event.id === Number(eventId));
  
  if (!event) {
    return <Navigate to="/" replace />;
  }

  return (
    <EventDetail
      event={event}
      events={events}
      onBack={onBack}
      onViewDetails={onViewDetails}
    />
  );
};

function App() {
  const [showReminders, setShowReminders] = useState(false)
  const navigate = useNavigate();

  // Function to view event details
  const viewEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
    window.scrollTo(0, 0);
  }

  // Function to go back to events list
  const goBackToEvents = () => {
    navigate('/');
  }

  // Function to toggle reminders modal
  const toggleRemindersModal = () => {
    setShowReminders(!showReminders)
  }

  // Check for due reminders periodically
  useEffect(() => {
    // Check reminders on initial load
    checkReminders()

    // Set up interval to check reminders every minute
    const intervalId = setInterval(() => {
      checkReminders()
    }, 60000) // 60000 ms = 1 minute

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // Home page component
  const HomePage = () => (
    <>
      <Introduction />
      <EventsList 
        events={eventsData} 
        title="Explore Hackathons & Contests" 
        onViewDetails={viewEventDetails} 
      />
    </>
  )

  return (
    <AuthProvider>
      <NotificationProvider>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Navbar onViewReminders={toggleRemindersModal} />
                </div>
                <div className="flex items-center">
                  <NotificationBell />
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* User menu */}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route 
                path="/event/:eventId" 
                element={
                  <EventDetailWrapper
                    events={eventsData}
                    onBack={goBackToEvents}
                    onViewDetails={viewEventDetails}
                  />
                } 
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* My Reminders Modal */}
            <MyReminders 
              isOpen={showReminders} 
              onClose={toggleRemindersModal} 
              onViewEvent={viewEventDetails} 
            />

            {/* Connection Status Indicator */}
            <ConnectionStatus />
          </main>
        </div>
      </NotificationProvider>
    </AuthProvider>
  )
}

// Wrap App with Router
const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
