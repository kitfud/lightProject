import React, { useState, useEffect, useRef } from 'react'
import { Card, Button, Typography, Box, Grid, CircularProgress, Snackbar, IconButton, Alert, Slide, CardMedia, FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, Checkbox, FormControlLabel, Chip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import { ethers } from 'ethers'

const AdminMinting = ({ wallet, contract, loading, setLoading, userAddress }) => {

  const [nftPrice, setNFTPrice] = useState(undefined)
  const [alerts, setAlerts] = useState([false])
  const [nftList, setNftList] = useState([])
  const [nftId, setNftId] = useState(undefined)
  const [productList, setProductList] = useState(undefined)
  const [useAutoName, setUseAutoName] = useState(true)
  const [address, setAddress] = useState(undefined)

  const nftMintRef = useRef(undefined)
  const [size, setSize] = useState([100, 100])

  const handleAlerts = (msg, severity) => {
    setAlerts([true, msg, severity])
  }

  const handleCloseAlerts = (event, reason) => {
    if (reason === 'clickaway') {
      console.log("here", reason)
      return
    }

    setAlerts([false])
  };

  const mintNFT = async () => {
    if (!loading) {
      setLoading(true)
      try {
        let tx = await contract.mintGenerator({ "value": ethers.utils.parseEther(nftPrice) })
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
      // console.log(tokensOwned)
      let new_tokensOwned_arr = []
      for (let ii = 0; ii < tokensOwned.length; ii++) {
        new_tokensOwned_arr[ii] = parseInt(tokensOwned[ii]._hex, 16)
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

  const getNFTProducts = async (event) => {

    const new_nft_id = event.target.value
    setNftId(new_nft_id)
    const nft_address = await contract.getGeneratorContractAddressByToken(new_nft_id)
    setAddress(nft_address)
    // const listOfProducts = await contract.getListOfProducts()
    // setProductList(listOfProducts)
  }

  const copyToClipboard = async () => {
    // const text = evt.target.value
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(address);
    } else {
      return document.execCommand('copy', true, address);
    }
  }

  useEffect(() => {
    if (contract) {
      getNFTPrice()
    }
    if (wallet && contract) {
      checkIfTokenOwner()
    }
  }, [wallet, contract])

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
                <TextField id="outlined-basic" label="NFT Name" variant="outlined" disabled={useAutoName ? true : false} />
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
                  value={nftId ? nftId : ""}
                  onChange={getNFTProducts}
                >
                  {nftList.map(nft => (
                    <MenuItem value={nft} key={nft}>{nft}</MenuItem>
                  ))}
                </Select>
                <FormControl sx={{ m: 1, minWidth: 300 }}>
                  <Chip
                    label={address ? address : "Address"}
                    onClick={copyToClipboard}
                    disabled={address ? false : true}
                  />
                </FormControl>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 300 }}>
                <InputLabel id="product-id">Product</InputLabel>
                <Select
                  labelId="product-id"
                  id="product-id"
                  label="Product"
                  value=""
                  onChange={""}
                  disabled={productList ? false : true}
                >
                  {nftList.map(nft => (
                    <MenuItem value={nft} key={nft}>{nft}</MenuItem>
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
                  variant="filled"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">ETH</InputAdornment>,
                  }}
                />
                <Button variant="contained" color="secondary">Set price</Button>
              </FormControl>
              <FormControl sx={{ padding: 3 }}>
                <TextField
                  required
                  id="filled-required"
                  label="Name"
                  variant="filled"
                />
                <TextField
                  required
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
                <Button variant="contained" color="secondary">Add product</Button>
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