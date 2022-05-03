import React, { useContext, useState, useEffect } from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, TextField, Box, Grid } from '@mui/material'
import { makeStyles } from "@material-ui/core/styles";
import { ContractContext } from '../App';
import { ethers, Signer } from 'ethers'
import { getFactoryContract } from "../utils"

const useStyles = makeStyles({
  card: {
    width: "75vh",
    height: "80vh",
    alignItems: "center"
  },
  cardMedia: {
    // height: '100%',
    // width: '100%'
    width: "60vh",
    height: "60vh",
  },
  Media: {
    height: '100%',
    width: '100%'
  }
})

const styles = {
  media: {
    // height: 0,
    // paddingTop: '56.25%', // 16:9,
    // marginTop: '30'
  }
};

const AdminMinting = ({ wallet }) => {
  const classes = useStyles()

  //below is some example code to show you how to use useContext to get contract info into component
  let contract = useContext(ContractContext)
  const [nftPrice, setNFTPrice] = useState(undefined)
  // console.log(contractinfo.abi_LightFactory)

  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  // const [contract, setContract] = useState(null)

  const mintNFT = async (nftPrice) => {
    // const NFTPrice = await contract.getNFTPriceInETH()
    // console.log(NFTPrice)
    let tx = await contract.mintGenerator({ "value": nftPrice })
    console.log(tx)
  }

  const getNFTPrice = async () => {
    // console.log(wallet.signer)
    // contract.signer = wallet.signer
    console.log(wallet.signer)
    contract = getFactoryContract(wallet.signer)
    const nft_price = await contract.getNFTPriceInETH()
    const nft_price_for_real = ethers.utils.formatEther(nft_price)
    setNFTPrice(nft_price_for_real)

  }

  useEffect(() => {
    // console.log(contract)

    if (wallet) {
      // console.log(wallet.signer)
      getNFTPrice()
      console.log(contract)
    }
  }, [wallet])

  useEffect(() => {
    if (nftPrice) {
      console.log(nftPrice)
    }
  }, [nftPrice])

  console.log(contract)


  return (
    <>
      <Grid sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 3 }}>
        <Card style={{ display: "flex", justifyContent: 'center', raised: true }}>
          <img src={require('../img/Candy_Lamp.png')} />
        </Card>
        <Box style={{ display: "flex", justifyContent: 'center' }}>
          {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}

          <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1, padding: 3 }}>
            <Typography gutterBottom variant="h5" component="div">
              NFT Minting
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mint your NFT and set up the price.
            </Typography>
            <Typography variant="h1" color="text.secondary">
              ETH {nftPrice}
            </Typography>
            <Box mr={2} ml={2}>
              <Button color='warning' size="large" variant='contained' onClick={mintNFT} >Mint NFT</Button>
            </Box>
          </Card>
        </Box>
      </Grid>
    </>
  );
}

export default AdminMinting