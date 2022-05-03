import React, { useState } from 'react'
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
    )
  }

export default Home