import React, { useEffect, useRef } from 'react'
import { Button, Box } from "@mui/material"
import { useDispatch, useSelector } from 'react-redux'
import { setPort, setConnected } from "../features/connection"
import { sendData } from '../features/connection'
import { setCurrentTxHash, setPreviousTxHash } from '../features/paymentData'

const HardwareConnect = ({ handleAlerts }) => {

  const dispatch = useDispatch()

  const { port, connected } = useSelector(state => state.connection.value)
  const { socket } = useSelector(state => state.webSocket.value)
  const { currentTxHash } = useSelector(state => state.paymentData.value)
  const userAddress = useSelector(state => state.userAddress.value)
  const refAddress = useSelector(state => state.refAddress.value)
  const baudRate = 57600

  const userAddressRef = useRef()
  userAddressRef.current = userAddress
  const portRef = useRef()
  portRef.current = port

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


        if (userAddress && socket) {
          try {
            // const json_obj = { userAddress }
            socket.emit("owner connected", userAddress)
            handleAlerts("Port connected and registered", "success")
          } catch (error) {
            handleAlerts("Failed to register hardware device", "error")
          }
        }
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

  const handleUserRequestSocketEvent = async (data) => {
    if (portRef.current && !currentTxHash) {
      handleAlerts("Receieved user colors data.", "info", true)
      await socket.emit("request status", { status: "owner-received", address: userAddressRef.current })
      dispatch(sendData(data))
      await socket.emit("request status", { status: "owner-data processed", address: userAddressRef.current })
      handleAlerts("Data successfully processed!", "success")
      dispatch(setPreviousTxHash(currentTxHash))
      dispatch(setCurrentTxHash(undefined))
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on("user request", handleUserRequestSocketEvent)
      return () => {
        socket.off("user request")
      }
    }
  }, [socket])

  return (
    <>
      <Box>
        {connected ? (
          <Button
            variant="contained"
            color="error"
            onClick={handleDisconnect}
          >
            DISCONNECT Light Generator
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleConnect}
            disabled={userAddress || refAddress ? false : true}
          >
            CONNECT Light Generator
          </Button>
        )}

      </Box>
    </>
  )
}

export default HardwareConnect 