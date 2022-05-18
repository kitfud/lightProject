import React, { useEffect } from 'react'
import { Button, Box } from "@mui/material"
import { useDispatch, useSelector } from 'react-redux'
import { setPort, setConnected, sendData, setSendDataProcess } from "../features/connection"
import { setRGBColorString, setHexColor } from '../features/color'
import { setPreviousTxHash } from "../features/paymentData"

const HardwareConnect = ({ handleAlerts }) => {

  const dispatch = useDispatch()

  const { RGBColorString } = useSelector(state => state.color.value)
  const { port, connected } = useSelector(state => state.connection.value)
  const { previousTxHash, currentTxHash } = useSelector(state => state.paymentData.value)
  const baudRate = 57600

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
    dispatch(sendData(RGBColorString))
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
    if (port && RGBColorString && previousTxHash !== currentTxHash) {
      // if (port && RGBColorString) {
      console.log("here")
      sendDataFunc()
      dispatch(setPreviousTxHash(currentTxHash))
      dispatch(setRGBColorString(undefined))
      dispatch(setHexColor(undefined))
      dispatch(setSendDataProcess("finished"))
    }
  }, [RGBColorString])

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