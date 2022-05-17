import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {connect} from "simple-web-serial";
import {
  Box,
  Typography,
 Button, 
 Card,
  Grid
} from '@mui/material';
const LightBulb = ({
  currentColorSelectHex,
  bulbColor,
  setBulbColor,
  previousTxHash,
  currentTxHash,
  setPreviousTxHash,
  currentColorSelectRGB,
  sendData
}) => {

 
 
  const connectionRef = useRef(undefined)
  const canvasRef = useRef(null)
  const { port } = useSelector(state => state.connection.value)
  const rgbColor = useSelector(state => state.rgbColor.value)

//  const [connectionStatus, setConnectionStatus] = useState(false)
//  const [connection, setConnection] = useState(undefined)
//  const [buttonColor, setButtonColor] = useState("primary")

  const draw = (ctx) => {
    //This is the upper part of the light bulb -------------------------------------------------------------------
    //this is a circle
    ctx.beginPath();
    ctx.arc(30, 23.5, 22.5, 0, 2 * Math.PI);
    //circule color "bulb" light color is the line below
    ctx.fillStyle = bulbColor
    ctx.stroke();
    ctx.fill();

    //This is the inside of the light bulb (WIRES) not color
    ctx.beginPath();
    ctx.moveTo(24, 43);
    ctx.lineTo(24, 29.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(36, 43);
    ctx.lineTo(36, 29.5);
    ctx.stroke();
    //End upper half of light bulb-------------------------------------------------------------------------------- 


    //This is the lower half of the lightbulb. ------------------------------------------------------------------
    //THIS IS A RECTANGLE
    ctx.fillStyle = "grey";
    ctx.fillRect(17.5, 43, 25, 6)

    //This is a smaller rectangle
    ctx.fillStyle = "black";
    ctx.fillRect(17.5, 49, 25, 0.75)

    //This is a smaller rectangle
    ctx.fillStyle = "grey";
    ctx.fillRect(17.5, 49.75, 25, 3)

    //This is a smaller rectangle
    ctx.fillStyle = "black";
    ctx.fillRect(18.75, 52.75, 22.5, 0.75)

    //This is a smaller rectangle
    ctx.fillStyle = "grey";
    ctx.fillRect(18.75, 53.5, 22.5, 2)

    //This is a smaller rectangle
    ctx.fillStyle = "black";
    ctx.fillRect(20, 55.5, 20, 0.75)

    //This is a smaller rectangle
    ctx.fillStyle = "grey";
    ctx.fillRect(22.5, 56.25, 15, 2)

    //This is a smaller rectangle
    ctx.fillStyle = "black";
    ctx.fillRect(25, 58.25, 10, 1.75)
    //End lower half of light bulb--------------------------------------------------------------------------------


  }

  // useEffect(()=>{
  //   if(connectionRef.current){
  //     setConnection(connectionRef.current)
  //   }
  // },[])

  const generateGraphic = () => {
    let canvas = canvasRef.current
    let context = canvas.getContext('2d')
    canvas.width = 60
    canvas.height = 60
    draw(context)
  }

  // const handleConnect = ()=>{
  //   // connectionRef.current = connect(57600)
  //   setConnection(connect(57600))
  //   setConnectionStatus(true)
  //   setButtonColor("success")
    
  // }

  // const handleDisconnect = ()=>{
  //   setButtonColor("primary")
  //   setConnectionStatus(false)
  //   window.location.reload(false)
  //   }

//     useEffect(()=>{
// console.log("MADE CONNECTION", connection)
//     },[connection])

//   const ConnectButton = ()=>{
//     return( 
//          <Box>
//         <Button variant="contained" color="primary" onClick={handleConnect}>
//         CONNECT HARDWARE
//         </Button>
//            </Box>    
//     )
//   }

//   const DisconnectButton= ()=>{
//     return (
//       <>
    
//     <Box>
//     <Button 
//     variant="contained" 
//     color="error"
//     sx={{marginTop:"2px", marginBottom:"10px"}}
//     onClick={handleDisconnect}
//     >
//       Disconnect Machine
//     </Button>
//     </Box>
      
//       </>
//     )
//   }

  useEffect(() => {
    if (previousTxHash !== currentTxHash) {
      // console.log("CONNECTION IS: ",connection)
      // if(connection){
      //   console.log("SENDING TO HARDWARE")
      //   let mockData = '255,0,0'
      //   connection.send("paymentMade",mockData)
      // }
      setPreviousTxHash(currentTxHash)
      setBulbColor(currentColorSelectHex)
    
     
      // if (port && rgbColor) {
      //   sendData()
      // }
    }
  }, [currentTxHash])

  useEffect(() => {
    generateGraphic()
  }, [bulbColor])

  return (
<>
<canvas ref={canvasRef} />

</>
       

  )
}

export default LightBulb