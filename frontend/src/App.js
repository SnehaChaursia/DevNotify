"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Introduction from "./components/Introduction"
import EventsList from "./components/EventsList"
import EventDetail from "./components/EventDetail"
import MyReminders from "./components/MyReminders"
import ProfilePage from "./pages/ProfilePage"
import ConnectionStatus from "./components/ConnectionStatus"
import eventsData from "./data/eventsData"
import { checkReminders } from "./services/ReminderService"

function App() {
  const [selectedEventId, setSelectedEventId] = useState(null)
  const [showReminders, setShowReminders] = useState(false)
  const [currentPage, setCurrentPage] = useState("home")

  // Function to view event details
  const viewEventDetails = (eventId) => {
    setSelectedEventId(eventId)
    setCurrentPage("event-detail")
    window.scrollTo(0, 0)
  }

  // Function to go back to events list
  const goBackToEvents = () => {
    setSelectedEventId(null)
    setCurrentPage("home")
  }

  // Function to toggle reminders modal
  const toggleRemindersModal = () => {
    setShowReminders(!showReminders)
  }

  // Function to navigate to profile page
  const navigateToProfile = () => {
    setCurrentPage("profile")
    window.scrollTo(0, 0)
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

  // Handle navigation based on URL
  useEffect(() => {
    const path = window.location.pathname

    if (path === "/profile") {
      setCurrentPage("profile")
    } else if (path.startsWith("/event/")) {
      const eventId = Number.parseInt(path.split("/").pop())
      if (!isNaN(eventId)) {
        setSelectedEventId(eventId)
        setCurrentPage("event-detail")
      }
    }
  }, [])

  return (
    <AuthProvider>
      <div className="App">
        <Navbar onViewReminders={toggleRemindersModal} onNavigateToProfile={navigateToProfile} />

        {currentPage === "home" && (
          <>
            <Introduction />
            <EventsList events={eventsData} title="Explore Hackathons & Contests" onViewDetails={viewEventDetails} />
          </>
        )}

        {currentPage === "event-detail" && (
          <EventDetail
            event={eventsData.find((event) => event.id === selectedEventId)}
            events={eventsData}
            onBack={goBackToEvents}
            onViewDetails={viewEventDetails}
          />
        )}

        {currentPage === "profile" && <ProfilePage />}

        {/* My Reminders Modal */}
        <MyReminders isOpen={showReminders} onClose={toggleRemindersModal} onViewEvent={viewEventDetails} />

        {/* Connection Status Indicator */}
        <ConnectionStatus />
      </div>
    </AuthProvider>
  )
}

export default App
