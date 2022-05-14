import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import TechTalkCoinContract from './contracts/TechTalkCoin.json';
import config from '../config';
import getWeb3 from './getWeb3';
import { notification } from 'antd';

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

const TechTalkServiceContext = createContext({});

export function TechTalkServiceProvider({ children }) {
  const [wallet, setWallet] = useState({balance: null, allowance: null, account: null});
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

  return (
    <TechTalkServiceContext.Provider
      value={{
        loading,
        hasWeb3,
        wallet,
        setAllowance,
      }}>
      {children}
    </TechTalkServiceContext.Provider>
  );
}

export default function useTechTalkService() {
  const { ...props } = useContext(TechTalkServiceContext);

  return { ...props };
}
