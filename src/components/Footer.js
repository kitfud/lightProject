import React from 'react'
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    IconButton,
  } from '@mui/material'

  const Footer = () => {
  return (
    <AppBar position="static" color="primary" >
    <Container maxWidth="md">

      <Toolbar sx={{justifyContent:'center'}}>
     

        <Typography color="inherit">
         Chainlink Spring Hackathon 2022
        </Typography>
      </Toolbar>

    </Container>
  </AppBar>
  )
}

export default Footer