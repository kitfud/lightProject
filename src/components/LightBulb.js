import React,{useRef,useEffect,useState} from 'react'

const LightBulb = ({
  previousPaymentData,
  setPreviousPaymentData,
  currentColorSelect, 
  paymentData,
  bulbColor,
  setBulbColor
  }) => {

const canvasRef = useRef(null)



const draw = (ctx) => {
    console.log("NEW DATA RECIEVED")
  
    //THIS IS A RECTANGLE
    ctx.fillStyle = "gray";
    ctx.fillRect(12.5, 40, 25, 50)
    //this is a circle
    ctx.beginPath();
    ctx.arc(25, 25, 20, 0, 2 * Math.PI);
    //circule color "bulb" light color is the line below
    ctx.fillStyle = bulbColor
  
    ctx.fill()
    ctx.stroke();  
  }

const generateGraphic = ()=>{
  let canvas = canvasRef.current
  let context = canvas.getContext('2d')
  canvas.width = 60
  canvas.height =60
  draw(context)
}

useEffect(() => {
    if(paymentData !== undefined && paymentData !== previousPaymentData) {
      setPreviousPaymentData(paymentData)
      console.log("IN LIGHT BULB COMPONENT, PAYMENT RECIEVED")
      setBulbColor(currentColorSelect)
     
      }
  }, [paymentData])

useEffect(()=>{
generateGraphic()
},[bulbColor])



return (
    <canvas ref={canvasRef} />
  )
}

export default LightBulb