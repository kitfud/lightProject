import React, { useEffect, useState } from 'react'
import { Button, Box } from "@mui/material"
import { useDispatch, useSelector } from 'react-redux'
import {connect} from "simple-web-serial";
import {setPort} from '../features/connection'


const HardwareConnect = ({ handleAlerts }) => {
  const {port} = useSelector((state)=>state.connection.value)
  const rgbColor = useSelector(state => state.rgbColor.value)
  const [status, setStatus] = useState(false)

  const dispatch = useDispatch()

  const handleConnect = () => {
    connectDevice()
  }

  const handleDisconnect = () => {
    disconnectDevice()
  }

  const connectDevice = async () => {
    if ("serial" in navigator) {
      const new_port = await navigator.serial.requestPort()
      await new_port.open({ baudRate: 57600 })
      // const new_port = connect(57600)
      dispatch(setPort(new_port))
      setStatus(true)
      handleAlerts("Port connected", "info")
    } else {
      handleAlerts("Web serial API is not supported by the browser", "warning")
    }
  }

  const disconnectDevice = async () => {
    await port.close()
    setPort(undefined)
    setStatus(false)
    handleAlerts("Port disconnected", "info")
  }

  const sendData = async () => {
    console.log("port", port)
    console.log("rgb", rgbColor)
    // eslint-disable-next-line no-undef
    const encoder = new TextEncoderStream();
    const outputDone = encoder.readable.pipeTo(port.writable)
    const outputStream = encoder.writable
    const writer = outputStream.getWriter()
    await writer.write(rgbColor)
    writer.releaseLock()
   
    // port.send('paymentMade', rgbColor)
    
  }

  const readData = async () => {
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
      sendData()
    }
  }, [rgbColor])

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