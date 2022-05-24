import React from 'react';
import {
  Card,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  Checkbox,
} from '@mui/material';
import HardwareConnect from './HardwareConnect';
import { setProductList } from '../features/product';
import { useDispatch } from 'react-redux';

const NFTOwnerCard = ({
  sumProductBalances,
  generatorId,
  size,
  getGeneratorInfo,
  generatorList,
  generatorAddress,
  copyToClipboard,
  ETHUSDConversionRate,
  withdrawBalance,
  withdrawAndDelete,
  loading,
  renameNFT,
  setSelectedProduct,
  handleNewName,
  newNFTName,
  productList,
  selectedAll,
  setSelectedAll,
  handleAlerts,
}) => {
  const dispatch = useDispatch();

  const handleProductsCheckBoxes = (evt, id) => {
    const product_list_arr = { ...productList[generatorId] };
    const product_sub_obj = { ...product_list_arr[id], selected: evt.target.checked };
    product_list_arr[id] = product_sub_obj;

    const product_gen_obj = { ...productList };
    product_gen_obj[generatorId] = product_list_arr;

    const products = Object.keys(product_list_arr);
    const product_selected = [];
    for (let ii = 0; ii < products.length; ii++) {
      product_selected.push(product_list_arr[products[ii]].selected);
    }

    dispatch(setProductList(product_gen_obj));

    if (!product_selected.includes(false)) {
      setSelectedAll(true);
    } else if (product_selected.includes(false)) {
      setSelectedAll(false);
    }

    setSelectedProduct(product_selected.includes(true));
  };

  const handleAllCheckBoxes = (evt) => {
    const checkbox = evt.target.checked;
    setSelectedAll(checkbox);
    const product_list_arr = { ...productList[generatorId] };
    const products = Object.keys(product_list_arr);
    for (let ii = 0; ii < products.length; ii++) {
      const product_sub_obj = { ...product_list_arr[products[ii]], selected: checkbox };
      product_list_arr[products[ii]] = product_sub_obj;
    }
    const product_gen_obj = { ...productList };
    product_gen_obj[generatorId] = product_list_arr;
    dispatch(setProductList(product_gen_obj));
    setSelectedProduct(checkbox);
  };

  return (
    <Grid>
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            marginTop: 1,
            padding: 3,
            minWidth: size[0],
            minHeight: size[1],
            bgcolor: 'primary.main',
          }}
        >
          <Typography gutterBottom variant="h5" component="div">
            Owned NFTs
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 300 }}>
            <InputLabel id="nft-id">NFT</InputLabel>
            <Select
              disabled={generatorList ? false : true}
              labelId="nft-id"
              id="nft-id"
              label="NFT"
              value={typeof generatorId !== 'undefined' ? generatorId : ''}
              onChange={getGeneratorInfo}
            >
              {generatorList ? (
                Object.keys(generatorList).map((generatorKey) => (
                  <MenuItem sx={{ color: 'black' }} value={generatorKey} key={generatorKey}>
                    {`${generatorKey} - ${generatorList[generatorKey].name}`}
                  </MenuItem>
                ))
              ) : (
                <div></div>
              )}
            </Select>
            <FormControl sx={{ m: 1, minWidth: 300 }}>
              <Tooltip title="copy to clipboard">
                <Chip
                  label={generatorAddress ? generatorAddress : 'Generator Address'}
                  onClick={copyToClipboard}
                  disabled={generatorAddress ? false : true}
                />
              </Tooltip>
            </FormControl>
          </FormControl>

          <FormControl sx={{ padding: 1, marginBottom: 1 }}>
            {productList && generatorId ? (
              Object.keys(productList[generatorId]).map((productKey) => (
                <Grid container key={productKey}>
                  <TextField
                    disabled
                    id="filled-number"
                    label={`${productList[generatorId][productKey].name} balance`}
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="filled"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">USD</InputAdornment>,
                      endAdornment: (
                        <InputAdornment position="end">
                          {productList[generatorId][productKey].balance !== 0
                            ? `(ETH ${productList[generatorId][productKey].balance.toFixed(6)})`
                            : `(ETH ${(0).toFixed(6)})`}
                        </InputAdornment>
                      ),
                    }}
                    value={(
                      productList[generatorId][productKey].balance * ETHUSDConversionRate
                    ).toFixed(2)}
                    sx={{ maxWidth: 300 }}
                  />
                  <Checkbox
                    color="info"
                    checked={productList[generatorId][productKey].selected}
                    onChange={(event) => handleProductsCheckBoxes(event, productKey)}
                  />
                </Grid>
              ))
            ) : (
              <div></div>
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
                  endAdornment: (
                    <InputAdornment position="end">
                      {sumProductBalances && generatorId
                        ? `(ETH ${sumProductBalances[generatorId].toFixed(6)})`
                        : `(ETH ${(0).toFixed(6)})`}
                    </InputAdornment>
                  ),
                }}
                value={
                  sumProductBalances && generatorId
                    ? (sumProductBalances[generatorId] * ETHUSDConversionRate).toFixed(2)
                    : ''
                }
                sx={{ maxWidth: 300 }}
              />
              <Checkbox color="info" checked={selectedAll} onChange={handleAllCheckBoxes} />
            </Grid>
            <Button onClick={withdrawBalance} variant="contained" color="secondary">
              {loading ? <CircularProgress color="inherit" /> : 'Withdraw'}
            </Button>
            <Button
              sx={{ marginTop: 0.5 }}
              onClick={withdrawAndDelete}
              variant="contained"
              color="secondary"
            >
              {loading ? <CircularProgress color="inherit" /> : 'Withdraw and delete'}
            </Button>
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
              value={typeof newNFTName !== 'undefined' ? newNFTName : ''}
              sx={{ minWidth: 300, maxWidth: 300 }}
            />
            <Button onClick={renameNFT} variant="contained" color="secondary">
              {loading ? <CircularProgress color="inherit" /> : 'Rename NFT'}
            </Button>
          </FormControl>
        </Card>
      </Box>
    </Grid>
  );
};

export default NFTOwnerCard;
