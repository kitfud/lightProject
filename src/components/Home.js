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
import HardwareConnect from './HardwareConnect';
import rgbColor from '../features/rgbColor';

const Home = ({
  disconnecting, 
  previousTxHash, 
  setPreviousTxHash, 
  setCurrentTxHash, 
  currentTxHash, 
  setPayment, 
  setRGBString, 
  rgbString, 
  connection, 
  handleAlerts, 
  updateGeneratorList, 
  updateProductList }) => {

  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()

  // Global Variables  
  const productList = useSelector((state) => state.product.value)
  const factoryContract = useSelector((state) => state.factoryContract.value)
  const generatorList = useSelector((state) => state.generator.value)
  const refAddress = useSelector((state) => state.refAddress.value)

  // Local Variables
  const [nftSelected, setNFTSelected] = useState(undefined)
  const [generatorContract, setGeneratorContract] = useState(undefined)
  const [nftNameSelected, setNFTNameSelected] = useState(undefined)
  const [productSelected, setProductSelected] = useState(undefined)
  const [productSelectedAddress, setProductSelectedAddress] = useState(undefined)
  const [productSelectedName, setProductSelectedName] = useState(undefined)
  const [productSelectedPrice, setProductSelectedPrice] = useState(undefined)
  const [currentColorSelectHex, setCurrentColorSelectHex] = useState(undefined)
  const [currentColorSelectRGB, setCurrentColorSelectRGB] = useState(undefined)
  const [bulbColor, setBulbColor] = useState(undefined)
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

  useEffect(()=>{
   console.log("IN HOME COMPONENT:", rgbString)
  },[rgbString])



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

  useEffect(() => {
    // console.log("in home component " + currentColorSelectHex)
  }, [currentColorSelectHex])

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

 const runListener=()=>{
  if (selectedProductContract !== undefined && firstTimeListener) {
    selectedProductContract.on("Deposit", (payee, value, time, currentContractBalance, event) => {

      const tx_hash = event.transactionHash

      if (currentTxHash !== tx_hash) {
        setPreviousTxHash(currentTxHash)
        setCurrentTxHash(tx_hash)
        console.log("connection:",connection)
        console.log("rgbString",rgbString)
        console.log("currenctSelect", currentColorSelectRGB)
        console.log(currentTxHash)
          setPayment(currentTxHash)
          // console.log("SENDING TO HARDWARE", data)
          // connection.send('paymentMade',data)
        
      }
    })

    firstTimeListener.current = false
  }
 }

  useEffect(() => {
 runListener()
 
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
          sx={{ bgcolor: "white", color:"black" }}
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
          sx={{ bgcolor: "white", color:"black" }}
          labelId="product-id"
          id="product-id"
          label="PRODUCT"
          value={typeof productSelected !== "undefined" ? productSelected : ""}
          onChange={getProductInfo}
        >
          {productList && typeof nftSelected !== "undefined" ? (Object.keys(productList[nftSelected]).map(productKey => (
            <MenuItem
              sx={{ color: "black", color:"black" }}
              value={productKey}
              key={productKey}
            >
              <Typography sx={{color:'black'}}>{productKey + " - " + productList[nftSelected][productKey].name}</Typography>
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
          <LightBulb
            disconnecting = {disconnecting}
            connection = {connection}
            currentColorSelectHex={currentColorSelectHex}
            previousTxHash={previousTxHash}
            currentTxHash={currentTxHash}
            setBulbColor={setBulbColor}
            bulbColor={bulbColor}
            setPreviousTxHash={setPreviousTxHash}
            currentColorSelectRGB={currentColorSelectRGB}
            setCurrentColorSelectRGB={setCurrentColorSelectRGB}
          />
          {/* <HardwareConnect handleAlerts={handleAlerts}/> */}
         
        </center>

        <center>
          <LightPicker
            setRGBString = {setRGBString}
            setCurrentColorSelectRGB={setCurrentColorSelectRGB}
            currentColorSelectHex={currentColorSelectHex}
            setCurrentColorSelectHex={setCurrentColorSelectHex}
          />
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