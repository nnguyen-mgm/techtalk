import { Button, Descriptions, Divider, notification, PageHeader, Spin } from 'antd';
import styled from 'styled-components';
import Token from '../components/Token';
import TicketList from '../components/TicketList';
import VerifyTicket from '../components/VerifyTicket';
import { useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useTechTalkService from '../hooks/useTechTalkService';
import moment from 'moment';

const S = {
  PageHeader: styled(PageHeader)`
    max-width: 600px;
    border-radius: 8px;
    margin: auto;
  `,
}

const Event = () => {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [soldTickets, setSoldTickets] = useState(null);
  const [checkedInTickets, setCheckedInTicket] = useState(null);
  const [ownedTicketIds, setOwnedTicketIds] = useState([]);
  const [ownedCheckedInTicketIds, setOwnedCheckedInTicketIds] = useState([]);
  const {eventId} = useParams();
  const {
    wallet,
    ticketPrice,
    loadEvent,
    countTickets,
    countCheckedInTickets,
    buyTicket,
    loadOwnedTicketIds,
    loadOwnedCheckedInTicketIds,
    getTicketCheckedInEvent
  } = useTechTalkService();

  const loadEventData = useCallback(async () => {
    setEvent(await loadEvent(eventId));
    setSoldTickets(await countTickets(eventId));
    setCheckedInTicket(await countCheckedInTickets(eventId));
    setOwnedTicketIds(await loadOwnedTicketIds(eventId));
    setOwnedCheckedInTicketIds(await loadOwnedCheckedInTicketIds(eventId));
  }, [loadEvent, countTickets, countCheckedInTickets, loadOwnedTicketIds, loadOwnedCheckedInTicketIds, eventId]);

  const isCreator = useMemo(() => {
     return event && wallet.account === event.creator;
  }, [event, wallet.account]);

  const handleBuyTicket = useCallback(async () => {
    await buyTicket(eventId);
  }, [eventId, buyTicket]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadEventData();
      setLoading(false);

      const intervalId = setInterval(async () => {
        await loadEventData();
      }, 1000);

      return () => {
        clearInterval(intervalId);
      }
    })();
  }, [eventId, loadEventData]);

  useEffect(() => {
    (async () => {
      const event = await getTicketCheckedInEvent();
      event((error, result) => {
        if (error) {
          return;
        }
        const {owner, eventId, ticketId, payback} = result.returnValues;
        if (owner === wallet.account) {
          notification.success({
            duration: 8,
            message:
              <>
                Your ticket #{ticketId} has been checked-in for event #{eventId} successfully.&nbsp;
                And you've earned payback for <Token val={payback} />!
              </>
          });
        }
      });
    })();
  }, [getTicketCheckedInEvent, wallet.account]);

  if (loading) {
    return (

      <div>
        <S.PageHeader ghost={false} title="Loading...">
          <Spin/>
        </S.PageHeader>
      </div>
    )
  }

  if (!event || event.id === '0') {
    return (
      <div>
        <S.PageHeader ghost={false} title="Event not found!" />
      </div>
    )
  }

  return (
    <div>
      <S.PageHeader
        ghost={false}
        title={event.name}
        subTitle={`#${event.id}`}
        extra={[
          <Button key="buy" type="primary" onClick={handleBuyTicket}>Buy Ticket&nbsp;<Token val={ticketPrice}/></Button>,
        ]}
      >
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Created By">{event.creator}</Descriptions.Item>
          <Descriptions.Item label="Created At">{moment(event.createdAt * 1000).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
          <Descriptions.Item label="Start Time">{moment(event.startTime * 1000).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
          <Descriptions.Item label="Max Tickets">{event.maxTickets}</Descriptions.Item>
          <Descriptions.Item label="Sold Tickets">{soldTickets}</Descriptions.Item>
          <Descriptions.Item label="Checked-in Tickets">{checkedInTickets}</Descriptions.Item>
        </Descriptions>
        <br/>
        {isCreator && (
          <>
            <Divider>Verify Check-in Code</Divider>
            <VerifyTicket eventId={eventId} onCheckedIn={loadEventData}/>
          </>
        )}
        <Divider>Your Tickets</Divider>
        <TicketList tickets={ownedTicketIds} checkedInTickets={ownedCheckedInTicketIds}/>
      </S.PageHeader>
    </div>
  )
}

export default Event;
