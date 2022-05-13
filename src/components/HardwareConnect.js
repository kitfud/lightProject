import React, { useState, useEffect } from 'react'
import { Button, Box, Typography, Card, Grid } from "@mui/material"
import { connect } from "simple-web-serial";

const HardwareConnect = ({ colorData }) => {

  const [connection, setConnection] = useState(false);
  const [buttoncolor, setButtonColor] = useState("primary")
  const [connectionStatus, setConnectionStatus] = useState(false)

  const handleConnect = () => {
    setConnection(connect(57600))
    setConnectionStatus(true)
    setButtonColor("success")
  }

  useEffect(() => {

    if (colorData !== null ) {
      console.log("COLOR DATA: " + JSON.stringify(colorData))
      if(connectionStatus === true && connection !== null){
      console.log("COLOR SELECTION + PAYMENT MADE! MACHINE TRIGGERED")
      connection.send("paymentMade", colorData)
      }
    }

  }, [colorData])


  const handleDisconnect = () => {
    setButtonColor("primary")
    setConnectionStatus(false)
    console.log("disonnect")
    window.location.reload(false)
  }


  const ConnectButton = () => {
    return (
      <Box>
        <Button variant="contained" color="primary" onClick={handleConnect}>
          CONNECT Light Generator
        </Button>
      </Box>
    )
  }

  const Disconnect = () => {
    return (
      <>

        <Box>
          <Button
            variant="contained"
            color="error"
            sx={{ marginTop: "2px", marginBottom: "10px" }}
            onClick={handleDisconnect}
          >
            Disconnect Machine
          </Button>
        </Box>

      </>
    )
  }

  return (
    <>
      {
        connectionStatus === false ?
          <ConnectButton /> :
          <Grid sx={{ alignItems: "center", display: 'flex', flexDirection: 'column' }}>
            <Card sx={{ width: 1 / 2, backgroundColor: '#84ffff' }}>
              <Typography component="span">Light Generator Connected</Typography>
              <Disconnect />
            </Card>
          </Grid>
      }
    </>
  )
}

export default HardwareConnect 