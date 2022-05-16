import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getGeneratorContract } from "../utils"
import { ethers } from 'ethers'
import {
  Box,
  Button,
  Typography,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import LightPicker from './LightPicker';
import QR_Code from './QR_Code';
import LightBulb from './LightBulb';

const Home = () => {

  // Global Variables  
  const productList = useSelector((state) => state.product.value)
  const factoryContract = useSelector((state) => state.factoryContract.value)
  const wallet = useSelector((state) => state.wallet.value)
  const generatorList = useSelector((state) => state.generator.value)

  // Local Variables
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
  const [paymentData, setData] = useState(undefined)
  const [previousPaymentData, setPreviousPaymentData] = useState(undefined)
  const [bulbColor, setBulbColor] = useState("#000000")


  useEffect(() => {
    console.log("in home component " + currentColorSelectHex)
  }, [currentColorSelectHex])

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

  const ConnectToAdminPrompt = () => {
    return (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          minHeight: "85vh",
          minWidth: "100%",
        }}
      >

        <Link href='/admin'>
          <Typography sx={{ color: "#b87333" }}>
            CONNECT WALLET AND MINT AN NFT
          </Typography>
        </Link>

      </Box>
    )
  }

  const UserSelectNFT = () => {
    return (
      <FormControl sx={{ m: 1, minWidth: 300 }}>
        <InputLabel id="nft-id">
          <Typography sx={{ color: "Black" }}>
            NFT
          </Typography>
        </InputLabel>
        <Select
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
      productList ?
        <FormControl sx={{ m: 1, minWidth: 300 }}>
          <InputLabel id="product-id">
            <Typography sx={{ color: "black" }}>
              Product Selection:
            </Typography>
          </InputLabel>
          <Select
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
        </FormControl> : <Link href='/admin'>Make Some Products In Admin Page</Link>

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
          wallet={wallet}
          contract={factoryContract}
          selectProductPrice={productSelectedPrice}
          selectGeneratorAddress={productSelectedAddress}
        />
      </Box>
    )
  }

  return (
    <>
      {wallet && generatorList ?

        !generatorAddress ?
          <UserSelectNFT /> :

          !productSelectedAddress ?
            <UserSelectProduct /> :
            <PickLightColorAndPay />
        :
        <ConnectToAdminPrompt />
      }

    </>
  )
}

export default Home