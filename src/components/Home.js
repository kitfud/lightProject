import React, {useState} from 'react'
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
import pic from "../img/Sample_QR_code.png";

const Home = () => {
    
  return (
      <>
          <Box textAlign='center'>
            <h1>Crypto Lights</h1>
            <center>
              <LightPicker/>
            </center>
            <br/>
            <br/>
            
            <center>
              <QRCode/>
            </center>
          </Box>
      </>
          /*
          -Need to create onClick for button that generates and places QR code
          -Can use any random image as a placeholder
            -Do formatting for the image, replace image with QR code later
          */
  )
}

export default Home

