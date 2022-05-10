import React, { useEffect, useContext, useState } from 'react'
import { getGeneratorContract } from "../utils"
import { ethers } from 'ethers'
import {
  Box,
  Button,
  Typography,
  Container,
  IconButton,
  Card,
  Grid,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import LightPicker from './LightPicker';
import QR_Code from './QR_Code';

const Home = ({ 
  wallet, 
  contract, 
  selectGeneratorAddress, 
  selectedProduct, 
  selectProductPrice,
  ownedNFTs }) => {

  const [nftSelected, setNFTSelected] = useState(undefined)
  const [generatorContract, setGeneratorContract] = useState(undefined)
  const [generatorAddress, setGeneratorAddress] = useState(undefined)
  const [nftNameSelected, setNFTNameSelected] = useState(undefined)
  const [productList, setProductList] = useState([])
  const [productSelected,setProductSelected] = useState(undefined)
  const [productSelectedAddress,setProductSelectedAddress] = useState(null)
  const [productSelectedName, setProductSelectedName] = useState(null)
  const [productSelectedPrice, setProductSelectedPrice] = useState(null)




  const ConnectToAdminPrompt = () =>{
    return(
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
            <Typography sx= {{ color: "#b87333" }}>
              CONNECT WALLET AND MINT AN NFT
            </Typography>
          </Link>
        
      </Box> 
    )
  }

  const handleResetNFT = (event)=>{
    event.preventDefault()
    setGeneratorAddress(undefined)
    setGeneratorContract(undefined)

    setNFTSelected(undefined)
    setNFTNameSelected(undefined)
    setGeneratorContract(undefined)
    setProductList([])
    setProductSelected(undefined)
    setProductSelectedAddress(null)
    setProductSelectedName(null)

  }

  const PickLightColorAndPay = ()=>{
    return (
      <Box textAlign='center'>
      <h1>Crypto Lights</h1>
      <center>
        <LightPicker/>
      </center>
      <Button variant ="contained" color="error" onClick = {handleResetNFT}>Select New NFT</Button>
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
    
      <br/>
      <br/>
      <QR_Code 
        wallet={wallet}
        contract={contract}
        selectProductPrice={productSelectedPrice}
        selectGeneratorAddress={productSelectedAddress}  
      />
    </Box>
    )
  }

  const getNFTInfo = async (event) => {
      console.log(event.target.value)
      setNFTSelected(event.target.value)
      setNFTNameSelected(ownedNFTs[event.target.value].name)
  }

 const setGeneratorContractData = ()=>{
  for (let ii = 0; ii < ownedNFTs.length; ii++) {
    if (ownedNFTs[ii].id === parseInt(nftSelected)) {
      const nft_address = ownedNFTs[ii].address
      setGeneratorAddress(nft_address)

      const gen_contract = getGeneratorContract(nft_address, wallet.signer)
      setGeneratorContract(gen_contract)
    }
  }
 }

  useEffect(()=>{
    if(contract){
    console.log("selecting NFT data")
    setGeneratorContractData()
    }
  },[nftSelected])

  useEffect(()=>{
  console.log("generator address: " + generatorAddress)

  },[generatorAddress])

  useEffect(()=>{
    console.log("nftName: " + nftNameSelected)
    },[nftNameSelected])

  const UserSelectNFT = ()=>{
    return(
    <FormControl sx={{ m: 1, minWidth: 300 }}>
      <InputLabel id="nft-id">NFT</InputLabel>
          <Select
            labelId="nft-id"
            id="nft-id"
            label="NFT"
            value={typeof nftSelected !== "undefined" ? nftSelected : ""}
            onChange={getNFTInfo}
            >
        {ownedNFTs.map(nft => (
          <MenuItem value={nft.id} key={nft.id}>{`${nft.id} - ${nft.name}`}</MenuItem>
                            ))}
            </Select>
          </FormControl>
    )
  }

  const getProductInfo = async (event)=>{
    setProductSelected(event.target.value)
    setProductSelectedName(productList[event.target.value].name)
    let productContract = await generatorContract.idToProductContract(event.target.value)
    setProductSelectedAddress(productContract)
    setProductSelectedPrice(productList[event.target.value].priceUSD)

  }

  const UserSelectProduct = ()=>{
    return (
      productList.length >0 ? 
      <FormControl sx={{ m: 1, minWidth: 300 }}>
      <InputLabel id="product-id">Product Selection:</InputLabel>
          <Select
            labelId="product-id"
            id="product-id"
            label="PRODUCT"
            value={typeof productSelected !== "undefined" ? productSelected : ""}
            onChange={getProductInfo}
            >
        {productList.map(item => (
          <MenuItem value={item.id} key={item.id}>{`${item.id} - ${item.name}`}</MenuItem>
                            ))}
            </Select>
          </FormControl>: <Link href='/admin'>Make Some Products In Admin Page</Link>
        
    )
  }

  const updateProducts = async () => {
    if (generatorContract) {
      const products_num = await generatorContract.productCount()
      let listOfProducts = []
      for (let ii = 0; ii < products_num; ii++) {
        const product = await generatorContract.idToProduct(ii)
        const product_obj = {
          id: parseInt(product.id, 16),
          name: product.name,
          priceUSD: parseFloat(ethers.utils.formatEther(product.priceUSD)).toFixed(2)
        }
        listOfProducts.push(product_obj)
      }
      setProductList(listOfProducts)
    }
  }

useEffect(()=>{
if(productSelected){
  setProductSelectedAddress()
}
},[productSelected])

  useEffect(()=>{
if(generatorContract){
  updateProducts()
}
  },[generatorContract])

useEffect(()=>{
console.log(productList)
},[productList])



  return (
      <>
      {wallet && ownedNFTs.length > 0 ? 

      !generatorAddress?
      <UserSelectNFT/>:
      
      !productSelectedAddress?
      <UserSelectProduct/>:
      <PickLightColorAndPay/>
      : 
      <ConnectToAdminPrompt/>
      }
       
      </>
    )
  }

export default Home