import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import LightPicker from './LightPicker';
import QR_Code from './QR_Code';
import LightBulb from './LightBulb';
import { useSearchParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { getProductContract } from '../utils';
import { setProductList } from '../features/product';

const Home = ({ handleAlerts, updateGeneratorList }) => {

  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()

  // Global Variables  
  const productList = useSelector((state) => state.product.value)
  const factoryContract = useSelector((state) => state.factoryContract.value)
  const generatorList = useSelector((state) => state.generator.value)

  // Local Variables
  const [refAddress, setRefAddress] = useState(undefined)
  const [validUrl, setValidUrl] = useState(false)
  const [nftSelected, setNFTSelected] = useState(undefined)
  const [generatorContract, setGeneratorContract] = useState(undefined)
  const [generatorAddress, setGeneratorAddress] = useState(undefined)
  const [nftNameSelected, setNFTNameSelected] = useState(undefined)
  const [productSelected, setProductSelected] = useState(undefined)
  const [productSelectedAddress, setProductSelectedAddress] = useState(null)
  const [productSelectedName, setProductSelectedName] = useState(null)
  const [productSelectedPrice, setProductSelectedPrice] = useState(null)
  const [currentColorSelectHex, setCurrentColorSelectHex] = useState('#FFFFFF')
  const [currentColorSelectRGB, setCurrentColorSelectRGB] = useState('0,0,0')
  const [paymentData, setPaymentData] = useState(undefined)
  const [previousPaymentData, setPreviousPaymentData] = useState(undefined)
  const [bulbColor, setBulbColor] = useState("#000000")

  const checkIfValidUrl = async () => {
    if (refAddress) {
      const isOwner = await factoryContract.checkIfTokenHolder(refAddress)
      console.log(isOwner)
      if (!isOwner) {
        handleAlerts("Given address has no NFTs", "warning")
      } else {
        await updateGeneratorList(refAddress)
      }
    }
  }

  const updateProductList = async () => {
    if (generatorList) {
      handleAlerts("Fetching products registered per NFT...", "info", true)
      let objOfProducts_perGenerator = {}
      const generatorList_KeysArr = Object.keys(generatorList)
      for (let jj = 0; jj < generatorList_KeysArr.length; jj++) {
        const generatorKey = generatorList_KeysArr[jj]
        const generatorContract = generatorList[generatorKey].contract
        const products_num = await generatorContract.productCount()
        let objOfProducts_fromGenerator = {}
        for (let ii = 0; ii < products_num; ii++) {
          const product = await generatorContract.idToProduct(ii)
          const product_id = parseInt(product.id, 16)

          objOfProducts_fromGenerator[product_id] = {
            name: product.name,
            priceUSD: parseFloat(ethers.utils.formatEther(product.priceUSD)).toFixed(2),
            address: product.contractAddress,
            contract: getProductContract(product.contractAddress)
          }
        }
        objOfProducts_perGenerator[generatorKey] = objOfProducts_fromGenerator
      }

      dispatch(setProductList(objOfProducts_perGenerator))
      handleAlerts("Products per NFT collected!", "info")

    } else {
      dispatch(setProductList(undefined))
    }
  }

  const handleResetNFT = (event) => {
    event.preventDefault()
    setGeneratorAddress(undefined)
    setNFTSelected(undefined)
    setNFTNameSelected(undefined)
    setGeneratorContract(undefined)
    setProductSelected(undefined)
    setProductSelectedAddress(null)
    setProductSelectedName(null)

  }

  const getNFTInfo = (event) => {
    const new_nft_selected = parseInt(event.target.value)
    setNFTSelected(new_nft_selected)
  }

  const setGeneratorContractData = () => {
    setGeneratorAddress(generatorList[nftSelected].address)
    setGeneratorContract(generatorList[nftSelected].contract)
  }

  const getProductInfo = (event) => {
    const new_selected_product = parseInt(event.target.value)
    console.log(productList[nftSelected][new_selected_product])
    setProductSelected(new_selected_product)
    setProductSelectedName(productList[nftSelected][new_selected_product].name)
    setProductSelectedAddress(productList[nftSelected][new_selected_product].address)
    setProductSelectedPrice(productList[new_selected_product].priceUSD)
  }

  useEffect(() => {
    console.log("in home component " + currentColorSelectHex)
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
    setRefAddress(ref_address)

    if (!ref_address) {
      handleAlerts("Make sure you are in a valid URL with a valid referral address!", "warning", true)
    }
  }, [])

  useEffect(() => {
    if (productSelected) {
      setProductSelectedAddress()
    }
  }, [productSelected])

  useEffect(() => {
    setNFTNameSelected(nftNameSelected)
  }, [generatorContract])

  useEffect(() => {
    if (typeof nftSelected !== "undefined") {
      setGeneratorContractData()
    }
  }, [nftSelected])


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
          sx={{ bgcolor: "white" }}
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
          sx={{ bgcolor: "white" }}
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
          <LightBulb
            paymentData={paymentData}
            currentColorSelect={currentColorSelectHex} />
        </center>

        <center>
          <LightPicker
            setPaymentData={setPaymentData}
            productSelectedAddress={productSelectedAddress}
            currentColorSelectRGB={currentColorSelectRGB}
            setCurrentColorSelectRGB={setCurrentColorSelectRGB}
            currentColorSelectHex={currentColorSelectHex}
            setCurrentColorSelectHex={setCurrentColorSelectHex} />
        </center>
        <Button variant="contained" color="error" onClick={handleResetNFT}>Select New NFT</Button>
        <Box>
          {nftNameSelected}
        </Box>
        <Box>
          {productSelectedName}
        </Box>
        <Box>
          {productSelectedAddress}
        </Box>

        <Box>
          $ {productSelectedPrice}
        </Box>



        <br />
        <br />
        <QR_Code
          refAddress={refAddress}
          contract={factoryContract}
          selectProductPrice={productSelectedPrice}
          selectGeneratorAddress={productSelectedAddress}
        />
      </Box>
    )
  }

  return (
    <>
      <UserSelectNFT />
      <UserSelectProduct />
      <PickLightColorAndPay />
    </>
  )
}

export default Home