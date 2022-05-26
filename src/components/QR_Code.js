import React, { useState } from 'react'
import { Box, Button, Typography, Card, Grid, Modal, CircularProgress, CardMedia } from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QRCode from "react-qr-code";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#11cb5f',
    },
  },
});

const QR_Code = ({ selectProductPrice, productSelectedAddress, productSelected, ethprice }) => {

  const { sendDataProcess } = useSelector(state => state.connection.value)
  const HexColorTemp = "fsadf"
  const howToQR = "Select a color, then click the button below."
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <Grid sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginBottom: 2 }}>
        <Box sx={{ fontFamily: "Nunito", fontSize: "20px" }}>
          {howToQR}
          <br /><br />
          {typeof productSelected !== "undefined" && typeof HexColorTemp !== "undefined" ? (
            <Button
              variant="contained"
              size="large"
              sx={{ fontFamily: "Nunito", }}
              color={"success"}
              endIcon={<QrCode2Icon />}
              onClick={handleOpen}>
              {sendDataProcess === "initialized" ? (
                <CircularProgress color="inherit" />) : ("Get QR")}
            </Button>) :
            (<Button
              variant="contained"
              size="large"
              color={"error"}
              endIcon={<QrCode2Icon />}
              sx={{ fontFamily: "Nunito", }}
            >
              {typeof productSelected === "undefined" ? "Select product" : "Select color"}
            </Button>)}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="QRCode"
            aria-describedby="Shows the QR code in a modal."
            sx={{ alignItems: "center", justifyContent: "center", display: "flex", }}
          >
            <Card sx={{
              alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1,
              maxHeight: "75%", minWidth: "50%", maxWidth: "75%", justifyContent: "center",
            }}>
              <CardMedia
                sx={{ marginTop: 3 }}
              ><QRCode value={productSelectedAddress} /></CardMedia>

              <center>
                <Typography variant="h6" component="h2" sx={{ fontFamily: "Nunito", fontSize: "20px" }}>
                  Address:{productSelectedAddress}
                </Typography>
                <Typography variant="h6" component="h2" sx={{ fontFamily: "Nunito", fontSize: "20px", }}>
                  Price USD:{selectProductPrice}
                </Typography>
                <Typography variant="h6" component="h2" sx={{ fontFamily: "Nunito", fontSize: "20px", }}>
                  Price ETH: {ethprice}
                </Typography>
              </center>
            </Card>
          </Modal>
        </Box>
      </Grid>
    </ThemeProvider>
  )
}

export default QR_Code