import React, { useEffect } from "react"
import {
    Card, Button, Typography, Box, Grid, CircularProgress,
    FormControl, InputLabel, Select, MenuItem, TextField, InputAdornment, Chip, Tooltip, Checkbox, FormControlLabel
} from '@mui/material'
import HardwareConnect from "./HardwareConnect"

const NFTOwnerCard = ({ sumProductBalances, nftId, size, getNFTInfo, nftList, generatorAddress,
    copyToClipboard, ETHUSDConversionRate, withdrawBalance,
    loading, renameNFT, handleNewName, newNFTName, productList, setProductList, selectedAll, setSelectedAll }) => {

    const handleProductsCheckBoxes = (evt, id) => {
        const product_list_arr = productList.slice()
        const product_selected = []
        for (let ii = 0; ii < product_list_arr.length; ii++) {
            if (product_list_arr[ii].id === id) {
                product_list_arr[ii].selected = evt.target.checked
            }
            product_selected.push(product_list_arr[ii].selected)
        }

        setProductList(product_list_arr)

        if (!product_selected.includes(false)) {
            setSelectedAll(true)
        } else if (product_selected.includes(false)) {
            setSelectedAll(false)
        }
    }

    const handleAllCheckBoxes = (evt) => {
        const checkbox = evt.target.checked
        setSelectedAll(checkbox)
        const product_list_arr = productList
        for (let ii = 0; ii < product_list_arr.length; ii++) {
            product_list_arr[ii].selected = checkbox
        }
        setProductList(product_list_arr)
    }

    // useEffect(() => {
    //     const selected_products_arr = []
    //     for (let ii = 0; ii < productList.length; ii++) {
    //         selected_products_arr.push(false)
    //     }
    //     setSelectedProducts(selected_products_arr)
    // }, [productList])


    useEffect(() => {
        console.log("Updating product balances")
        console.log("in NFT owned component" + sumProductBalances)
    }, [sumProductBalances])

    return (
        <Grid>
            <Box style={{ display: "flex", justifyContent: 'center' }}>
                <Card sx={{
                    alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1,
                    padding: 3, minWidth: size[0], minHeight: size[1], bgcolor: "primary.main"
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
                                <MenuItem
                                    sx={{ color: "black" }} 
                                    value={nft.id}
                                    key={nft.id}>{`${nft.id} - ${nft.name}`}
                                </MenuItem>
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
                        {productList.map(product => (
                            <Grid container key={product.id}>
                                <TextField
                                    disabled
                                    id="filled-number"
                                    label={`${product.name} balance`}
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    variant="filled"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">USD</InputAdornment>,
                                        endAdornment: <InputAdornment
                                            position="end">
                                            {product.balance !== 0 ? `(ETH ${product.balance.toFixed(6)})` : `(ETH ${(0).toFixed(6)})`}
                                        </InputAdornment>

                                    }}
                                    value={(product.balance * ETHUSDConversionRate).toFixed(2)}
                                    sx={{ maxWidth: 300 }}
                                />
                                <Checkbox checked={product.selected} onChange={event => handleProductsCheckBoxes(event, product.id)} />
                            </Grid>
                        )
                        )}
                        <Grid container>
                            <TextField
                                disabled
                                id="filled-number"
                                label="Total balance"
                                type="number"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                variant="filled"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">USD</InputAdornment>,
                                    endAdornment: <InputAdornment
                                        position="end">
                                        {sumProductBalances !== 0 ? `(ETH ${sumProductBalances.toFixed(6)})` : `(ETH ${(0).toFixed(6)})`}
                                    </InputAdornment>
                                }}
                                value={typeof sumProductBalances !== 0 ? (sumProductBalances * ETHUSDConversionRate).toFixed(2) : ""}
                                sx={{ maxWidth: 300 }}
                            />
                            <Checkbox checked={selectedAll} onChange={handleAllCheckBoxes} />
                        </Grid>
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