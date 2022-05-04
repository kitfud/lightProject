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
import { makeStyles } from "@mui/styles"
import { elementAcceptingRef } from '@mui/utils'
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { ThemeContext } from '@emotion/react'


const useStyles = makeStyles({
 
  qRPic: {
    position: "fixed",
    top: "50%",
    left: "50%",
    marginLeft: "-125px",
    marginTop: "-125px"
  }
})


const QRCode = () => {
  const classes = useStyles()
  const howToQR = "Select a color, then click the button below."
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (

    <Grid sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 3 }}>
      <Box>
        { howToQR }
        <br/><br/>
        <Button 
          variant="contained"
          size="large" 
          endIcon={<QrCode2Icon />}
          onClick={ handleOpen }>
            Get QR
        </Button>
        <Modal
          open={ open }
          onClose={ handleClose }
          aria-labelledby="QRCode"
          aria-describedby="Shows the QR code in a modal.">
          <Box className={ classes.qRPic }>
            <img src={ pic } height="250" width="250"/>
          </Box>
        </Modal>
      </Box>
    </Grid>
  )
}

export default QRCode