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

const Home = ({ wallet, contract }) => {
  

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
         <Grid sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 3 }}>
         <Card style={{ display: "flex", justifyContent: 'center', raised: true,width:'1250px', height:'175px'}}>
                <img src={require('../img/YOUR-CO-LOGO-HERE.png')} />
        </Card>
        <Box style={{ display: "flex", justifyContent: 'center' }}>
          <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1, padding: 3 }}>  
            <Typography gutterBottom variant="h2" component="div">
            Change the color first, then scan the QR code!
            </Typography>

            <Typography variant="body2" color="text.secondary">
        
            </Typography>
            <Box textAlign='center'>
            

            <center>
              <LightPicker/>
            </center>
            <br/>
            <br/>
            <QR_Code wallet={wallet} contract={contract}/>
          </Box>
          </Card>
        </Box>
      </Grid>



      </>
    )
  }

export default Home