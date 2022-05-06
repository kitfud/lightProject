import React, { useState, useEffect, useRef } from 'react'
import { Card, Button, Typography, Box, Grid, CircularProgress, Snackbar, IconButton, Alert, Slide, CardMedia, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, Checkbox, FormControlLabel, Chip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { ethers } from 'ethers'
import { getGeneratorContract } from "../utils"

const AdminMinting = ({ wallet, contract, loading, setLoading, userAddress }) => {

  const [nftPrice, setNFTPrice] = useState(undefined)
  const [alerts, setAlerts] = useState([false])
  const [useAutoName, setUseAutoName] = useState(true)
  const [nftNameInput, setNftNameInput] = useState("")
  const nftMintRef = useRef(undefined)
  const [size, setSize] = useState([100, 100])

  // Generator Info
  const [generatorContract, setGeneratorContract] = useState(undefined)
  const [generatorAddress, setGeneratorAddress] = useState(undefined)
  const [productList, setProductList] = useState([])
  const [productId, setProductId] = useState(undefined)
  const [prodCurrentPrice, setProdCurrentPrice] = useState(undefined)
  const [nftList, setNftList] = useState([])
  const [nftId, setNftId] = useState(undefined)
  const [productNewPrice, setProductNewPrice] = useState(undefined)

  // New product name
  const [newProductName, setNewProductName] = useState(undefined)
  const [newProductPrice, setNewProducPrice] = useState(undefined)

  const handleAlerts = (msg, severity) => {
    setAlerts([true, msg, severity])
  }

  const handleCloseAlerts = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setAlerts([false])
  };

  const mintNFT = async () => {
    if (!loading) {
      setLoading(true)
      let nftName
      if (useAutoName) {
        const inital = Math.floor(Math.random() * userAddress.length)
        const final = Math.floor(Math.random() * userAddress.length)
        nftName = "Candy Lamps " + userAddress.substr(0, 6) + userAddress.substr(inital, final)
      } else {
        nftName = nftNameInput
      }

      try {
        let tx = await contract.mintGenerator(nftName, { "value": ethers.utils.parseEther(nftPrice) })
        await tx.wait(1)
        handleAlerts("NFT minted!", "success")
      } catch (error) {
        if (error.code === 4001) {
          handleAlerts("Transaction cancelled", "warning")
        } else if (error.code === "INSUFFICIENT_FUNDS") {
          handleAlerts("Insufficient funds for gas * price + value", "warning")
        } else if (error.code === -32602 || error.code === -32603) {
          handleAlerts("Internal error", "error")
        } else {
          handleAlerts("An unknown error occurred", "error")
        }
      }
      setLoading(false)
    }
  }

  const checkIfTokenOwner = async () => {
    const isOwner = await contract.checkIfTokenHolder(userAddress)
    let tokensOwned
    if (isOwner) {
      tokensOwned = await contract.addressToTokenID(userAddress)
      let new_tokensOwned_arr = []
      for (let ii = 0; ii < tokensOwned.length; ii++) {
        if (tokensOwned[ii] === true) {
          new_tokensOwned_arr.push(ii)
        }
      }
      setNftList(new_tokensOwned_arr)
    }
  }

  const getNFTPrice = async () => {
    try {
      const nft_price_BN = await contract.getNFTPriceInETH()
      const nft_price = ethers.utils.formatEther(nft_price_BN)
      setNFTPrice(nft_price)
    } catch (error) {
      setNFTPrice(undefined)
    }
  }

  const getNFTInfo = async (event = undefined) => {

    const nft_id = event.target.value
    setNftId(nft_id)

    const nft_address = await contract.tokenIDToGenerator(nft_id)
    setGeneratorAddress(nft_address)

    const gen_contract = getGeneratorContract(nft_address, wallet.signer)
    setGeneratorContract(gen_contract)
  }

  const updateProducts = async () => {
    if (generatorContract) {
      const products_num = await generatorContract.productCount()
      let listOfProducts = []
      for (let ii = 0; ii < products_num; ii++) {
        const product = await generatorContract.products(ii)
        const product_obj = {
          id: parseInt(product.id, 16),
          name: product.name,
          priceETH: parseFloat(ethers.utils.formatEther(product.priceUSD))
        }
        listOfProducts.push(product_obj)
      }
      setProductList(listOfProducts)
    }
  }

  const getNFTName = (evt) => {
    const name = evt.target.value
    setNftNameInput(name)
  }

  const addNewProduct = async () => {
    if (!loading) {
      setLoading(true)
      const tx = await generatorContract.addProduct(newProductName, ethers.utils.parseEther(newProductPrice))
      await tx.wait(1)
      setLoading(false)
    }
  }

  const setNewProductPrice = async () => {
    if (!loading) {
      setLoading(true)
      const tx = await generatorContract.changeProductPrice(productId, ethers.utils.parseEther(productNewPrice))
      await tx.wait(1)
      setLoading(false)
    }
  }

  const getNewProductName = (evt) => {
    const new_name = evt.target.value
    setNewProductName(new_name)
  }

  const getNewProductPrice = (evt) => {
    const new_price = evt.target.value
    setNewProducPrice(new_price)
  }

  const handleProductList = (evt) => {
    const prod_id = evt.target.value
    setProductId(prod_id)
  }

  const handleProductChangePrice = (evt) => {
    const new_price = evt.target.value
    setProductNewPrice(new_price)
  }

  const copyToClipboard = async () => {
    // const text = evt.target.value
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(generatorAddress);
    } else {
      return document.execCommand('copy', true, generatorAddress);
    }
  }

  useEffect(() => {
    if (typeof productId !== "undefined") {
      for (let ii = 0; ii < productList.length; ii++) {
        if (productList[ii].id == productId) {
          setProdCurrentPrice(productList[ii].priceETH)
          break
        }
      }
    }
  }, [productId])

  useEffect(() => {
    if (generatorContract) {
      updateProducts()
    }
    if (contract) {
      getNFTPrice()
    }
    if (wallet && contract) {
      checkIfTokenOwner()
    }
  }, [wallet, contract, loading, generatorContract])

  useEffect(() => {
    if (alerts[0]) {
      setTimeout(handleCloseAlerts, 3000)
    }
  }, [alerts])




  return (
    <>
      <Grid container sx={{ alignItems: "center", display: "flex", drection: "column", marginTop: 3, justifyContent: "space-around" }} >
        {/* <Card style={{ transform: "scale(0.5)", objectFit: 'cover', raised: true }}>
          <img src={require('../img/Candy_Lamp.png')} alt="nft" />
        </Card> */}
        <Grid >
          <Box style={{ display: "flex", justifyContent: 'center' }}>
            <Card ref={nftMintRef} sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1, padding: 3 }}>
              <CardMedia component="img"
                alt="nft"
                style={{ transform: "scale(1)", objectFit: 'cover', raised: true }}
                image={require('../img/Candy_Lamp.png')}
                xs={8}>
              </CardMedia>
              <Typography gutterBottom variant="h5" component="div">
                NFT Minting
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {nftPrice ? ("Price: ETH " + nftPrice) : ("Price: not available")}
              </Typography>
              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <TextField onChange={getNFTName} id="outlined-basic" label="NFT Name" variant="outlined" disabled={useAutoName ? true : false} />
                <FormControlLabel control={<Checkbox checked={useAutoName} onChange={(evt) => setUseAutoName(evt.target.checked)} color="info" />} label="Use auto generated name" />
              </FormControl>
              <Box mr={2} ml={2}>
                {wallet ? (
                  <Button color='warning' size="large" variant='contained' onClick={mintNFT} >{loading ? (
                    <CircularProgress color="inherit" />) : ("Mint NFT")} </Button>
                ) : (
                  <Button color='error' size="large" variant='contained' >Connect wallet</Button>
                )}
              </Box>
            </Card>
          </Box>
        </Grid>
        <Grid>
          <Box style={{ display: "flex", justifyContent: 'center' }}>
            <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1, padding: 3, minWidth: size[0], minHeight: size[1] }}>
              <Typography gutterBottom variant="h3" component="div">
                Owned NFTs
              </Typography>
              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <InputLabel id="nft-id">NFT</InputLabel>
                <Select
                  labelId="nft-id"
                  id="nft-id"
                  label="NFT"
                  value={typeof nftId !== "undefined" ? nftId : ""}
                  onChange={getNFTInfo}
                >
                  {nftList.map(nft => (
                    <MenuItem value={nft} key={nft}>{nft}</MenuItem>
                  ))}
                </Select>
                <FormControl sx={{ m: 1, minWidth: 300 }}>
                  <Chip
                    label={generatorAddress ? generatorAddress : "Address"}
                    onClick={copyToClipboard}
                    disabled={generatorAddress ? false : true}
                  />
                </FormControl>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <InputLabel id="product-id">Product</InputLabel>
                <Select
                  labelId="product-id"
                  id="product-id"
                  label="Product"
                  onChange={handleProductList}
                  value={typeof productId !== "undefined" ? productId : ""}
                  disabled={productList ? false : true}
                >
                  {productList.map(product => (
                    <MenuItem value={product.id} key={product.id}>{product.id + " - " + product.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ padding: 3 }}>
                <TextField
                  disabled
                  id="filled-required"
                  label="Current price"
                  variant="filled"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                  }}
                  value={prodCurrentPrice ? prodCurrentPrice : ""}
                />
              </FormControl>
              <FormControl sx={{ padding: 3 }}>
                <TextField
                  id="filled-number"
                  label="Price"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={handleProductChangePrice}
                  variant="filled"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                  }}
                />
                <Button onClick={setNewProductPrice} variant="contained" color="secondary">{loading ? (
                  <CircularProgress color="inherit" />) : ("Set price")}</Button>
              </FormControl>
              <FormControl sx={{ padding: 3 }}>
                <TextField
                  required
                  id="filled-required"
                  label="Name"
                  variant="filled"
                  onChange={getNewProductName}
                />
                <TextField
                  required
                  onChange={getNewProductPrice}
                  id="filled-number"
                  label="Price"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="filled"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                  }}
                />
                <Button variant="contained" color="secondary" onClick={addNewProduct}>{loading ? (
                  <CircularProgress color="inherit" />) : ("Add product")}</Button>
              </FormControl>
            </Card>
          </Box>
        </Grid>
      </Grid>
      <Snackbar TransitionComponent={Slide} onClick={handleCloseAlerts} autoHideDuration={6000} open={alerts[0]}>
        <Alert onClick={handleCloseAlerts} elevation={6} variant="filled" severity={alerts[2]} sx={{ width: '100%' }}>
          {alerts[1]} <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseAlerts}>
            <CloseIcon fontSize="small" />  </IconButton>
        </Alert>
      </Snackbar>
    </>
  );
}

export default AdminMinting