import React,{useRef,useEffect,useState} from 'react'

const LightBulb = ({currentColorSelect, paymentData}) => {
const canvasRef = useRef(null)

const [pastPaymentData, setPastPaymentData] = useState(undefined)
const [circleColor, setCircleColor] = useState('#000000')

const draw = ctx => {
  let stringPaymentData = JSON.stringify(paymentData)
  let stringPastPaymentData = JSON.stringify(pastPaymentData)

  if(stringPaymentData !== stringPastPaymentData){
    console.log("NEW DATA RECIEVED")
    //THIS IS A RECTANGLE
    ctx.fillStyle = "gray";
    ctx.fillRect(12.5, 40, 25, 50)
    //this is a circle
    ctx.beginPath();
    ctx.arc(25, 25, 20, 0, 2 * Math.PI);
    ctx.fillStyle = currentColorSelect
    //circule color "bulb" light color is the line below
    ctx.fillStyle = circleColor
  
    ctx.fill()
    ctx.stroke();
  }
    
  }

useEffect(() => {
  console.log("payment data recieved in light bulb")
  let stringPaymentData = JSON.stringify(paymentData)

    if(paymentData && stringPaymentData !== pastPaymentData) {
  
      setPastPaymentData(stringPaymentData)
      setCircleColor(currentColorSelect)
      let canvas = canvasRef.current
      let context = canvas.getContext('2d')
      canvas.width = 60
      canvas.height =60
      draw(context)
      
    }
  }, [paymentData,circleColor])

return (
    <canvas ref={canvasRef} />
  )
}

export default LightBulb