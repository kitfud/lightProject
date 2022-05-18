import React, { useEffect, useState } from 'react'
import { Button, Box } from "@mui/material"
import { useDispatch, useSelector } from 'react-redux'
import { setPort, setConnected, sendData } from "../features/connection"

  const dispatch = useDispatch()

  const rgbColor = useSelector(state => state.rgbColor.value)
  const { port, connected } = useSelector(state => state.connection.value)
  const baudRate = 9600

  const handleConnect = () => {
    connectDevice()
  }

  const handleDisconnect = () => {
    disconnectDevice()
  }

  const connectDevice = async () => {
    if ("serial" in navigator) {
      try {
        const new_port = await navigator.serial.requestPort()
        await new_port.open({ baudRate })
        dispatch(setPort(new_port))
        dispatch(setConnected(true))
        handleAlerts("Port connected", "success")
      } catch (error) {
        handleAlerts("Failed to open serial port", "error")
      }
    } else {
      handleAlerts("Web serial API is not supported by the browser", "warning")
    }
  }

  const disconnectDevice = async () => {
    await port.close()
    dispatch(setPort(undefined))
    dispatch(setConnected(false))
    handleAlerts("Port disconnected", "info")
  }

  const sendDataFunc = () => {
    dispatch(sendData(rgbColor))
  }

  const readDataFunc = async () => {
    const reader = port.readable.getReader();

    // Listen to data coming from the serial device.
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        reader.releaseLock();
        break;
      }
      // value is a Uint8Array.
      console.log(value);
    }
  }

  useEffect(() => {
    console.log("SENDING RGB color")
    console.log("port",port)
    console.log("rgbColor",rgbColor)

    if (port && rgbColor) {
      sendDataFunc()
    }
  }, [rgbColor])

  return (
    <>
      <Box>
        {connected ? (
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