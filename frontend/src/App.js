"use client"

import { useState, useEffect } from "react"
import { ThemeProvider, CssBaseline, Container, Box, AppBar, Toolbar } from '@mui/material'
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Introduction from "./components/Introduction"
import EventsList from "./components/EventsList"
import EventDetail from "./components/EventDetail"
import MyReminders from "./components/MyReminders"
import ProfilePage from "./pages/ProfilePage"
import AuthPage from "./pages/AuthPage"
import SettingsPage from "./pages/SettingsPage"
import ConnectionStatus from "./components/ConnectionStatus"
import eventsData from "./data/eventsData"
import { checkReminders } from "./services/ReminderService"
import { NotificationProvider } from './context/NotificationContext'
import NotificationBell from './components/NotificationBell'
import { ThemeModeProvider, useThemeMode } from './context/ThemeContext'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import ContactPage from './pages/ContactPage'
import AboutPage from './pages/AboutPage'

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
  const { mode, toggleColorMode } = useThemeMode();

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
    <Box>
      <Introduction />
      <EventsList 
        events={eventsData} 
        title="Explore Hackathons & Contests" 
        onViewDetails={viewEventDetails} 
      />
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Navbar onViewReminders={toggleRemindersModal} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotificationBell />
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
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
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <MyReminders 
          isOpen={showReminders} 
          onClose={toggleRemindersModal} 
          onViewEvent={viewEventDetails} 
        />

        <ConnectionStatus />
      </Container>
    </Box>
  )
}

const AppWithRouter = () => {
  return (
    <Router>
      <ThemeModeProvider>
        <AuthProvider>
          <NotificationProvider>
            <Toaster position="top-right" />
            <App />
          </NotificationProvider>
        </AuthProvider>
      </ThemeModeProvider>
    </Router>
  );
};

export default AppWithRouter;
