import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
      <Paper elevation={1} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          About DevNotify
        </Typography>
        <Typography variant="body1" paragraph>
          Welcome to DevNotify! We are dedicated to helping developers and tech enthusiasts stay informed about upcoming hackathons and LeetCode contests.
        </Typography>
        <Typography variant="body1" paragraph>
          Our platform tracks various coding events from different sources, providing a centralized place for you to discover, save, and set reminders for opportunities that match your interests.
        </Typography>
        <Typography variant="body1" paragraph>
          Whether you are looking to build new skills, collaborate with others, compete for prizes, or just stay sharp with coding challenges, DevNotify aims to be your go-to resource.
        </Typography>
        <Typography variant="body1" paragraph>
          Key features include:
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          <li><Typography variant="body1">Comprehensive list of upcoming hackathons and contests.</Typography></li>
          <li><Typography variant="body1">Ability to save events to your personal list.</Typography></li>
          <li><Typography variant="body1">Set timely reminders so you never miss an event.</Typography></li>
          <li><Typography variant="body1">Real-time notifications for reminders.</Typography></li>
          <li><Typography variant="body1">Connect with other users through comments (coming soon!).</Typography></li>
        </Box>
        <Typography variant="body1" sx={{ mt: 3 }}>
          Our goal is to make it easier for you to track coding opportunities and focus on what you do best – coding!
        </Typography>
      </Paper>
    </Container>
  );
};

export default AboutPage; 