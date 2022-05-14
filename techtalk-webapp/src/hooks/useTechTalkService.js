import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import TechTalkCoinContract from './contracts/TechTalkCoin.json';
import TechTalkTicketContract from './contracts/TechTalkTicket.json';
import config from '../config';
import getWeb3 from './getWeb3';
import { notification } from 'antd';
import _ from 'lodash';

let cachedWeb3;
const getCachedWeb3 = async () => {
  cachedWeb3 = cachedWeb3 || await getWeb3();
  return cachedWeb3;
}

const loadAccounts = async () => {
  try {
    const web3 = await getCachedWeb3();
    return await web3.eth.getAccounts();
  } catch (e) {
    return [];
  }
}

let ttcContract;
const loadTtcContract =  async () => {
  if (!ttcContract) {
    const web3 = await getCachedWeb3();
    ttcContract = new web3.eth.Contract(TechTalkCoinContract.abi, config.ttcAddress);
  }

  return ttcContract;
}

let tttContract;
const loadTttContract =  async () => {
  if (!tttContract) {
    const web3 = await getCachedWeb3();
    tttContract = new web3.eth.Contract(TechTalkTicketContract.abi, config.tttAddress);
  }

  return tttContract;
}

const TechTalkServiceContext = createContext({});

export function TechTalkServiceProvider({ children }) {
  const [wallet, setWallet] = useState({balance: null, allowance: null, account: null});
  const [eventCreationFee, setEventCreationFee] = useState(null);
  const [ticketPrice, setTicketPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const hasWeb3 = useMemo(() => !!(window.ethereum || window.web3), []);

  useEffect(() => {
    setInterval(async () => {
      try {
        const contract = await loadTtcContract();
        const accounts = await loadAccounts();
        if (accounts[0]) {
          const balance = await contract.methods.balanceOf(accounts[0]).call();
          const allowance = await contract.methods.allowance(accounts[0], config.tttAddress).call();
          setWallet({ balance, allowance, account: accounts[0] });
        }
      } catch (err) {
        console.error(err);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    (async () => {
      const contract = await loadTttContract();
      setEventCreationFee(await contract.methods.eventCreationFee().call());
      setTicketPrice(await contract.methods.ticketPrice().call());
    })();
  }, []);

  const setAllowance = useCallback(async (allowance) => {
    try {
      const accounts = await loadAccounts();
      const contract = await loadTtcContract();
      const formattedAllowance = (allowance * (10 ** 18)).toLocaleString('fullwide', { useGrouping: false });
      const res = await contract.methods.approve(config.tttAddress, formattedAllowance).send({ from: accounts[0] });
      notification.success({
        message: 'Allowance has been set successfully!'
      });
      return res;
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot set allowance',
        description: 'Please try again...'
      });
    }
  }, []);

  const createEvent = useCallback(async ({name, maxTickets, startTime}) => {
    try {
      setLoading(true);
      const accounts = await loadAccounts();
      const contract = await loadTttContract();
      const formattedStartTime = Math.round(+startTime / 1000);
      const res = await contract.methods.createEvent(name, maxTickets, formattedStartTime).send({ from: accounts[0] });
      notification.success({
        message: 'Event has been created successfully!'
      });
      return res;
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot create event',
        description: 'Please try again...'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCreatedEventIds = useCallback(async () => {
    try {
      const accounts = await loadAccounts();
      const contract = await loadTttContract();
      return await contract.methods.getCreatedEventIds().call({ from: accounts[0] });
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot load events',
        description: 'Please try again...'
      });
    }
  }, []);

  const loadCreatedEvents = useCallback(async () => {
    try {
      const accounts = await loadAccounts();
      const contract = await loadTttContract();
      return await contract.methods.getCreatedEvents().call({ from: accounts[0] });
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot load events',
        description: 'Please try again...'
      });
    }
  }, []);

  const loadEvent = useCallback(async (eventId) => {
    try {
      const contract = await loadTttContract();
      return await contract.methods.techTalkEvents(eventId).call();
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot load event',
        description: 'Please try again...'
      });
    }
  }, []);

  const countTickets = useCallback(async (eventId) => {
    try {
      const contract = await loadTttContract();
      return await contract.methods.countTickets(eventId).call();
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot count tickets',
        description: 'Please try again...'
      });
    }
  }, []);

  const countCheckedInTickets = useCallback(async (eventId) => {
    try {
      const contract = await loadTttContract();
      return await contract.methods.countCheckedInTickets(eventId).call();
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot count checked-in tickets',
        description: 'Please try again...'
      });
    }
  }, []);

  const buyTicket = useCallback(async (eventId) => {
    try {
      setLoading(true);
      const accounts = await loadAccounts();
      const contract = await loadTttContract();
      const res = await contract.methods.buyTicket(eventId).send({ from: accounts[0] });
      notification.success({
        message: 'Ticket has been bought successfully!'
      });
      return res;
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot buy ticket',
        description: 'Please try again...'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadOwnedTicketIds = useCallback(async (eventId) => {
    try {
      const accounts = await loadAccounts();
      const contract = await loadTttContract();
      const ticketIds = await contract.methods.getOwnedTicketIds(eventId).call({ from: accounts[0] });
      return _.filter(ticketIds, ticketId => ticketId !== '0');
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot load your tickets',
        description: 'Please try again...'
      });
    }
  }, []);

  const loadOwnedCheckedInTicketIds = useCallback(async (eventId) => {
    try {
      const accounts = await loadAccounts();
      const contract = await loadTttContract();
      const ticketIds = await contract.methods.getOwnedCheckedInTicketIds(eventId).call({ from: accounts[0] });
      return _.filter(ticketIds, ticketId => ticketId !== '0');
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot load your tickets',
        description: 'Please try again...'
      });
    }
  }, []);

  const getCheckInCode = useCallback(async (ticketId) => {
    try {
      const accounts = await loadAccounts();
      const contract = await loadTttContract();
      return await contract.methods.getCheckInCode(ticketId).call({ from: accounts[0] });
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot get check-in code',
        description: 'Please try again...'
      });
    }
  }, []);

  const verifyTicket = useCallback(async (eventId, ticketId, checkInCode) => {
    try {
      const accounts = await loadAccounts();
      const contract = await loadTttContract();
      return await contract.methods.verifyTicket(eventId, ticketId, checkInCode).call({ from: accounts[0] });
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot verify ticket',
        description: 'Please try again...'
      });
    }
  }, []);

  const checkInTicket = useCallback(async (eventId, ticketId, checkInCode) => {
    try {
      setLoading(true);
      const accounts = await loadAccounts();
      const contract = await loadTttContract();
      const res = await contract.methods.checkInTicket(eventId, ticketId, checkInCode).send({ from: accounts[0] });
      notification.success({
        message: 'Ticket has been checked-in successfully!'
      });
      return res;
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Cannot check-in ticket',
        description: 'Please try again...'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const getTicketCheckedInEvent = useCallback(async () => {
    const contract = await loadTttContract();
    return contract.events.TicketCheckedIn;
  }, []);

  return (
    <TechTalkServiceContext.Provider
      value={{
        loading,
        hasWeb3,
        wallet,
        eventCreationFee,
        ticketPrice,
        setAllowance,
        createEvent,
        loadCreatedEventIds,
        loadCreatedEvents,
        loadEvent,
        countTickets,
        countCheckedInTickets,
        buyTicket,
        loadOwnedTicketIds,
        loadOwnedCheckedInTicketIds,
        getCheckInCode,
        verifyTicket,
        checkInTicket,
        getTicketCheckedInEvent,
      }}>
      {children}
    </TechTalkServiceContext.Provider>
  );
}

export default function useTechTalkService() {
  const { ...props } = useContext(TechTalkServiceContext);

  return { ...props };
}
