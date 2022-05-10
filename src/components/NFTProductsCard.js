import React, { useEffect } from "react"
import {
    Card, Button, Typography, Box, Grid, CircularProgress, Tooltip, Chip, FormControl,
    InputLabel, Select, MenuItem, TextField, InputAdornment
} from '@mui/material'

const NFTProductsCard = ({ size, handleProductList, productId, productList, copyToClipboard, prodCurrentPrice,
    ETHUSDConversionRate, handleProductChangePrice, setNewProductPrice, loading, handleNewProductName, newProductName,
    handleNewProductPrice, addNewProduct, productNewPrice, newProductPrice, productAddress }) => {

    return (
        <Grid>
            <Box style={{ display: "flex", justifyContent: 'center' }}>
                <Card sx={{
                    alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1,
                    padding: 3, minWidth: size[0], minHeight: size[1]
                }}>
                    <Typography gutterBottom variant="h5" component="div">
                        NFT Products
                    </Typography>
                    <FormControl sx={{ m: 1, minWidth: 300 }}>
                        <InputLabel id="product-id">Product</InputLabel>
                        <Select
                            labelId="product-id"
                            id="product-id"
                            label="Product"
                            onChange={handleProductList}
                            value={productId !== undefined ? productId : ""}
                            disabled={productList ? false : true}
                        >
                            {productList.map(product => (
                                <MenuItem
                                    value={product.id}
                                    key={product.id}
                                >
                                    {product.id + " - " + product.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, minWidth: 300 }}>
                        <Tooltip title="copy to clipboard">
                            <Chip
                                label={productAddress ? productAddress : "Product Address"}
                                onClick={copyToClipboard}
                                disabled={productAddress ? false : true}
                            />
                        </Tooltip>
                    </FormControl>
                    <FormControl sx={{ padding: 1 }}>
                        <TextField
                            disabled
                            id="filled-required"
                            label="Current price"
                            variant="filled"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">USD</InputAdornment>,
                                endAdornment:
                                    <InputAdornment
                                        position="end"
                                    >
                                        {prodCurrentPrice ? `(ETH ${(prodCurrentPrice / ETHUSDConversionRate).toFixed(6)})` : `(ETH ${(0).toFixed(6)})`}
                                    </InputAdornment>
                            }}
                            value={prodCurrentPrice ? prodCurrentPrice : ""}
                            sx={{ maxWidth: 300 }}
                        />
                    </FormControl>
                    <FormControl sx={{ padding: 1 }}>
                        <TextField
                            required
                            id="filled-number"
                            label="Price"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleProductChangePrice}
                            variant="filled"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">USD</InputAdornment>,
                                endAdornment: <InputAdornment
                                    position="end">
                                    {productNewPrice ? `(ETH ${(productNewPrice / ETHUSDConversionRate).toFixed(6)})` : `(ETH ${(0).toFixed(6)})`}
                                </InputAdornment>
                            }}
                            value={typeof productNewPrice !== "undefined" ? productNewPrice : ""}
                            sx={{ maxWidth: 300 }}
                        />
                        <Button onClick={setNewProductPrice} variant="contained" color="secondary">{loading ? (
                            <CircularProgress color="inherit" />) : ("Change price")}</Button>
                    </FormControl>
                    <FormControl sx={{ padding: 1 }}>
                        <TextField
                            required
                            type="text"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            id="filled-product-name"
                            label="Name"
                            variant="filled"
                            onChange={(e)=>handleNewProductName(e.target.value)}
                            value={newProductName !== undefined ? newProductName : ""}
                        />
                        <TextField
                            required
                            onChange={handleNewProductPrice}
                            id="filled-number"
                            label="Price"
                            type="number"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={typeof newProductPrice !== "undefined" ? newProductPrice : ""}
                            variant="filled"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">USD</InputAdornment>,
                                endAdornment: <InputAdornment
                                    position="end">
                                    {newProductPrice ? `(ETH ${(newProductPrice / ETHUSDConversionRate).toFixed(6)})` : `(ETH ${(0).toFixed(6)})`}
                                </InputAdornment>
                            }}
                            sx={{ maxWidth: 300 }}
                        />
                        <Button variant="contained" color="secondary" onClick={addNewProduct}>{loading ? (
                            <CircularProgress color="inherit" />) : ("Add product")}</Button>
                    </FormControl>
                </Card>
            </Box>
        </Grid>
    )
}

export default NFTProductsCard
