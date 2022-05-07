import React, { useEffect, useContext } from 'react'
import {
  Box,
  Button,
  Typography,
  Container,
  IconButton,
  Card,
  Grid
} from '@mui/material';
import LightPicker from './LightPicker';
import QR_Code from './QR_Code';

const Home = ({ wallet, contract, selectGeneratorAddress, selectedProduct, selectProductPrice }) => {

  
  useEffect(() => {
    console.log(selectProductPrice)
  }, [])

  useEffect(() => {
    const init = async () => {
      // console.log(contract)
      // console.log(wallet)
      // if (typeof wallet !== "undefined") {
      //   console.log(await contract.balanceOf(wallet.provider.provider.selectedAddress))
      // }
    }
    init()
  }, [wallet, contract])

  return (
      <>
          <Box textAlign='center'>
            <h1>Crypto Lights</h1>
            <center>
              <LightPicker/>
            </center>
            <br/>
            <br/>
            <QR_Code 
              wallet={wallet}
              contract={contract}
              selectProductPrice={selectProductPrice}
              selectGeneratorAddress={selectGeneratorAddress}  
            />
          </Box>
      </>
    )
  }

export default Home