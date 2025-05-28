"use client"

import { useState, useEffect, useContext } from "react";
import { ThemeProvider, CssBaseline, Container, Box, AppBar, Toolbar } from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthContext, { AuthProvider } from "./context/AuthContext";
import NotificationBell from "./components/NotificationBell";
import Navbar from "./components/Navbar";
import Introduction from "./components/Introduction";
import EventsList from "./components/EventsList";
import EventDetail from "./components/EventDetail";
import MyReminders from "./components/MyReminders";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ConnectionStatus from "./components/ConnectionStatus";
import { checkReminders } from "./services/ReminderService";
import { NotificationProvider } from "./context/NotificationContext";
import theme from "./theme";

const EventDetailWrapper = ({ events, onBack, onViewDetails }) => {
  const { eventId } = useParams();
  const event = events.find((e) => e._id === eventId);
  return event ? (
    <EventDetail event={event} events={events} onBack={onBack} onViewDetails={onViewDetails} />
  ) : (
    <Navigate to="/" replace />
  );
};

function App({ isAdminAuthenticated }) {
  const [events, setEvents] = useState([]);
  const [showReminders, setShowReminders] = useState(false);
  const navigate = useNavigate();

  const viewEventDetails = (id) => {
    navigate(`/event/${id}`);
    window.scrollTo(0, 0);
  };

  const toggleRemindersModal = () => setShowReminders(!showReminders);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/events");
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    checkReminders();
    const id = setInterval(checkReminders, 60000);
    return () => clearInterval(id);
  }, []);

  const HomePage = () => (
    <Box>
      <Introduction />
      <EventsList events={events} title="Explore Hackathons & Contests" onViewDetails={viewEventDetails} />
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppBar position="static" color="default">
          <Toolbar>
            <Navbar onViewReminders={toggleRemindersModal} />
          </Toolbar>
        </AppBar>

        <Container component="main" maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:eventId" element={<EventDetailWrapper events={events} onBack={() => navigate("/")} onViewDetails={viewEventDetails} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/admin" element={isAdminAuthenticated ? <AdminPanel /> : <Navigate to="/admin-login" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <MyReminders isOpen={showReminders} onClose={toggleRemindersModal} onViewEvent={viewEventDetails} />
          <ConnectionStatus />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

const InnerApp = () => {
  const { isAdminAuthenticated } = useContext(AuthContext);
  return <App isAdminAuthenticated={isAdminAuthenticated} />;
};

const AppWithRouter = () => (
  <Router>
    <AuthProvider>
      <NotificationProvider>
        <InnerApp />
      </NotificationProvider>
    </AuthProvider>
  </Router>
);

export default AppWithRouter;
