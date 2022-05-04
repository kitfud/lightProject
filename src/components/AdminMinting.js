import React, { useState, useEffect } from 'react'
import { Card, Button, Typography, Box, Grid, CircularProgress, Snackbar, IconButton, Alert, Slide } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import { ethers } from 'ethers'

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

const AdminMinting = ({ wallet, contract, loading, setLoading }) => {
  const [nftPrice, setNFTPrice] = useState(undefined)
  const [alerts, setAlerts] = useState([false])

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
        } else {
          handleAlerts("An error occurred", "error")
        }
      }
      setLoading(false)
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

  useEffect(() => {
    if (contract) {
      getNFTPrice()
    }
  }, [wallet, contract])

  useEffect(() => {
    if (alerts[0]) {
      setTimeout(handleCloseAlerts, 3000)
    }
  }, [alerts])

  return (
    <>
      <Grid sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 3 }}>
        <Card style={{ display: "flex", justifyContent: 'center', raised: true }}>
          <img src={require('../img/Candy_Lamp.png')} />
        </Card>
        <Box style={{ display: "flex", justifyContent: 'center' }}>
          <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1, padding: 3 }}>
            <Typography gutterBottom variant="h5" component="div">
              NFT Minting
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mint your NFT here!
            </Typography>
            <Typography variant="h1" color="text.secondary">
              {nftPrice ? ("ETH " + nftPrice) : ("--")}
            </Typography>
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