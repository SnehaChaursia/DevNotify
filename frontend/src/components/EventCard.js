"use client"

import { useState, useEffect, useContext } from "react"
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaBookmark,
  FaRegBookmark,
  FaUsers,
  FaLaptopCode,
  FaBell,
} from "react-icons/fa"
import { hasReminder } from "../services/ReminderService"
import { saveEvent } from "../services/api"
import AuthContext from "../context/AuthContext"

const EventCard = ({ event, onViewDetails }) => {
  const [isSaved, setIsSaved] = useState(event.isSaved || false)
  const [hasEventReminder, setHasEventReminder] = useState(false)
  const { isAuthenticated, user } = useContext(AuthContext)

  useEffect(() => {
    // Check if reminder exists for this event
    const reminderExists = hasReminder(event.id)
    setHasEventReminder(reminderExists)

    // Check if event is saved in user data
    if (isAuthenticated && user && user.savedEvents) {
      setIsSaved(user.savedEvents.includes(event.id))
    }
  }, [event.id, isAuthenticated, user])

  const toggleSave = async (e) => {
    e.stopPropagation()

    try {
      if (isAuthenticated) {
        // Save to server if authenticated
        await saveEvent(event.id)
      }

      // Toggle saved state
      setIsSaved(!isSaved)
    } catch (error) {
      console.error("Error saving event:", error)
    }
  }

  // Calculate days remaining
  const today = new Date()
  const eventDate = new Date(event.date)
  const daysRemaining = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24))

  // Determine status color
  let statusColor = "bg-yellow-500" // Default: Upcoming
  if (daysRemaining < 0) {
    statusColor = "bg-gray-500" // Past
  } else if (daysRemaining === 0) {
    statusColor = "bg-green-500" // Today
  } else if (daysRemaining <= 3) {
    statusColor = "bg-red-500" // Soon
  }

  return (
    <div className="event-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      <div className={`event-banner h-3 ${event.type === "hackathon" ? "bg-purple-600" : "bg-blue-600"}`}></div>

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center mb-3">
            <span className={`text-xs font-bold uppercase text-white px-2 py-1 rounded-full mr-2 ${statusColor}`}>
              {daysRemaining < 0 ? "Ended" : daysRemaining === 0 ? "Today" : daysRemaining <= 3 ? "Soon" : "Upcoming"}
            </span>
            <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {event.type === "hackathon" ? "Hackathon" : "Contest"}
            </span>
            {hasEventReminder && (
              <span className="ml-2 text-yellow-500" title="Reminder set">
                <FaBell />
              </span>
            )}
          </div>
          <button
            onClick={toggleSave}
            className="text-gray-400 hover:text-yellow-500 transition duration-300"
            aria-label={isSaved ? "Remove from saved" : "Save event"}
          >
            {isSaved ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
          </button>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.name}</h3>

        <div className="flex items-center text-gray-600 mb-2">
          <FaCalendarAlt className="mr-2 text-gray-400" />
          <span>
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {event.duration && (
          <div className="flex items-center text-gray-600 mb-2">
            <FaClock className="mr-2 text-gray-400" />
            <span>{event.duration}</span>
          </div>
        )}

        <div className="flex items-center text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <span>{event.location}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {event.tags.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-gray-600">
            {event.type === "hackathon" ? (
              <div className="flex items-center">
                <FaUsers className="mr-1 text-gray-400" />
                <span className="text-sm">{event.teamSize}</span>
              </div>
            ) : (
              <div className="flex items-center">
                <FaLaptopCode className="mr-1 text-gray-400" />
                <span className="text-sm">{event.difficulty}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onViewDetails(event.id)}
            className="text-sm font-medium text-purple-600 hover:text-purple-800 transition duration-300"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventCard
