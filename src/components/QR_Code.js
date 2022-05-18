import React from 'react'
import {
  Box,
  Button,
  Typography,
  Card,
  Grid,
  Modal
} from '@mui/material'
import { makeStyles } from "@mui/styles"
import QrCode2Icon from '@mui/icons-material/QrCode2';
import QRCode from "react-qr-code";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const QR_Code = ({ selectProductPrice, selectGeneratorAddress, productSelected }) => {
  const classes = useStyles()
  const howToQR = "Select a color, then click the button below."
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <Grid sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginBottom: 2 }}>
        <Box>
          {howToQR}
          <br /><br />
          {typeof productSelected !== "undefined" ? (
            <Button
              variant="contained"
              size="large"
              color="primary"
              endIcon={<QrCode2Icon />}
              onClick={handleOpen}>
              Get QR
            </Button>) :
            (<Button
              variant="contained"
              size="large"
              color="primary"
              endIcon={<QrCode2Icon />}
            >
              Select product
            </Button>)}
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="QRCode"
            aria-describedby="Shows the QR code in a modal."
          >
            <Card>
              <center>
                <QRCode value={selectGeneratorAddress} />
              </center>
              <center>
                <Box className={classes.qRPic} sx={{ background: 'white', padding: '16px' }}>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  </Typography>
                </Box>
                <Typography variant="h6" component="h2">
                  Address:{selectGeneratorAddress}
                </Typography>
                <Typography variant="h6" component="h2">
                  Price:{selectProductPrice}
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