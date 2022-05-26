import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
} from '@mui/material'

const Footer = () => {
  return (
    <AppBar position="static" color="secondary" >
      <Container maxWidth="md">

        <Toolbar sx={{ justifyContent: 'center' }}>


          <Typography color="inherit" sx={{ fontFamily: "Nunito", }}>
            Chainlink Spring Hackathon 2022
          </Typography>
        </Toolbar>

      </Container>
    </AppBar>
  )
}

export default Footer