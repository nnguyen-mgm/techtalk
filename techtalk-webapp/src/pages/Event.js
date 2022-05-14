import { Button, Descriptions, Divider, PageHeader } from 'antd';
import styled from 'styled-components';
import Token from '../components/Token';
import TicketList from '../components/TicketList';
import VerifyTicket from '../components/VerifyTicket';
import moment from 'moment';

const S = {
  PageHeader: styled(PageHeader)`
    max-width: 600px;
    border-radius: 8px;
    margin: auto;
  `,
}

const Event = () => {
  return (
    <div>
      <S.PageHeader
        ghost={false}
        title="Web3 Tech Talk"
        subTitle="#1"
        extra={[
          <Button key="buy" type="primary">Buy Ticket&nbsp;<Token val={2 * (10 ** 18)}/></Button>,
        ]}
      >
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Created By">0x739Ff25F618dD1DaB5CDa5f2bF24f60dc73225E9</Descriptions.Item>
          <Descriptions.Item label="Created At">{moment().format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
          <Descriptions.Item label="Start Time">{moment().format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
          <Descriptions.Item label="Max Tickets">10</Descriptions.Item>
          <Descriptions.Item label="Sold Tickets">5</Descriptions.Item>
          <Descriptions.Item label="Checked-in Tickets">3</Descriptions.Item>
        </Descriptions>
        <br/>
        <>
          <Divider>Verify Check-in Code</Divider>
          <VerifyTicket />
        </>
        <Divider>Your Tickets</Divider>
        <TicketList tickets={[1, 2, 3]} checkedInTickets={[1, 2]}/>
      </S.PageHeader>
    </div>
  )
}

export default Event;
