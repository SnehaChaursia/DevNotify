const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const { check, validationResult } = require("express-validator")
const http = require('http')
const socketIo = require('socket.io')
const nodemailer = require('nodemailer')
const cron = require('node-cron')

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST"]
  }
})

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected')

  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected')
  })
})

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
        enum: ['reminder', 'event', 'system'],
        required: true
      },
      message: String,
      eventId: Number,
      eventName: String,
      eventDate: Date,
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
    // Validate request
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
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

      // Sign token using JWT_SECRET environment variable
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
      
      // Send response with token
      res.json({ token })
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server error")
    }
  },
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

// Function to send notification
const sendNotification = (userId, notification) => {
  io.to(userId).emit('notification', notification)
}

// Add a new endpoint to notify users about new events
app.post("/api/events/new", auth, async (req, res) => {
  try {
    const { eventId, eventName, eventDate, eventType } = req.body;
    
    // Get all users
    const users = await User.find({});
    
    // Create notification for each user
    const notification = {
      type: 'event',
      message: `New ${eventType}: ${eventName} has been added!`,
      eventId,
      eventName,
      eventDate,
      isRead: false,
      createdAt: new Date()
    };

    // Send notification to all users
    users.forEach(user => {
      user.notifications.push(notification);
      sendNotification(user._id.toString(), notification);
    });

    // Save all users
    await Promise.all(users.map(user => user.save()));

    res.json({ message: 'Notifications sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add endpoint to mark notification as read
app.put("/api/users/notifications/:notificationId/read", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const notification = user.notifications.id(req.params.notificationId);
    
    if (notification) {
      notification.isRead = true;
      await user.save();
    }
    
    res.json(user.notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add endpoint to get reminders for the authenticated user
app.get("/api/users/reminders", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('reminders'); // Select only the reminders field
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.reminders || []);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Modify the reminder endpoint to include notifications and email
app.post("/api/users/reminders", auth, async (req, res) => {
  try {
    const { eventId, eventName, eventDate, reminderTime } = req.body;
    const user = await User.findById(req.user.id);

    // Check if reminder already exists
    const existingIndex = user.reminders.findIndex((r) => r.eventId === eventId);

    if (existingIndex >= 0) {
      // Update existing reminder
      user.reminders[existingIndex] = {
        eventId,
        eventName,
        eventDate,
        reminderTime,
        isNotified: false,
      };
    } else {
      // Add new reminder
      user.reminders.push({
        eventId,
        eventName,
        eventDate,
        reminderTime,
        isNotified: false,
      });
    }

    // Create notification for the reminder
    const notification = {
      type: 'reminder',
      message: `Reminder set for ${eventName}`,
      eventId,
      eventName,
      eventDate,
      isRead: false,
      createdAt: new Date()
    };

    user.notifications.push(notification);
    await user.save();

    // Send real-time notification
    sendNotification(req.user.id, notification);

    // Send email notification
    const emailSubject = `Reminder Set: ${eventName}`;
    const emailText = `You have set a reminder for ${eventName} on ${new Date(eventDate).toLocaleDateString()}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568;">Reminder Set Successfully!</h2>
        <p>You have set a reminder for:</p>
        <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #2d3748; margin: 0 0 10px 0;">${eventName}</h3>
          <p style="color: #4a5568; margin: 0;">Date: ${new Date(eventDate).toLocaleDateString()}</p>
          <p style="color: #4a5568; margin: 0;">Time: ${new Date(eventDate).toLocaleTimeString()}</p>
        </div>
        <p>You will receive another email when it's time for the event.</p>
        <p style="color: #718096; font-size: 14px;">This is an automated message, please do not reply.</p>
      </div>
    `;

    try {
      await sendEmail(user.email, emailSubject, emailText, emailHtml);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the whole request if email fails
    }

    res.json({ reminders: user.reminders, userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

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

// Add a new endpoint to get notifications
app.get("/api/users/notifications", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json(user.notifications || [])
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server error")
  }
})

// Function to send reminder emails
const sendReminderEmails = async () => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    // Find all users with reminders that are due in the next hour
    const users = await User.find({
      'reminders.eventDate': {
        $gte: now,
        $lte: oneHourFromNow
      },
      'reminders.isNotified': false
    });

    for (const user of users) {
      const dueReminders = user.reminders.filter(reminder => {
        const reminderDate = new Date(reminder.eventDate);
        return reminderDate >= now && 
               reminderDate <= oneHourFromNow && 
               !reminder.isNotified;
      });

      for (const reminder of dueReminders) {
        // Send email
        const emailSubject = `Reminder: ${reminder.eventName} is coming up!`;
        const emailText = `Your event ${reminder.eventName} is coming up in less than an hour!`;
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a5568;">Event Reminder!</h2>
            <p>Your event is coming up in less than an hour:</p>
            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #2d3748; margin: 0 0 10px 0;">${reminder.eventName}</h3>
              <p style="color: #4a5568; margin: 0;">Date: ${new Date(reminder.eventDate).toLocaleDateString()}</p>
              <p style="color: #4a5568; margin: 0;">Time: ${new Date(reminder.eventDate).toLocaleTimeString()}</p>
            </div>
            <p style="color: #718096; font-size: 14px;">This is an automated message, please do not reply.</p>
          </div>
        `;

        try {
          await sendEmail(user.email, emailSubject, emailText, emailHtml);
          
          // Mark reminder as notified
          reminder.isNotified = true;
          
          // Create notification
          const notification = {
            type: 'reminder',
            message: `Reminder: ${reminder.eventName} is coming up!`,
            eventId: reminder.eventId,
            eventName: reminder.eventName,
            eventDate: reminder.eventDate,
            isRead: false,
            createdAt: new Date()
          };
          
          user.notifications.push(notification);
          sendNotification(user._id.toString(), notification);
        } catch (emailError) {
          console.error('Failed to send reminder email:', emailError);
        }
      }

      await user.save();
    }
  } catch (error) {
    console.error('Error in sendReminderEmails:', error);
  }
};

// Schedule reminder check every 5 minutes
cron.schedule('*/5 * * * *', sendReminderEmails);

// Test email endpoint
app.post("/api/test-email", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const emailSubject = "Test Email from DevNotify";
    const emailText = "This is a test email to verify the email notification system is working.";
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568;">Test Email</h2>
        <p>This is a test email to verify that the email notification system is working correctly.</p>
        <p style="color: #718096; font-size: 14px;">If you received this email, the email notification system is properly configured!</p>
      </div>
    `;

    await sendEmail(user.email, emailSubject, emailText, emailHtml);
    res.json({ message: "Test email sent successfully" });
  } catch (err) {
    console.error('Error sending test email:', err);
    res.status(500).json({ error: "Failed to send test email" });
  }
});

// Update the server to use the http server instead of express app
const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
