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

const ModeSwitcher = ({ setColorMode }) => {
  const [mode, setMode] = useState('dark');

  return (
    <Button
      sx={{ color: 'white' }}
      onClick={() => {
        if (mode === 'light') {
          setMode('dark');
          setColorMode('dark');
        } else {
          setMode('light');
          setColorMode('light');
        }
      }}
    >
      {mode === 'dark' ? (
        <LightModeIcon sx={{ color: 'white' }} />
      ) : (
        <DarkModeIcon sx={{ color: 'white' }} />
      )}
    </Button>
  );
};

export default ModeSwitcher;
