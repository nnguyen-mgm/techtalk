import { Button, PageHeader, Table } from 'antd';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const S = {
  PageHeader: styled(PageHeader)`
    max-width: 600px;
    border-radius: 8px;
    margin: auto;
  `,
}

const events = [
  {
    id: 1,
    name: 'Web3 Tech Talk by mgm',
  },
  {
    id: 2,
    name: 'Awesome Tech Talk by mgm',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '',
    dataIndex: 'address',
    key: 'id',
    render: (id) =>
      <Link to={`/event/${id}`}>
        <Button type="link">View details</Button>
      </Link>
  },
];

const CreatedEvents = () => {
  return (
    <div>
      <S.PageHeader
        ghost={false}
        title="Your Created Events"
        extra={[
          <Link key="join-event" to="/"><Button type="primary">Join/Create event</Button></Link>,
        ]}
      >
        <Table dataSource={events} columns={columns} pagination={false} size="middle"/>
      </S.PageHeader>
    </div>
  )
}


export default CreatedEvents;
