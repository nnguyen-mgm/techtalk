import { Button, PageHeader, Table } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useTechTalkService from '../hooks/useTechTalkService';

const S = {
  PageHeader: styled(PageHeader)`
    max-width: 600px;
    border-radius: 8px;
    margin: auto;
  `,
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '',
    dataIndex: 'id',
    key: 'id',
    render: (id) =>
      <Link to={`/event/${id}`}>
        <Button type="link">View details</Button>
      </Link>
  },
];

const CreatedEvents = () => {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const {loadCreatedEvents} = useTechTalkService();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setEvents(await loadCreatedEvents() || []);
      setLoading(false);
    })();
  }, [loadCreatedEvents]);

  return (
    <div>
      <S.PageHeader
        ghost={false}
        title="Your Created Events"
        extra={[
          <Link key="join-event" to="/"><Button type="primary">Join/Create event</Button></Link>,
        ]}
      >
        <Table loading={loading} dataSource={events} columns={columns} pagination={false} size="middle"/>
      </S.PageHeader>
    </div>
  )
}


export default CreatedEvents;
