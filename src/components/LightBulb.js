import React,{useRef,useEffect,useState} from 'react'

const LightBulb = ({currentColorSelect, paymentData}) => {
const canvasRef = useRef(null)
let circleColor= currentColorSelect

const [pastPaymentData, setPastPaymentData] = useState(undefined)

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
    if(paymentData & paymentData !== pastPaymentData) {
      let canvas = canvasRef.current
      let context = canvas.getContext('2d')
      canvas.width = 60
      canvas.height =60
      draw(context)
      setPastPaymentData(paymentData)
    }
  }, [paymentData])

return (
    <canvas ref={canvasRef} />
  )
}

export default LightBulb