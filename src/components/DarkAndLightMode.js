import React, { useState, useEffect } from 'react';
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
  experimental_extendTheme,
} from '@mui/material/styles';
import { Box, Button, Typography, Container, IconButton, Card, Grid, Modal } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Theme as MuiTheme } from '@mui/material/styles';
import ModeSwitcher from './ModeSwitcher';

/*
  Couldn't figure out how to change the website colors based on light and dark mode. The only colors that change atm are the side bar, and LightPicker box colors.
*/

const DarkAndLightMode = ({ setColorMode }) => {
  return (
    <>
      <ModeSwitcher setColorMode={setColorMode} />
    </>
  );
};

export default DarkAndLightMode;
