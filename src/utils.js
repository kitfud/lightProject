import { ethers } from "ethers"
import LightFactory from './ABIs/LightFactory.json'
import { DEPLOYMENT_ADDRESS } from "./ABIs/deployment_address"

const getWeb3 = async () => {
    if (window.ethereum) {
        return new Promise(async (resolve, reject) => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                await provider.send("eth_requestAccounts", [])
                const signer = await provider.getSigner()
                resolve({ provider, signer })
            } catch (error) {
                reject(error)
            }
        })
    } else {
        alert("Install Metamask!")
    }
}

const getFactoryContract = (signer = undefined) => {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const factoryAddress = DEPLOYMENT_ADDRESS
        const factoryABI = LightFactory.abi
        let factoryContract
        if (signer) {
            factoryContract = new ethers.Contract(factoryAddress, factoryABI, signer)
        } else {
            factoryContract = new ethers.Contract(factoryAddress, factoryABI, provider)
        }
        return factoryContract
    } else {
        return undefined
    }
}

export { getWeb3, getFactoryContract }