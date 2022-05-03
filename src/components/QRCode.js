import React, { useState, useEffect } from 'react'
import pic from '../img/Sample_QR_Code.jpg'
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

  const howToQR = "Select a color, then click the button below."
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (

    <Grid sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 3 }}>
      <div>
        {howToQR}
        <br/><br/>
        <Button
          className="qRButton" 
          size="large"
          variant='contained'
          id="buttonQR"
          onClick={ handleOpen }>
            Get New QR Code
        </Button>
        <Modal
          open={ open }
          onClose={ handleClose }
          aria-labelledby="QRCode"
          aria-describedby="Shows the QR code in a modal.">
          <Box>
            <center><img src={ pic} height="200" width="200" margintop="300px"/></center>
          </Box>
        </Modal>
      </div>
    </Grid>
  )
}

export default QRCode