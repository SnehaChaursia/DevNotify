import { Box } from '@mui/material';
import EventsList from '../components/EventsList';
import eventsData from '../data/eventsData';
import { useNavigate } from 'react-router-dom';

const EventsPage = () => {
  const navigate = useNavigate();

  const viewEventDetails = (eventId) => {
    navigate(`/event/${eventId}`);
    window.scrollTo(0, 0);
  };

  return (
    <Box>
      <EventsList
        events={eventsData}
        title="All Events"
        onViewDetails={viewEventDetails}
      />
    </Box>
  );
};

export default EventsPage; 