import React,{useRef,useEffect,useState} from 'react'

const LightBulb = ({currentColorSelect}) => {
const canvasRef = useRef(null)
let circleColor= currentColorSelect

const draw = ctx => {

    //THIS IS A RECTANGLE
    ctx.fillStyle = "gray";
    ctx.fillRect(12.5, 40, 25, 50)
    //this is a circle
    ctx.beginPath();
    ctx.arc(25, 25, 20, 0, 2 * Math.PI);
    ctx.fillStyle = circleColor;
    ctx.fill()
    ctx.stroke();
    
  }

useEffect(() => {
    let canvas = canvasRef.current
    let context = canvas.getContext('2d')
    canvas.width = 60
    canvas.height =60
    draw(context)
    
  }, [])

return (
    <canvas ref={canvasRef} />
  )
}

export default LightBulb