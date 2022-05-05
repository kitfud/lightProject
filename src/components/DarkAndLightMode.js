import React, { useState, useEffect } from 'react'
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    useColorScheme,
  } from '@mui/material/styles';
import {
    Box,
    Button,
    Typography,
    Container,
    IconButton,
    Card,
    Grid,
    Modal
  } from '@mui/material'
  import LightModeIcon from '@mui/icons-material/LightMode';
  import DarkModeIcon from '@mui/icons-material/DarkMode';

  const ModeSwitcher = () => {
    const { mode, setMode } = useColorScheme('light')
    const [mounted, setMounted] = React.useState(false)
  
    React.useEffect(() => {
      setMounted(true)
    }, []);
  
    if (!mounted) {
      // for server-side rendering
      // Read more on https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
      return null
    }
  
    return (
      <Button
        variant="contained"
        onClick={() => {
          if (mode === 'light') {
            setMode('dark')
          } else {
            setMode('light')
          }
        }
    }
      >
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        
      </Button>
    );
  };

const DarkAndLightMode = () => {
  return (
    <CssVarsProvider>   
        <ModeSwitcher/>
    </CssVarsProvider>
  )
}

export default DarkAndLightMode