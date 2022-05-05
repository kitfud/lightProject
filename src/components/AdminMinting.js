import React, { useState, useEffect } from 'react'
import { Card, Button, Typography, Box, Grid, CircularProgress } from '@mui/material'
import { ethers } from 'ethers'

const AdminMinting = ({ wallet, contract, loading, setLoading }) => {
  const [nftPrice, setNFTPrice] = useState(undefined)

  const mintNFT = async () => {
    setLoading(true)
    try {
      let tx = await contract.mintGenerator({ "value": ethers.utils.parseEther(nftPrice) })
      await tx.wait(1)
    } catch (error) {
      if (error.code === 4001) {
        console.log("Transaction cancelled")
      } else {
        console.log("An error occurred")
      }
    }
    setLoading(false)
  }

  const getNFTPrice = async () => {
    try {
      const nft_price_BN = await contract.getNFTPriceInETH()
      const nft_price = ethers.utils.formatEther(nft_price_BN)
      setNFTPrice(nft_price)
    } catch (error) {
      console.log(error)
      // setNFTPrice(undefined)
    }
  }

  useEffect(() => {
    if (contract) {
      getNFTPrice()
    }
  }, [wallet, contract])

  return (
    <>
      <Grid sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 3 }}>
      <Card style={{ display: "flex", justifyContent: 'center', raised: true,width:'700px', height:'175px'}}>
                <img src={require('../img/Candy_Lamp.png')} />
        </Card>
        <Box style={{ display: "flex", justifyContent: 'center' }}>
          <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1, padding: 3 }}>  
            <Typography gutterBottom variant="h2" component="div">
              NFT Minting
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mint your NFT here!
            </Typography>
            <Typography variant="h3" color="text.secondary">
              {nftPrice ? ("ETH " + nftPrice) : ("--")}
            </Typography>
            <Box mr={2} ml={2}>
              {wallet ? (
                <Button color='warning' size="small" variant='contained' onClick={mintNFT} disabled={loading} >{loading ? (
                  <CircularProgress />) : ("Mint NFT")} </Button>
              ) : (
                <Button color='warning' size="small" variant='contained' disabled >Connect wallet</Button>
              )}
            </Box>
          </Card>
        </Box>
      </Grid>
    </>
  );
}

export default AdminMinting