import React from 'react'
import {
    Card, Button, Typography, Box, Grid, CircularProgress,
    FormControl, TextField, Checkbox, FormControlLabel
} from '@mui/material'
import { useSelector } from 'react-redux'

const NFTMintCard = ({ nftPrice, ETHUSDConversionRate, useAutoName, handleAlerts, nftMintedMsg,
    setUseAutoName, handleNFTName, loading, mintNFT, wallet, needRefresh }) => {

    const showAlert_WalletNotConnected = () => {
        handleAlerts("Please, first connect your crypto wallet (click on the top right orange button)", "warning")
    }

    return (
        <Grid >
            <Box style={{ display: "flex", justifyContent: 'center' }}>
                <Card sx={{ bgcolor: "secondary.main", alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1, marginBottom: 3, padding: 3 }}>
                    <Typography gutterBottom variant="h5" component="div" sx={{ fontFamily: "Nunito", }}>
                        NFT Minting
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        {nftPrice ? (`Price: USD ${nftPrice} (ETH ${(nftPrice / ETHUSDConversionRate).toFixed(6)})`) : ("Price: not available")}
                    </Typography>
                    <FormControl sx={{ m: 1, minWidth: 300 }}>
                        <TextField onChange={handleNFTName}
                            id="outlined-basic"
                            label="NFT Name"
                            variant="outlined"
                            disabled={useAutoName ? true : false}
                            sx={{ background: "white", }}
                        />
                        <FormControlLabel
                            control={<Checkbox
                                checked={useAutoName}
                                onChange={(evt) => setUseAutoName(evt.target.checked)} color="info" />}
                            label="Use auto generated name"
                        />
                    </FormControl>
                    <Box mr={2} ml={2}>
                        {wallet ? (
                            <Button sx={{ fontFamily: "Nunito", }} color='warning' size="large" variant='contained' onClick={mintNFT} >{loading ? (
                                <CircularProgress color="inherit" />) : ("Mint NFT")} </Button>
                        ) : (
                            <Button
                                onClick={showAlert_WalletNotConnected}
                                color='error'
                                size="large"
                                variant='contained'
                                sx={{ fontFamily: "Nunito" }}
                            >
                                Connect wallet
                            </Button>
                        )}
                    </Box>
                    {nftMintedMsg && needRefresh ? (
                        <Typography gutterBottom variant="p" component="div" sx={{ fontFamily: "Nunito", }}>
                            {nftMintedMsg}
                            {<a target="_blank" href="https://vrf.chain.link/rinkeby/5025">VRF Link</a>}
                        </Typography>) : (<ins></ins>)}
                </Card>
            </Box>
        </Grid>
    )
}

export default NFTMintCard