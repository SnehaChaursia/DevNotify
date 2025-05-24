const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const { check, validationResult } = require("express-validator")
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()

// CORS configuration with proper frontend URL
const corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "x-auth-token", "Authorization"],
}

// Log the allowed origin for debugging
console.log("CORS allowed origin:", process.env.FRONTEND_URL || "*")

// Middleware
app.use(cors(corsOptions))
app.use(express.json())

// Add pre-flight OPTIONS handling for all routes
app.options("*", cors(corsOptions))

// Connect to MongoDB using the environment variable
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  savedEvents: [
    {
      type: Number,
    },
  ],
  reminders: [
    {
      eventId: Number,
      eventName: String,
      eventDate: Date,
      reminderTime: Date,
      isNotified: Boolean,
    },
  ],
  notifications: [
    {
      type: {
        type: String,
        enum: ['reminder', 'system'],
        default: 'reminder'
      },
      message: String,
      eventId: Number,
      eventName: String,
      isRead: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.model("User", userSchema)

// Auth middleware
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token")

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" })
  }

  // Verify token using JWT_SECRET environment variable
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.user
    next()
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" })
  }
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    environment: {
      nodeEnv: process.env.NODE_ENV || "development",
      frontendUrl: process.env.FRONTEND_URL || "Not set",
      mongoConnected: mongoose.connection.readyState === 1,
    },
  })
})

// Register User
app.post(
  "/api/users/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      // Validate request
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password } = req.body

      // Check if user exists
      let user = await User.findOne({ email })
      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] })
      }

      // Create new user
      user = new User({
        name,
        email,
        password,
      })

      // Hash password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      // Save user
      await user.save()

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      }

      // Sign token
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET || "your-super-secret-jwt-key",
        { expiresIn: "7d" }
      )

      // Return token immediately
      res.json({ token })
    } catch (err) {
      console.error("Registration Error:", err)
      res.status(500).json({ errors: [{ msg: "Server error during registration" }] })
    }
  }
)

// Login User
app.post(
  "/api/users/login",
  [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      // Check if user exists
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] })
      }

      // Create JWT payload
      const payload = {
        user: {
          id: user.id,
        },
      }

      // Sign token using JWT_SECRET environment variable
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
        if (err) throw err
        res.json({ token })
      })
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
)

// Get user profile
app.get("/api/users/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Save event
app.post("/api/users/events/save", auth, async (req, res) => {
  try {
    const { eventId } = req.body
    const user = await User.findById(req.user.id)

    // Check if event is already saved
    if (user.savedEvents.includes(eventId)) {
      // Remove event if already saved
      user.savedEvents = user.savedEvents.filter((id) => id !== eventId)
    } else {
      // Add event if not saved
      user.savedEvents.push(eventId)
    }

    await user.save()
    res.json(user.savedEvents)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Save reminder
app.post("/api/users/reminders", auth, async (req, res) => {
  try {
    const { eventId, eventName, eventDate, reminderTime } = req.body
    const user = await User.findById(req.user.id)

    // Check if reminder already exists
    const existingIndex = user.reminders.findIndex((r) => r.eventId === eventId)

    if (existingIndex >= 0) {
      // Update existing reminder
      user.reminders[existingIndex] = {
        eventId,
        eventName,
        eventDate,
        reminderTime,
        isNotified: false,
      }
    } else {
      // Add new reminder
      user.reminders.push({
        eventId,
        eventName,
        eventDate,
        reminderTime,
        isNotified: false,
      })
    }

    // Add notification
    user.notifications.push({
      type: 'reminder',
      message: `Reminder set for ${eventName}`,
      eventId,
      eventName,
      isRead: false
    })

    await user.save()

    // Emit notification to the user
    io.to(req.user.id).emit('notification', {
      type: 'reminder',
      message: `Reminder set for ${eventName}`,
      eventId,
      eventName,
      createdAt: new Date()
    })

    res.json({ 
      reminders: user.reminders,
      notification: user.notifications[user.notifications.length - 1]
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Get notifications
app.get("/api/users/notifications", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json(user.notifications)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Mark notification as read
app.put("/api/users/notifications/:notificationId/read", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const notification = user.notifications.id(req.params.notificationId)
    
    if (notification) {
      notification.isRead = true
      await user.save()
    }
    
    res.json(user.notifications)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Delete reminder
app.delete("/api/users/reminders/:eventId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    // Filter out the reminder
    user.reminders = user.reminders.filter((reminder) => reminder.eventId !== Number.parseInt(req.params.eventId))

    await user.save()
    res.json(user.reminders)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Start server using PORT environment variable
const PORT = process.env.PORT || 5000;

// Create HTTP server and Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected via Socket.IO');
  // You can add your real-time event handlers here
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
