import axios from "axios"

// Use hardcoded URL for development
const API_URL = "http://localhost:5000/api"

console.log("API URL:", API_URL) // For debugging during development

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["x-auth-token"] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Auth API calls
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/users/register", userData)
    if (!response.data) {
      throw new Error('Invalid response from server')
    }
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
    }
    return response.data
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data
    }
    throw { msg: error.message || 'Registration failed' }
  }
}

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/users/login", credentials)
    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response.data
    }
    throw error
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/users/me")
    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response.data
    }
    throw error
  }
}

// Event API calls
export const saveEvent = async (eventId) => {
  try {
    const response = await api.post("/users/events/save", { eventId })
    return response.data
  } catch (error) {
    if (error.response) {
      throw error.response.data
    }
    throw error
  }
}

// Reminder API calls
export const saveReminder = async (reminderData) => {
  try {
    const response = await api.post("/users/reminders", reminderData)
    return response.data
  } catch (error) {
    throw error.response?.data || { errors: [{ msg: "Server connection error" }] }
  }
}

export const deleteReminder = async (eventId) => {
  try {
    const response = await api.delete(`/users/reminders/${eventId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || { errors: [{ msg: "Server connection error" }] }
  }
}

export default api
