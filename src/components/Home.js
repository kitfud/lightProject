import React from 'react'
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
   
  )
}

export default Home

