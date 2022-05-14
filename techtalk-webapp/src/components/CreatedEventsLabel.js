import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

function CreatedEventsLabel() {
  const [createdEvents, setCreatedEvents] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setCreatedEvents(0);
  }, []);

  const handleOnViewMyEvents = useCallback(() => {
    navigate('/created-events');
  }, [navigate]);

  if (createdEvents === 0) {
    return (
      <center>
        You've not created any event yet.
      </center>
    );
  }

  return (
    <center>
      You've created {createdEvents} event{createdEvents > 1 && 's'}.
        <Button size="small" type="link" onClick={handleOnViewMyEvents}>View your created events</Button>
    </center>
  );
}

export default CreatedEventsLabel;
