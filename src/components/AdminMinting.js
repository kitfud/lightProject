import React from 'react'
import { Card, CardActions, CardContent, CardMedia, Button, Typography, TextField, Box, Grid } from '@mui/material'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  card: {
    width: "75vh",
    height: "80vh",
    alignItems: "center"
  },
  cardMedia: {
    // height: '100%',
    // width: '100%'
    width: "60vh",
    height: "60vh",
  },
  Media: {
    height: '100%',
    width: '100%'
  }
})

const styles = {
  media: {
    // height: 0,
    // paddingTop: '56.25%', // 16:9,
    // marginTop: '30'
  }
};

const AdminMinting = () => {
  const classes = useStyles()

  return (
    <>
      <Grid sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 3 }}>
        <Card style={{ display: "flex", justifyContent: 'center', raised: true }}>
          <img src={require('../img/Candy_Lamp.png')} />
        </Card>
        <Box style={{ display: "flex", justifyContent: 'center' }}>
          {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}

          <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1, padding: 3 }}>
            <Typography gutterBottom variant="h5" component="div">
              NFT Minting
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mint your NFT and set up the price.
            </Typography>
            <Typography variant="h1" color="text.secondary">
              $9.99
            </Typography>
            <Box mr={2} ml={2}>
              <Button color='warning' size="large" variant='contained' onClick={() => console.log("NFT Minted")} >Mint NFT</Button>
            </Box>
          </Card>
        </Box>
      </Grid>
    </>
  );
}

export default AdminMinting