import { List } from 'antd';
import _ from 'lodash';
import TicketItemList from './TicketItemList';

const TicketList = ({ tickets, checkedInTickets }) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={tickets}
      renderItem={ticketId => (
        <TicketItemList ticketId={ticketId} checkedIn={_.includes(checkedInTickets, ticketId)} />
      )}
    />
  )
}

export default TicketList;
