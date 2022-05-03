import React, { useState, useEffect } from 'react'
import pic from '../img/Sample_QR_code.png'
import {
    Box,
    Button,
    Typography,
    Container,
    IconButton,
    Card,
    Grid,
    Modal
  } from '@mui/material'
import { elementAcceptingRef } from '@mui/utils'



const QRCode = () => {
/*
    const [open, setOpen] = useState(false)

    const handleClose = () => {
      setOpen(false)
    }
*/

    const howToQR = "Select a color, then click the button below."
    const [showQR, setShowQR] = useState(false)

    const handleClick = (e) => {
    

      if (showQR === true) {
        setShowQR(false)
      }

      console.log('hello', e.target)
      
      setShowQR(true)

    }


    /*
    <Button onClick={handleOpen}>Open modal</Button>
<Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box sx={style}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
      Text in a modal
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
    </Typography>
  </Box>
</Modal>
    */
  
  
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  return (
    // <div className="qRCode">
    //   <div className="content">
    //     <div className="explainQR">
    //       <center><h4>{ howToQR }</h4></center>
    //     </div>
    //     <Button
    //         className="qRButton" 
    //         size="large"
    //         variant='contained'
    //         id="buttonQR"
    //         onClick={ (e) => { handleClick(e) } }>
    //         Get New QR Code
    //     </Button>
    //     <Modal
    //       open={open}
    //       onClose={handleClose}
    //       aria-labelledby="modal-modal-title"
    //       aria-describedby="modal-modal-description">
    //       <Box>
    //         <Typography id="modal-modal-title" variant="h6" component="h2">
    //         Text in a modal
    //         </Typography>
    //         <Typography id="modal-modal-description" sx={{ mt: 2 }}>
    //           Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
    //         </Typography>
    //       </Box>
    //     </Modal>
    //     <br/><br/>
    //     <div className="qRPic">
    //     </div>
    //   </div>
    // </div>
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <center>

            <img src={pic} height="200" width="200" margintop="300px"/>
          </center>
        </Box>
      </Modal>
    </div>
  )
}

export default QRCode