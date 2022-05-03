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
import QRCode from './QRCode';
import { ContractContext } from "../App"

const Home = ({ wallet }) => {
  const contract = useContext(ContractContext)

  useEffect(() => {
    const init = async () => {
      // console.log(contract)
      // console.log(wallet)
      // if (typeof wallet !== "undefined") {
      //   console.log(await contract.balanceOf(wallet.provider.provider.selectedAddress))
      // }
    }
    init()
  }, [wallet])

  return (
    <>
      <Box textAlign='center'>
        <h1>Crypto Lights</h1>
        <center>
          <LightPicker />
        </center>
        <br />
        <br />

        <center>
          <QRCode />
        </center>
      </Box>
    </>
  )
}

export default Home