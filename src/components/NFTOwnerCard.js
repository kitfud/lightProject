import React from "react"
import {
    Card, Button, Typography, Box, Grid, CircularProgress,
    FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, Chip, Tooltip
} from '@mui/material'
import HardwareConnect from "./HardwareConnect"

const NFTOwnerCard = ({ nftId, size, getNFTInfo, nftList, generatorAddress,
    copyToClipboard, generatorBalance, ETHUSDConvertionRate, withdrawBalance,
    loading, renameNFT, handleNewName, newNFTName }) => {
    return (
        <Grid>
            <Box style={{ display: "flex", justifyContent: 'center' }}>
                <Card sx={{
                    alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1,
                    padding: 3, minWidth: size[0], minHeight: size[1]
                }}>
                    <Typography gutterBottom variant="h5" component="div">
                        Owned NFTs
                    </Typography>
                    <FormControl sx={{ m: 1, minWidth: 300 }}>
                        <InputLabel id="nft-id">NFT</InputLabel>
                        <Select
                            labelId="nft-id"
                            id="nft-id"
                            label="NFT"
                            // defaultValue=""
                            value={typeof nftId !== "undefined" ? nftId : ""}
                            onChange={getNFTInfo}
                        >
                            {nftList.map(nft => (
                                <MenuItem value={nft.id} key={nft.id}>{`${nft.id} - ${nft.name}`}</MenuItem>
                            ))}
                        </Select>
                        <FormControl sx={{ m: 1, minWidth: 300 }}>
                            <Tooltip title="copy to clipboard">
                                <Chip
                                    label={generatorAddress ? generatorAddress : "Generator Address"}
                                    onClick={copyToClipboard}
                                    disabled={generatorAddress ? false : true}
                                />
                            </Tooltip>
                        </FormControl>
                    </FormControl>
                    <HardwareConnect />
                    <FormControl sx={{ padding: 1, marginBottom: 1 }}>
                        <TextField
                            disabled
                            id="filled-number"
                            label="Balance"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            variant="filled"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">USD</InputAdornment>,
                                endAdornment: <InputAdornment
                                    position="end">
                                    {generatorBalance ? `(ETH ${(generatorBalance / ETHUSDConvertionRate).toFixed(6)})` : `(ETH ${(0).toFixed(6)})`}
                                </InputAdornment>
                            }}
                            value={typeof generatorBalance !== "undefined" ? generatorBalance.toFixed(2) : ""}
                            sx={{ maxWidth: 300 }}
                        />
                        <Button onClick={withdrawBalance} variant="contained" color="secondary">{loading ? (
                            <CircularProgress color="inherit" />) : ("Withdraw")}</Button>
                    </FormControl>
                    <FormControl sx={{ padding: 1, marginBottom: 1 }}>
                        <TextField
                            required
                            id="filled-new-nft-name"
                            label="New name"
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleNewName}
                            variant="filled"
                            value={typeof newNFTName !== "undefined" ? newNFTName : ""}
                            sx={{ minWidth: 300, maxWidth: 300 }}
                        />
                        <Button onClick={renameNFT} variant="contained" color="secondary">{loading ? (
                            <CircularProgress color="inherit" />) : ("Rename NFT")}</Button>
                    </FormControl>
                </Card>
            </Box>
        </Grid>
    )
}

export default NFTOwnerCard