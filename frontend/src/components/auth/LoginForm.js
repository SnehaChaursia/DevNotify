"use client"

import { useState, useContext } from "react"
import { FaEnvelope, FaLock, FaExclamationCircle, FaExclamationTriangle } from "react-icons/fa"
import { loginUser, getCurrentUser } from "../../services/api"
import AuthContext from "../../context/AuthContext"

const LoginForm = ({ onToggleForm, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [connectionError, setConnectionError] = useState(false)
  const { login } = useContext(AuthContext)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setConnectionError(false)

    localStorage.clear(); // Clear local storage before attempting login

    try {
      // Login user
      const response = await loginUser(formData);

      if (response && response.token) {
        // Update auth context with the token. The context should handle fetching user data.
        login(response.token);

        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } else {
         throw new Error('Login failed: No token received from server');
      }
    } catch (err) {
      console.error("Login error:", err)

      // Check if it's a connection error
      if (err.message && (err.message.includes("connection") || err.message.includes("Network Error"))) {
        setConnectionError(true)
      } else if (err.errors) {
        const formErrors = {}
        err.errors.forEach((error) => {
          formErrors[error.param] = error.msg
        })
        setErrors(formErrors)
      } else {
        setErrors({ general: err.message || "Login failed. Please try again." })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Log In</h2>

      {connectionError && (
        <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-md flex items-center">
          <FaExclamationTriangle className="mr-2" />
          <div>
            <p className="font-medium">Cannot connect to server</p>
            <p className="text-sm">Please check your internet connection or try again later.</p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md flex items-center">
          <FaExclamationCircle className="mr-2" />
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <FaEnvelope />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-purple-200"
              }`}
              placeholder="your@email.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <FaLock />
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? "border-red-300 focus:ring-red-200" : "border-gray-300 focus:ring-purple-200"
              }`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300 flex justify-center items-center"
        >
          {isSubmitting ? "Logging in..." : "Log In"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <button onClick={() => { console.log('Toggling to signup view'); onToggleForm(); }} className="text-purple-600 hover:text-purple-800 font-medium">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
