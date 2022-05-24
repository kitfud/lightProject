import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  Card,
  Grid,
  Modal,
  CircularProgress
} from '@mui/material'
import { makeStyles } from "@mui/styles"
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QRCode from "react-qr-code";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles({
  qRPic: {
    position: "fixed",
    top: "50%",
    left: "50%",
    marginLeft: "-125px",
    marginTop: "-125px"
  },
})

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: '#11cb5f',
    },
  },
});

const QR_Code = ({ selectProductPrice, productSelectedAddress, productSelected, ethprice }) => {

  const { RGBColorString } = useSelector(state => state.color.value)
  const { sendDataProcess } = useSelector(state => state.connection.value)
  const HexColorTemp = "fsadf"
  const classes = useStyles()
  const howToQR = "Select a color, then click the button below."
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [buttonColor, setButtonColor] = React.useState('success')


  return (
    <ThemeProvider theme={theme}>
      <Grid sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginBottom: 2 }}>
        <Box>
          {howToQR}
          <br /><br />
          {typeof productSelected !== "undefined" && typeof HexColorTemp !== "undefined" ? (
            <Button
              variant="contained"
              size="large"
              color={buttonColor}
              endIcon={<QrCode2Icon />}
              onClick={handleOpen}>
              {sendDataProcess === "initialized" ? (
                <CircularProgress color="inherit" />) : ("Get QR")}
            </Button>) :
            (<Button
              variant="contained"
              size="large"
              color={buttonColor}
              endIcon={<QrCode2Icon />}
            >
              {typeof productSelected !== "undefined" ? "Select product" : "Select color"}
            </Button>)}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="QRCode"
            aria-describedby="Shows the QR code in a modal."
          >
            <Card sx={{
              alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1,
              minHeight: 750, justifyContent: "center"
            }}>
              <center>
                <QRCode value={productSelectedAddress} />
              </center>
              <center>
                <Typography variant="h6" component="h2">
                  Address:{productSelectedAddress}
                </Typography>
                <Typography variant="h6" component="h2">
                  Price USD:{selectProductPrice}
                </Typography>
                <Typography variant="h6" component="h2">
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