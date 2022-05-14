import Web3 from "web3";
import config from '../config';

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    // Modern dapp browsers...
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access if needed
        await window.ethereum.enable();
        // Accounts now exposed
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    } else if (window.web3) { // Legacy dapp browsers...
      // Use Mist/MetaMask's provider.
      const web3 = window.web3;
      console.log("Injected web3 detected.");
      resolve(web3);
    } else {
      const provider = new Web3.providers.HttpProvider(
        config.network
      );
      const web3 = new Web3(provider);
      console.log(`No web3 instance injected, using web3 with ${config.network} network.`);
      resolve(web3);
    }
  });

export default getWeb3;
