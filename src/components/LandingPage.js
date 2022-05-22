import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPathname } from '../features/pathname';
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from '@mui/material';

export const LandingPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPathname(window.location.pathname));
  }, []);

  return (
    <>
      <center>
        <Typography sx={{ marginBottom: 2 }}>WELCOME TO Candy Lights</Typography>

        <Card sx={{ marginBottom: 3 }}>
          <Typography color="black">Choose A Page To Visit:</Typography>
          <Link to="admin">
            <Button variant="contained" color="success">
              <Typography>ADMIN</Typography>
            </Button>
          </Link>

          <Link to="shop">
            <Button variant="contained" color="warning">
              <Typography>SHOP</Typography>
            </Button>
          </Link>
        </Card>
      </center>
    </>
  );
};
