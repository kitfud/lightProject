import React, { useState } from 'react'
import pic from '../img/Sample_QR_code.png'
import {
    Box,
    Button,
    Typography,
    Container,
    IconButton,
    Card,
    Grid
  } from '@mui/material';

const QRCode = () => {

    const howToQR = "Select a color, then click the button below."

    const [showQR, setShowQR] = useState(false)

    const handleClick = (e, showQR) => {
      console.log('hello', e.target)

      let qR = showQR ? pic : null

      //document.createElement("img")
      //img.src = pic
      //document.body.appendChild(img)
      /*
      const img = new Image(200,200) //width, height
      img.src = pic
      img.id = "QR"
      document.getElementById("QR")
      */
    }

  return (
    <div className="qRCode">
      <div className="content">
        <div className="explainQR">
          <center><h4>{ howToQR }</h4></center>
        </div>
        <Button
            className="qRButton" 
            size="large"
            variant='contained'
            id="buttonQR"
            onClick={ (e) => { handleClick(e, setShowQR(true)) } }>
            Get New QR Code
        </Button>
        <br/><br/>
        {/*<div className="qRPic">
          <img src={ require=(pic) } alt="QR Code" width="200" height="200"/>
  </div>*/}
      </div>
    </div>
  )
}

export default QRCode