import { useState, useContext } from "react"
import { FaCode, FaBars, FaTimes, FaUser, FaCalendarAlt, FaBookmark, FaCog, FaBell } from "react-icons/fa"
import AuthContext from "../context/AuthContext"
import AuthModal from "./auth/AuthModal"

const Navbar = ({ onViewReminders, onNavigateToProfile }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalView, setAuthModalView] = useState("login")
  const { isAuthenticated, user, logout } = useContext(AuthContext)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const openLoginModal = () => {
    setAuthModalView("login")
    setShowAuthModal(true)
  }

  const openSignupModal = () => {
    setAuthModalView("signup")
    setShowAuthModal(true)
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  const handleProfileClick = () => {
    onNavigateToProfile()
    setIsOpen(false)
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <FaCode className="text-purple-700 text-2xl mr-2" />
              <span className="font-bold text-xl text-gray-800">HackTracker</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-purple-700 transition duration-300">
              Home
            </a>
            <a href="/events" className="text-gray-700 hover:text-purple-700 transition duration-300">
              Events
            </a>
            <a href="/hackathons" className="text-gray-700 hover:text-purple-700 transition duration-300">
              Hackathons
            </a>
            <a href="/contests" className="text-gray-700 hover:text-purple-700 transition duration-300">
              Contests
            </a>

            {isAuthenticated && (
              <button
                onClick={onViewReminders}
                className="text-gray-700 hover:text-purple-700 transition duration-300 flex items-center"
              >
                <FaBell className="mr-1" />
                <span>My Reminders</span>
              </button>
            )}

            {isAuthenticated ? (
              <>
                <a href="/my-events" className="text-gray-700 hover:text-purple-700 transition duration-300">
                  My Events
                </a>
                <div className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-purple-700 transition duration-300">
                    <FaUser className="mr-1" />
                    <span>{user?.name?.split(" ")[0] || "Account"}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                    <button
                      onClick={handleProfileClick}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    >
                      <FaUser className="inline mr-2" /> Profile
                    </button>
                    <a
                      href="/my-events"
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    >
                      <FaCalendarAlt className="inline mr-2" /> My Events
                    </a>
                    <a
                      href="/bookmarks"
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    >
                      <FaBookmark className="inline mr-2" /> Bookmarks
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    >
                      <FaCog className="inline mr-2" /> Settings
                    </a>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100 hover:text-purple-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={openLoginModal}
                  className="px-4 py-2 border border-purple-700 text-purple-700 rounded-md hover:bg-purple-700 hover:text-white transition duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={openSignupModal}
                  className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-purple-700 focus:outline-none">
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <a href="/" className="block py-2 text-gray-700 hover:text-purple-700">
              Home
            </a>
            <a href="/events" className="block py-2 text-gray-700 hover:text-purple-700">
              Events
            </a>
            <a href="/hackathons" className="block py-2 text-gray-700 hover:text-purple-700">
              Hackathons
            </a>
            <a href="/contests" className="block py-2 text-gray-700 hover:text-purple-700">
              Contests
            </a>

            {isAuthenticated && (
              <button
                onClick={() => {
                  onViewReminders()
                  setIsOpen(false)
                }}
                className="block w-full text-left py-2 text-gray-700 hover:text-purple-700"
              >
                <FaBell className="inline mr-2" /> My Reminders
              </button>
            )}

            {isAuthenticated ? (
              <>
                <a href="/my-events" className="block py-2 text-gray-700 hover:text-purple-700">
                  My Events
                </a>
                <button
                  onClick={handleProfileClick}
                  className="block w-full text-left py-2 text-gray-700 hover:text-purple-700"
                >
                  <FaUser className="inline mr-2" /> Profile
                </button>
                <a href="/bookmarks" className="block py-2 text-gray-700 hover:text-purple-700">
                  Bookmarks
                </a>
                <a href="/settings" className="block py-2 text-gray-700 hover:text-purple-700">
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 hover:text-purple-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 mt-2">
                <button
                  onClick={() => {
                    openLoginModal()
                    setIsOpen(false)
                  }}
                  className="px-4 py-2 border border-purple-700 text-purple-700 rounded-md hover:bg-purple-700 hover:text-white transition duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openSignupModal()
                    setIsOpen(false)
                  }}
                  className="px-4 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={closeAuthModal} initialView={authModalView} />
    </nav>
  )
}

export default Navbar
