import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Chip
} from '@mui/material';
import LightPicker from './LightPicker';
import QR_Code from './QR_Code';
import LightBulb from './LightBulb';
import { useSearchParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { setRefAddress } from '../features/refAddress';
import { setCurrentTxHash } from "../features/paymentData"
import { setSendDataProcess, sendData } from '../features/connection';
import { setPathname } from "../features/pathname"
import { setStatus } from '../features/webSocket';
import { setRGBColorString, setHexColor, setHexBulbColor } from '../features/color'

const Home = ({ handleAlerts, updateGeneratorList, updateProductList }) => {

  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()

  // Global Variables  
  const productList = useSelector((state) => state.product.value)
  const factoryContract = useSelector((state) => state.factoryContract.value)
  const generatorList = useSelector((state) => state.generator.value)
  const refAddress = useSelector((state) => state.refAddress.value)
  const { currentTxHash } = useSelector((state) => state.paymentData.value)
  const { socket, status } = useSelector((state) => state.webSocket.value)
  const { port } = useSelector(state => state.connection.value)
  const { HexColor, RGBColorString } = useSelector(state => state.color.value)

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
        let isOwner = false
        const tokensOwned = await factoryContract.addressToTokenID(refAddress)

        if (tokensOwned.includes(true)) {
          isOwner = true
        }
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

  // const handleResetNFT = (event) => {
  //   event.preventDefault()
  //   setNFTSelected(undefined)
  //   setNFTNameSelected(undefined)
  //   setGeneratorContract(undefined)
  //   setProductSelected(undefined)
  //   setProductSelectedAddress(undefined)
  //   setProductSelectedName(undefined)
  // }

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
      await socket.emit("user request", { data: RGBColorString, address: refAddress, tx_hash: currentTxHash })
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
    if (RGBColorString && currentTxHash) {
      sendDataFunc()
      dispatch(setCurrentTxHash(undefined))
      dispatch(setRGBColorString(undefined))
      dispatch(setHexColor(undefined))
      dispatch(setSendDataProcess("finished"))
    }
  }, [RGBColorString])

  useEffect(() => {
    if (HexColor && currentTxHash) {
      dispatch(setHexBulbColor(HexColor))
      dispatch(setRGBColorString(HexColor))
    }
  }, [HexColor, currentTxHash])

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
      selectedProductContract.on("Deposit", async (payee, value, time, currentContractBalance, event) => {

        const tx_hash = event.transactionHash
        let current_tx_hash = undefined
        await socket.emit("transaction hash", refAddress, (data) => {
          current_tx_hash = data
        })


        if (!current_tx_hash) {
          dispatch(setSendDataProcess("initialized"))
          handleAlerts("Initialization: sending data to lamps owner...", "warning", true)
          dispatch(setCurrentTxHash(tx_hash))
        }
      })

      firstTimeListener.current = false
    }
  }, [selectedProductContract])

  const UserSelectNFT = () => {
    return (
      <Box sx={{}}>
        <Typography sx={{ m: 1, fontFamily: "Nunito" }}>
          Select NFT
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 300 }}>
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
      </Box>
    )
  }

  const copyToClipboard = async (evt) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(evt.target.innerText);
    } else {
      return document.execCommand('copy', true, evt.target.innerText);
    }
  }

  const UserSelectProduct = () => {
    return (
      <Box sx={{}}>
        <Typography sx={{ m: 1, fontFamily: "Nunito" }}>
          Select Product
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 300 }}>
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
      </Box>
    )
  }

  const PickLightColorAndPay = () => {
    return (
      <Box textAlign='center'>
        <center>
          <LightBulb />
        </center>

        <center>
          <LightPicker />
        </center>
        <Box sx={{ fontFamily: "Nunito", fontSize: "20px" }}>
          {nftNameSelected ? ("NFT name: " + nftNameSelected) : ("NFT name: --")}
        </Box>
        <Box sx={{ fontFamily: "Nunito", fontSize: "20px" }}>
          {productSelectedName ? ("Product name: " + productSelectedName) : ("Product name: --")}
        </Box>
        <Box sx={{ fontFamily: "Nunito", fontSize: "20px", }}>
          {productSelectedAddress ? (<>Product address:<Tooltip sx={{ fontSize: "25px", fontFamily: "Nunito", color: "limegreen", background: "none" }} title="copy to clipboard">
            <Chip
              label={productSelectedAddress ? productSelectedAddress : "Product Address"}
              onClick={copyToClipboard}
              disabled={productSelectedAddress ? false : true}
            />
          </Tooltip> </>) : ("Product address: --")}
        </Box>

        <Box sx={{ fontFamily: "Nunito", fontSize: "20px", }}>
          {productSelectedPrice ? ("Product price: $" + productSelectedPrice + " (ETH " + (productSelectedPrice / ETHUSDConversionRate) + ")") :
            ("Product price: $-- (ETH --)")}
        </Box>
        <br />
        <br />
        <QR_Code
          productSelected={productSelected}
          selectProductPrice={productSelectedPrice}
          productSelectedAddress={productSelectedAddress}
          disabled={!status ? false : true}
          ethprice={productSelectedPrice / ETHUSDConversionRate}
        />
      </Box>
    )
  }

  return (
    <>
      <Box>

        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

          <UserSelectNFT />
          <UserSelectProduct />
        </Box>

        <Box sx={{ marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", alignText: "center" }}>
          <Typography sx={{ fontFamily: "Coiny", fontSize: "75px" }}>Candy Lamps</Typography>
        </Box>

        <Box sx={{ marginTop: 2, }}>
          <PickLightColorAndPay />
        </Box>
      </Box>

    </>
  )
}

export default Home