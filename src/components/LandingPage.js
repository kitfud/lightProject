import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setPathname } from '../features/pathname';
import { Button, Grow, Box, Slide, Typography, Grid } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link as Scroll } from 'react-scroll';
import NavLanding from './NavLanding';
import colorfulLightsPic from '../img/colorfulLights.jpg';

export const LandingPage = () => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(false);
  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    dispatch(setPathname(window.location.pathname));
    setChecked(true);
  }, []);

  const TextHeader = () => {
    return (
      <Box
        sx={{
          backgroundImage: `url(${colorfulLightsPic})`,
          height: '100%',
          width: '100%',
          backgroundSize: 'cover',
        }}
      >
        <Box sx={{ textAlign: 'center', background: 'none', height: '100vh' }}>
          <Box sx={{ background: 'none', textAlign: 'center' }}>
            <Grow
              in={checked}
              style={{ transformOrigin: '0 0 0' }}
              {...(checked ? { timeout: 2000 } : {})}
            >
              <Typography
                sx={{
                  color: 'white',
                  fontSize: 70,
                  fontFamily: 'Nunito',
                }}
              >
                Welcome to
                <Typography sx={{ fontSize: 120, fontFamily: 'Coiny' }}>Candy Lamps</Typography>
              </Typography>
            </Grow>
          </Box>

          <Scroll to="places-to-visit" smooth={true}>
            <Slide direction="down" in={checked}>
              <KeyboardArrowDownIcon
                sx={{
                  color: 'white',
                  fontSize: '12rem',
                }}
              />
            </Slide>
          </Scroll>
        </Box>

        <NavLanding />
        <Box sx={{ background: 'none' }}>
          <Typography sx={{ textAlign: 'center', color: 'gray' }}>
            Photos by Adonyi Gábor and Ronaldo Galeano
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Grid>
        <TextHeader />
      </Grid>
    </>
  );
};
