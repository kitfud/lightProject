import React, {useState} from 'react'
import {
  Box,
  Button,
  Typography,
  Container,
  IconButton,
} from '@mui/material';
import LightPicker from './LightPicker';
const Home = () => {
  return (
      <>
      
        <Box textAlign='center'>
        <h1>Crypto Lights</h1>
        <center>
        <LightPicker/>
        </center>
        <br/>
          <Button variant='contained'>
            My button
          </Button>
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

