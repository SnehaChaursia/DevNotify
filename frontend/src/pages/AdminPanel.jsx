"use client";

import { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  Container, // ✅ fixed missing import
} from "@mui/material";

function AdminPanel() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    date: "",
    duration: "",
    location: "",
    tags: "",
    teamSize: "",
    difficulty: "",
    isSaved: false,
    description: "",
    organizer: "",
    website: "",
    prizes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("❌ No token found. Please log in first.");
        return;
      }

      const payload = {
        ...form,
        tags: form.tags.split(",").map((tag) => tag.trim()),
      };

      const res = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        alert("✅ Event uploaded successfully!");
        setForm({
          name: "",
          type: "",
          date: "",
          duration: "",
          location: "",
          tags: "",
          teamSize: "",
          difficulty: "",
          isSaved: false,
          description: "",
          organizer: "",
          website: "",
          prizes: "",
        });
      } else {
        const error = await res.text();
        console.error("❌ Upload failed:", error);
        alert("❌ Failed to upload event");
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("❌ Failed to upload event");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Upload a New Event
        </Typography>

        <Grid container spacing={2}>
          {[
            { label: "Event Name", name: "name" },
            { label: "Type (e.g. hackathon)", name: "type" },
            { label: "Date", name: "date", type: "datetime-local" },
            { label: "Duration", name: "duration" },
            { label: "Location", name: "location" },
            { label: "Tags (comma separated)", name: "tags" },
            { label: "Team Size", name: "teamSize" },
            { label: "Difficulty", name: "difficulty" },
            { label: "Organizer", name: "organizer" },
            { label: "Website URL", name: "website" },
            { label: "Prizes", name: "prizes" },
          ].map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={form[field.name]}
                onChange={handleChange}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="isSaved"
                  checked={form.isSaved}
                  onChange={handleChange}
                />
              }
              label="Mark as Saved (Bookmarked)"
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit Event
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default AdminPanel;
