import React from 'react';
import {
  Card,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  CardMedia,
  FormControl,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

const NFTMintCard = ({
  nftPrice,
  ETHUSDConversionRate,
  useAutoName,
  handleAlerts,
  setUseAutoName,
  handleNFTName,
  loading,
  mintNFT,
  wallet,
}) => {
  const showAlert_WalletNotConnected = () => {
    handleAlerts(
      'Please, first connect your crypto wallet (click on the top right orange button)',
      'warning',
    );
  };

  return (
    <Grid>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          sx={{
            bgcolor: 'primary.main',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            marginTop: 1,
            marginBottom: 3,
            padding: 3,
          }}
        >
          <CardMedia
            component="img"
            alt="nft"
            style={{ transform: 'scale(1)', objectFit: 'cover', raised: true }}
            image={require('../img/Candy_Lamp.png')}
            xs={8}
          ></CardMedia>
          <Typography gutterBottom variant="h5" component="div">
            NFT Minting
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {nftPrice
              ? `Price: USD ${nftPrice} (ETH ${(nftPrice / ETHUSDConversionRate).toFixed(6)})`
              : 'Price: not available'}
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <TextField
              onChange={handleNFTName}
              id="outlined-basic"
              label="NFT Name"
              variant="outlined"
              disabled={useAutoName ? true : false}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={useAutoName}
                  onChange={(evt) => setUseAutoName(evt.target.checked)}
                  color="info"
                />
              }
              label="Use auto generated name"
            />
          </FormControl>
          <Box mr={2} ml={2}>
            {wallet ? (
              <Button color="warning" size="large" variant="contained" onClick={mintNFT}>
                {loading ? <CircularProgress color="inherit" /> : 'Mint NFT'}{' '}
              </Button>
            ) : (
              <Button
                onClick={showAlert_WalletNotConnected}
                color="error"
                size="large"
                variant="contained"
              >
                Connect wallet
              </Button>
            )}
          </Box>
        </Card>
      </Box>
    </Grid>
  );
};

export default NFTMintCard;
