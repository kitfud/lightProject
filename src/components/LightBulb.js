import React, { useRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setRGBColorString, setHexBulbColor } from "../features/color"

const LightBulb = () => {

  const dispatch = useDispatch()
  const { previousTxHash, currentTxHash } = useSelector((state) => state.paymentData.value)
  const { HexColor, HexBulbColor } = useSelector(state => state.color.value)

  const canvasRef = useRef(null)

  const draw = (ctx) => {
    //This is the upper part of the light bulb -------------------------------------------------------------------
    //this is a circle
    ctx.beginPath();
    ctx.arc(30, 23.5, 22.5, 0, 2 * Math.PI);
    //circule color "bulb" light color is the line below
    ctx.fillStyle = HexBulbColor
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
    // if (previousTxHash !== currentTxHash && HexColor) {
    if (HexColor) {
      dispatch(setHexBulbColor(HexColor))
      dispatch(setRGBColorString(HexColor))
    }
  }, [currentTxHash, HexColor])

  useEffect(() => {
    generateGraphic()
  }, [HexBulbColor])

  return (
    <canvas ref={canvasRef} />
  )
}

export default LightBulb