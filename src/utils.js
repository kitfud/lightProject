import { ethers } from "ethers"
import LightFactory from './ABIs/LightFactory.json'

const getWeb3 = () => {
    if (window.ethereum) {
        return new Promise(async (resolve, reject) => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                await provider.send("eth_requestAccounts", [])
                const signer = provider.getSigner()
                resolve({ provider, signer })
            } catch (error) {
                reject(error)
            }
        })
    } else {
        alert("Install Metamask!")
    }
}

const getFactoryContract = (provider) => {
    const factoryAddress = LightFactory.address
    const factoryABI = LightFactory.abi
    const factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider)
    return factoryContract
}

export { getWeb3, getFactoryContract }