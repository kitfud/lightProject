import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import LightPicker from './LightPicker';
import QR_Code from './QR_Code';
import LightBulb from './LightBulb';
import { useSearchParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { getProductContract } from '../utils';
import { setProductList } from '../features/product';
import { setRefAddress } from '../features/refAddress';
import { setPreviousTxHash, setCurrentTxHash } from "../features/paymentData"
import { setSendDataProcess, sendData } from '../features/connection';
import { setPathname } from "../features/pathname"
import HardwareConnect from './HardwareConnect';
import { setStatus } from '../features/webSocket';
import { setRGBColorString, setHexColor } from '../features/color'

const Home = ({ handleAlerts, updateGeneratorList, updateProductList }) => {

  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()

  // Global Variables  
  const productList = useSelector((state) => state.product.value)
  const factoryContract = useSelector((state) => state.factoryContract.value)
  const generatorList = useSelector((state) => state.generator.value)
  const refAddress = useSelector((state) => state.refAddress.value)
  const { currentTxHash, previousTxHash } = useSelector((state) => state.paymentData.value)
  const { socket, status } = useSelector((state) => state.webSocket.value)
  const { port } = useSelector(state => state.connection.value)
  const { RGBColorString } = useSelector(state => state.color.value)

  // Local Variables
  const [nftSelected, setNFTSelected] = useState(undefined)
  const [generatorContract, setGeneratorContract] = useState(undefined)
  const [nftNameSelected, setNFTNameSelected] = useState(undefined)
  const [productSelected, setProductSelected] = useState(undefined)
  const [productSelectedAddress, setProductSelectedAddress] = useState(undefined)
  const [productSelectedName, setProductSelectedName] = useState(undefined)
  const [productSelectedPrice, setProductSelectedPrice] = useState(undefined)
  const firstTimeListener = useRef(true)
  const [selectedProductContract, setSelectedProductContract] = useState(undefined)
  const [ETHUSDConversionRate, setETHUSDConversionRate] = useState(undefined)

  const checkIfValidUrl = async () => {
    if (refAddress) {
      const valid_address = ethers.utils.isAddress(refAddress)
      if (valid_address) {
        const isOwner = await factoryContract.checkIfTokenHolder(refAddress)
        if (!isOwner) {
          handleAlerts("Given address has no NFTs", "warning")
        } else {
          await updateGeneratorList(refAddress)
        }
        const conversion_rate = await factoryContract.getETHUSDConversionRate()
        setETHUSDConversionRate(ethers.utils.formatEther(conversion_rate))
      } else {
        handleAlerts("Invalid address!", "error")
      }
    }
  }

  const handleResetNFT = (event) => {
    event.preventDefault()
    setNFTSelected(undefined)
    setNFTNameSelected(undefined)
    setGeneratorContract(undefined)
    setProductSelected(undefined)
    setProductSelectedAddress(undefined)
    setProductSelectedName(undefined)

  }

  const getNFTInfo = (event) => {
    const new_nft_selected = parseInt(event.target.value)
    setNFTSelected(new_nft_selected)
  }

  const setGeneratorContractData = () => {
    setNFTNameSelected(generatorList[nftSelected].name)
    setGeneratorContract(generatorList[nftSelected].contract)
  }

  const getProductInfo = (event) => {
    const new_selected_product = parseInt(event.target.value)
    setProductSelected(new_selected_product)
    setProductSelectedName(productList[nftSelected][new_selected_product].name)
    setProductSelectedAddress(productList[nftSelected][new_selected_product].address)
    setProductSelectedPrice(productList[nftSelected][new_selected_product].priceUSD)
    setSelectedProductContract(productList[nftSelected][new_selected_product].contract)
  }

  const sendDataFunc = async () => {
    if (typeof port === "undefined" && socket && typeof status === "undefined") {
      await socket.emit("user request", { data: RGBColorString, address: refAddress })
    } else if (port) {
      dispatch(sendData(RGBColorString))
    }
  }

  // SocketIO
  useEffect(() => {
    if (socket) {
      socket.on("request status", (data) => {
        let status_str
        if (data === "server-received") {
          status_str = "Data received by server"
        } else if (data === "owner-received") {
          status_str = "Data received by owner"
        } else if (data === "owner-data processed") {
          status_str = "finished"
        }
        dispatch(setStatus(status_str))
      })
      return () => {
        socket.off("request status")
      }
    }
  }, [socket])

  useEffect(() => {
    // if (RGBColorString && previousTxHash !== currentTxHash) {
    if (RGBColorString) {
      sendDataFunc()
      dispatch(setPreviousTxHash(currentTxHash))
      dispatch(setRGBColorString(undefined))
      dispatch(setHexColor(undefined))
      dispatch(setSendDataProcess("finished"))
    }
  }, [RGBColorString])

  useEffect(() => {
    if (status) {
      if (status === "finished") {
        handleAlerts("Sent data successfully", "success")
      } else {
        handleAlerts(status, "info", true)
      }
      dispatch(setStatus(undefined))
    }
  }, [status])

  useEffect(() => {
    if (generatorList) {
      updateProductList()
    }
  }, [generatorList])

  useEffect(() => {
    if (refAddress) {
      checkIfValidUrl()
    }
  }, [refAddress])

  useEffect(() => {
    dispatch(setPathname(window.location.pathname))

    const ref_address = searchParams.get('ref')
    dispatch(setRefAddress(ref_address))

    if (!ref_address) {
      handleAlerts("Make sure you are in a valid URL with a valid referral address!", "warning", true)
    }
  }, [])

  useEffect(() => {
    setNFTNameSelected(nftNameSelected)
  }, [generatorContract])

  useEffect(() => {
    if (typeof nftSelected !== "undefined") {
      setGeneratorContractData()
    }
  }, [nftSelected])

  useEffect(() => {

    if (selectedProductContract !== undefined && firstTimeListener) {
      selectedProductContract.on("Deposit", (payee, value, time, currentContractBalance, event) => {

        const tx_hash = event.transactionHash

        if (currentTxHash !== tx_hash) {
          dispatch(setPreviousTxHash(currentTxHash))
          dispatch(setCurrentTxHash(tx_hash))
          dispatch(setSendDataProcess("initialized"))
        }
      })

      firstTimeListener.current = false
    }
  }, [selectedProductContract])

  const UserSelectNFT = () => {
    return (
      <FormControl sx={{ m: 1, minWidth: 300 }}>
        <InputLabel id="nft-id">
          <Typography sx={{ color: "Black" }}>
            NFT
          </Typography>
        </InputLabel>
        <Select
          disabled={generatorList ? false : true}
          sx={{ bgcolor: "white", color: "black" }}
          labelId="nft-id"
          id="nft-id"
          label="NFT"
          value={typeof nftSelected !== "undefined" ? nftSelected : ""}
          onChange={getNFTInfo}
        >
          {generatorList ? (Object.keys(generatorList).map(generatorKey => (
            <MenuItem
              sx={{ color: "black" }}
              value={generatorKey}
              key={generatorKey}
            >
              {`${generatorKey} - ${generatorList[generatorKey].name}`}
            </MenuItem>
          ))) : (<div></div>)
          }
        </Select>
      </FormControl>
    )
  }

  const UserSelectProduct = () => {
    return (
      <FormControl sx={{ m: 1, minWidth: 300 }}>
        <InputLabel id="product-id">
          <Typography sx={{ color: "black" }}>
            Product
          </Typography>
        </InputLabel>
        <Select
          disabled={productList ? false : true}
          sx={{ bgcolor: "white", color: "black" }}
          labelId="product-id"
          id="product-id"
          label="PRODUCT"
          value={typeof productSelected !== "undefined" ? productSelected : ""}
          onChange={getProductInfo}
        >
          {productList && typeof nftSelected !== "undefined" ? (Object.keys(productList[nftSelected]).map(productKey => (
            <MenuItem
              sx={{ color: "black" }}
              value={productKey}
              key={productKey}
            >
              {productKey + " - " + productList[nftSelected][productKey].name}
            </MenuItem>
          ))) : (<div></div>)}
        </Select>
      </FormControl>
    )
  }

  const PickLightColorAndPay = () => {
    return (
      <Box textAlign='center'>
        <h1>Crypto Lights</h1>
        <center>
          <LightBulb />
          <HardwareConnect handleAlerts={handleAlerts} disabled={!status ? false : true} />
        </center>

        <center>
          <LightPicker />
        </center>
        <Box>
          {nftNameSelected ? ("NFT name: " + nftNameSelected) : ("NFT name: --")}
        </Box>
        <Box>
          {productSelectedName ? ("Product name: " + productSelectedName) : ("Product name: --")}
        </Box>
        <Box>
          {productSelectedAddress ? ("Product address: " + productSelectedAddress) : ("Product address: --")}
        </Box>

        <Box>
          {productSelectedPrice ? ("Product price: $" + productSelectedPrice + " (ETH " + (productSelectedPrice / ETHUSDConversionRate) + ")") :
            ("Product price: $-- (ETH --)")}
        </Box>
        <br />
        <br />
        <QR_Code
          productSelected={productSelected}
          selectProductPrice={productSelectedPrice}
          selectGeneratorAddress={productSelectedAddress}
          disabled={!status ? false : true}
          ethprice={productSelectedPrice / ETHUSDConversionRate}
        />
      </Box>
    )
  }

  return (
    <>
      <center>
        <UserSelectNFT />
        <UserSelectProduct />
      </center>
      <PickLightColorAndPay />
    </>
  )
}

export default Home