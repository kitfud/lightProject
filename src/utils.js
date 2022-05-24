import { ethers } from 'ethers';
import LightFactory from './ABIs/LightFactory.json';
import LightGenerator from './ABIs/LightGenerator.json';
import { DEPLOYMENT_ADDRESS } from './ABIs/deployment_address';
import ProductContractABI from './ABIs/ProductContract.json';

const getWeb3 = async () => {
  if (window.ethereum) {
    return new Promise(async (resolve, reject) => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        resolve({ provider, signer });
      } catch (error) {
        reject(error);
      }
    });
  } else {
    alert('Install Metamask!');
  }
};

const getFactoryContract = (signer = undefined) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const factoryAddress = DEPLOYMENT_ADDRESS;
    const factoryABI = LightFactory;
    let factoryContract;
    if (signer) {
      factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer);
    } else {
      factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider);
    }

    return factoryContract;
  } else {
    return undefined;
  }
};

const getGeneratorContract = (generatorAddress, signer = undefined) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const generatorABI = LightGenerator;
    let generatorContract;
    if (signer) {
      generatorContract = new ethers.Contract(generatorAddress, generatorABI, signer);
    } else {
      generatorContract = new ethers.Contract(generatorAddress, generatorABI, provider);
    }
    return generatorContract;
  } else {
    return undefined;
  }
};

const getProductContract = (productAddress, signer = undefined) => {
  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const productABI = ProductContractABI;
    let productContract;
    if (signer) {
      productContract = new ethers.Contract(productAddress, productABI, signer);
    } else {
      productContract = new ethers.Contract(productAddress, productABI, provider);
    }
    return productContract;
  } else {
    return undefined;
  }
};

export { getWeb3, getFactoryContract, getGeneratorContract, getProductContract };
