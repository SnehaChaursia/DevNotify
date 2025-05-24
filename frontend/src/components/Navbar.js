"use client"

import { useState, useContext } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import CodeIcon from '@mui/icons-material/Code'
import EventIcon from '@mui/icons-material/Event'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AuthContext from "../context/AuthContext"
import { useNavigate, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Navbar = ({ onViewReminders, onNavigateToProfile }) => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchor(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { text: 'Home', path: '/' },
    { text: 'Events', path: '/events' },
    { text: 'About', path: '/about' },
    { text: 'Contact', path: '/contact' }
  ];

  const notifications = [
    {
      icon: <EventIcon />,
      title: 'New Hackathon',
      message: 'CodeFest 2024 registration is now open!',
      time: '2 hours ago'
    },
    {
      icon: <CodeIcon />,
      title: 'LeetCode Contest',
      message: 'Weekly Contest 387 starts in 1 hour',
      time: '3 hours ago'
    },
    {
      icon: <NotificationsIcon />,
      title: 'Reminder',
      message: 'Your saved hackathon "AI Challenge" starts tomorrow',
      time: '5 hours ago'
    }
  ];

  const Logo = () => (
    <Box
      component={Link}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'inherit',
        mr: 4,
        '&:hover': {
          transform: 'scale(1.02)',
        },
        transition: 'transform 0.2s ease'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 48,
          height: 48,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          mr: 2,
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c)',
            borderRadius: '18px',
            zIndex: -1,
            opacity: 0.6,
            filter: 'blur(1px)',
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        <CodeIcon sx={{ color: 'white', fontSize: 28 }} />
      </Box>
      <Box>
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: 900,
            fontSize: '1.75rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            letterSpacing: '-1px',
            lineHeight: 1.1,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          DevNotify
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            display: 'block',
            lineHeight: 1,
            mt: 0.5,
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Code • Track • Win
        </Typography>
      </Box>
    </Box>
  )

  const userMenuItems = [
    { text: 'Profile', icon: <PersonIcon />, onClick: handleProfileClick },
    { text: 'My Events', icon: <EventIcon />, path: '/my-events' },
    { text: 'Bookmarks', icon: <BookmarkIcon />, path: '/bookmarks' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ]

  const renderDesktopMenu = () => (
    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
      {menuItems.map((item) => (
        <Button
          key={item.text}
          component={Link}
          to={item.path}
          sx={{
            color: 'text.primary',
            px: 2,
            py: 1,
            borderRadius: 2,
            fontSize: '0.95rem',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'rgba(79, 70, 229, 0.08)',
              color: 'primary.main',
            },
            '&.active': {
              color: 'primary.main',
              bgcolor: 'rgba(79, 70, 229, 0.08)',
              fontWeight: 600,
            },
            transition: 'all 0.2s ease'
          }}
        >
          {item.text}
        </Button>
      ))}
    </Box>
  )

  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuAnchor !== null}
      onClose={handleMobileMenuClose}
      PaperProps={{
        sx: { width: 280 }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleMobileMenuClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            component={Link}
            to={item.path}
            onClick={handleMobileMenuClose}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        
        {isAuthenticated && (
          <>
            <Divider />
            {userMenuItems.map((item) => (
              <ListItem
                key={item.text}
                button
                onClick={() => {
                  if (item.onClick) {
                    item.onClick()
                  } else if (item.path) {
                    navigate(item.path)
                    handleMobileMenuClose()
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Divider />
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Sign Out" />
            </ListItem>
          </>
        )}
        
        {!isAuthenticated && (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                navigate('/auth', { state: { from: location } })
                handleMobileMenuClose()
              }}
              sx={{
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  borderColor: 'transparent',
                },
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                navigate('/auth', { state: { from: location } })
                handleMobileMenuClose()
              }}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        )}
      </List>
    </Drawer>
  )

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 70 } }}>
          <Logo />

          {renderDesktopMenu()}

          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleNotificationClick}
              sx={{
                color: 'text.secondary',
                p: 1,
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'rgba(79, 70, 229, 0.08)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Badge
                badgeContent={3}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: 'error.main',
                    color: 'white',
                    fontWeight: 'bold',
                    height: '20px',
                    minWidth: '20px',
                    padding: '0 6px',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <NotificationsIcon sx={{ fontSize: '1.5rem' }} />
              </Badge>
            </IconButton>

            {!isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{
                    color: 'primary.main',
                    borderColor: 'primary.main',
                    px: 2,
                    py: 0.75,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'rgba(79, 70, 229, 0.08)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 2,
                    py: 0.75,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Register
                </Button>
              </>
            ) : (
              <IconButton
                onClick={handleProfileClick}
                sx={{
                  color: 'text.secondary',
                  p: 1,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'rgba(79, 70, 229, 0.08)',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <PersonIcon sx={{ fontSize: '1.75rem' }} />
              </IconButton>
            )}
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleNotificationClick}
              sx={{
                color: 'text.secondary',
                p: 1,
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'rgba(79, 70, 229, 0.08)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <Badge
                badgeContent={3}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: 'error.main',
                    color: 'white',
                    fontWeight: 'bold',
                    height: '20px',
                    minWidth: '20px',
                    padding: '0 6px',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }
                }}
              >
                <NotificationsIcon sx={{ fontSize: '1.5rem' }} />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              onClick={handleMobileMenuOpen}
              sx={{
                color: 'text.secondary',
                p: 1,
                '&:hover': {
                  color: 'primary.main',
                  bgcolor: 'rgba(79, 70, 229, 0.08)',
                },
                transition: 'all 0.2s ease'
              }}
            >
              <MenuIcon sx={{ fontSize: '1.75rem' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationClose}
        PaperProps={{
          sx: { width: 220, maxWidth: '100%' }
        }}
      >
        {notifications.map((notification, index) => (
          <MenuItem
            key={index}
            sx={{
              py: 1.5,
              px: 2,
              fontSize: '0.95rem',
              '&:hover': {
                bgcolor: 'rgba(79, 70, 229, 0.08)',
              },
            }}
          >
            <ListItemIcon>{notification.icon}</ListItemIcon>
            <ListItemText primary={notification.title} secondary={notification.message} />
          </MenuItem>
        ))}
      </Menu>

      <Menu
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={handleProfileClose}
        PaperProps={{
          sx: { width: 220, maxWidth: '100%' }
        }}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleProfileClose}
            sx={{
              py: 1.5,
              px: 2,
              fontSize: '0.95rem',
              '&:hover': {
                bgcolor: 'rgba(79, 70, 229, 0.08)',
              },
              '&.active': {
                color: 'primary.main',
                bgcolor: 'rgba(79, 70, 229, 0.08)',
                fontWeight: 600,
              }
            }}
          >
            {item.text}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemText primary="Sign Out" />
        </MenuItem>
      </Menu>

      {renderMobileMenu()}
    </AppBar>
  )
}

export default Navbar