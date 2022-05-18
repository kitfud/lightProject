import React, { useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setRGBColor } from "../features/rgbColor"

const LightBulb = ({
  disconnecting,
  connection,
  currentColorSelectHex,
  currentColorSelectRGB,
  setCurrentColorSelectRGB,
  bulbColor,
  setBulbColor,
  previousTxHash,
  currentTxHash,
  setPreviousTxHash,
}) => {

  const dispatch = useDispatch()

  const canvasRef = useRef(null)

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

  const generateGraphic = () => {
    let canvas = canvasRef.current
    let context = canvas.getContext('2d')
    canvas.width = 60
    canvas.height = 60
    draw(context)
  }

  useEffect(() => {
    // if (previousTxHash !== currentTxHash && currentColorSelectRGB) {
    if (currentColorSelectRGB) {
      setPreviousTxHash(currentTxHash)
      setBulbColor(currentColorSelectHex)
      dispatch(setRGBColor(currentColorSelectRGB))
      setCurrentColorSelectRGB(undefined)
      if(connection){
        connection.send('paymentMade',currentColorSelectRGB)
      }
    }
  }, [currentTxHash])

  useEffect(() => {
    console.log(currentColorSelectRGB)
    console.log("BULB CONNECTION: ", connection)
    generateGraphic()
    // if(connection){
    //   connection.send('paymentMade',currentColorSelectRGB)
    // }
   
  }, [bulbColor])

  return (
    <canvas ref={canvasRef} />
  )
}

export default LightBulb