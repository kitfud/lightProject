import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPathname } from '../features/pathname';
import { useSearchParams } from 'react-router-dom';
import { Card, Grid, Alert } from '@mui/material';
import { getProductContract, getWeb3 } from '../utils';
import { setWallet } from '../features/wallet';

const Transfer = () => {
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet.value);

  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    const new_wallet = await getWeb3();
    dispatch(setWallet(new_wallet));
  };

  const doPayment = async () => {
    const product_address = searchParams.get('ref');
    const RGBString = searchParams.get('data');
    const product_price = searchParams.get('price');
    console.log(product_address, RGBString, product_price);
    const productContract = getProductContract(product_address, wallet.signer);
    try {
      const tx = await productContract.buyProduct(RGBString, { value: product_price });
      await tx.wait(1);
      setLoading(false);
    } catch (error) {
      setLoading('error');
    }
  };

  useEffect(() => {
    if (wallet) {
      doPayment();
    }
  }, [wallet]);

  useEffect(() => {
    dispatch(setPathname(window.location.pathname));
    setLoading(true);
    connectWallet();
  }, []);

  return (
    <>
      <Card
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          marginTop: 1,
          minHeight: 750,
          justifyContent: 'center',
        }}
      >
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <Alert variant="outlined" severity="info" icon={false} sx={{ fontSize: 40 }}>
            {loading === true
              ? 'Waiting transaction...'
              : loading === 'error'
              ? 'Transaction cancelled'
              : 'Transaction sent successfully'}
          </Alert>
        </Grid>
      </Card>
    </>
  );
};

export default Transfer;
