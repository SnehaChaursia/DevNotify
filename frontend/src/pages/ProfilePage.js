"use client"

import { useContext, useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import { FaUser, FaEnvelope, FaCalendarAlt, FaBookmark, FaBell, FaTools } from "react-icons/fa"
import AuthContext from "../context/AuthContext"
import eventsData from "../data/eventsData"
import ConnectionTest from "../components/ConnectionTest"

const ProfilePage = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState("profile")
  const [showConnectionTest, setShowConnectionTest] = useState(false)
  const location = useLocation();

  // Check for state from navigation to set initial tab
  useEffect(() => {
    if (location.state?.showTab) {
      setActiveTab(location.state.showTab);
      // Clear the state so refreshing the page doesn't keep the tab active
      // navigate(location.pathname, { replace: true }); // This would require navigate from react-router-dom
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Sign In</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile.</p>
        </div>
      </div>
    )
  }

  // Get saved events
  const savedEvents = eventsData.filter((event) => user.savedEvents?.includes(event.id))

  // Get upcoming reminders
  const now = new Date()
  const upcomingReminders = user.reminders
    ?.filter((reminder) => new Date(reminder.reminderTime) > now)
    .sort((a, b) => new Date(a.reminderTime) - new Date(b.reminderTime))

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-purple-700 text-4xl font-bold mb-4 md:mb-0 md:mr-6">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-purple-200 mt-1">{user.email}</p>
                <p className="text-purple-200 mt-1">
                  Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "profile"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaUser className="inline mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "saved"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaBookmark className="inline mr-2" />
                Saved Events ({savedEvents.length})
              </button>
              <button
                onClick={() => setActiveTab("reminders")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "reminders"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaBell className="inline mr-2" />
                Reminders ({upcomingReminders?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("tools")}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === "tools"
                    ? "border-b-2 border-purple-600 text-purple-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaTools className="inline mr-2" />
                Tools
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Account Information</h2>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start">
                    <div className="text-purple-600 mt-1 mr-3">
                      <FaUser />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Full Name</h3>
                      <p className="text-gray-600">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-purple-600 mt-1 mr-3">
                      <FaEnvelope />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Email Address</h3>
                      <p className="text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="text-purple-600 mt-1 mr-3">
                      <FaCalendarAlt />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Member Since</h3>
                      <p className="text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Account Statistics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">{savedEvents.length}</div>
                      <div className="text-gray-600">Saved Events</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">{upcomingReminders?.length || 0}</div>
                      <div className="text-gray-600">Active Reminders</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-1">0</div>
                      <div className="text-gray-600">Completed Events</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "saved" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Events</h2>
                {savedEvents.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">You haven't saved any events yet.</p>
                    <p className="text-gray-500 mt-2">
                      Browse events and click the bookmark icon to save them for later.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedEvents.map((event) => (
                      <div key={event.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{event.name}</h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <FaCalendarAlt className="mr-1 text-gray-400" />
                              <span>
                                {new Date(event.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              event.type === "hackathon" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {event.type === "hackathon" ? "Hackathon" : "Contest"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "reminders" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Reminders</h2>
                {!upcomingReminders || upcomingReminders.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">You don't have any upcoming reminders.</p>
                    <p className="text-gray-500 mt-2">Set reminders for events to get notified before they start.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingReminders.map((reminder) => (
                      <div key={reminder.eventId} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{reminder.eventName}</h3>
                            <div className="flex items-center text-gray-600 mt-1">
                              <FaCalendarAlt className="mr-1 text-gray-400" />
                              <span>
                                {new Date(reminder.eventDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="text-sm text-purple-600 mt-2">
                              <FaBell className="inline mr-1" />
                              Reminder set for{" "}
                              {new Date(reminder.reminderTime).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
