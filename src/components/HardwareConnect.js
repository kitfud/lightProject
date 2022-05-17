import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Button, Box, Typography, Card, Grid } from "@mui/material"
import { setPort, setStatus } from '../features/connection';

const HardwareConnect = ({ handleAlerts }) => {

  const dispatch = useDispatch()
  const { port, status } = useSelector((state) => state.connection.value)
  console.log("NEW PORT: ", port)
  const [buttoncolor, setButtonColor] = useState("primary")
  const [connectionStatus, setConnectionStatus] = useState(false)

  const handleConnect = async () => {
    if ("serial" in navigator) {
      const new_port = await navigator.serial.requestPort()
      console.log("in handle Connect", new_port)
      dispatch(setPort(new_port))
      await new_port.open({ baudRate: 57600 })
    } else {
      handleAlerts("Web serial API is not supported by the browser", "warning")
    }
  }

  // const readData = async () => {
  //   const reader = port.readable.getReader();

  //   // Listen to data coming from the serial device.
  //   while (true) {
  //     const { value, done } = await reader.read();
  //     if (done) {
  //       // Allow the serial port to be closed later.
  //       reader.releaseLock();
  //       break;
  //     }
  //     // value is a Uint8Array.
  //     console.log(value);
  //   }
  // }

  const handleDisconnect = async () => {
    await port.close()
    dispatch(setStatus(false))
    dispatch(setPort(undefined))
  }

  // useEffect(() => {
  //   if (port) {
  //     readData()
  //   }
  // }, [port])

  return (
    <>
      <Box>
        {status ? (
          <Button variant="contained" color="primary" onClick={handleDisconnect}>
            DISCONNECT Light Generator
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleConnect}>
            CONNECT Light Generator
          </Button>
        )}

      </Box>
    </>
  )
}

export default HardwareConnect 