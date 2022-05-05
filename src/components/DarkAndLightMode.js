import React, { useState, useEffect } from 'react'
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    useColorScheme, experimental_extendTheme
  } from '@mui/material/styles'
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
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Theme as MuiTheme } from '@mui/material/styles'

const theme = createTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: "teal",
          secondary: "deepOrange",
        }
      },
      dark: {
        palette: {
          primary: "cyan",
          secondary: "orange",
        }
      }
    }
  })

/*
  Couldn't figure out how to change the website colors based on light and dark mode. The only colors that change atm are the side bar, and LightPicker box colors.
*/

  const ModeSwitcher = () => {
    const { mode, setMode } = useColorScheme("light")
    const { theme, setTheme } = createTheme()
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
            sx={{ color: "white" }}
            onClick={() => {
                if (mode === 'light') {
                    setMode("dark")
                    setTheme()
                } else {
                    setMode("light")
                    setTheme("light")
                }
            }
            }
        >
        {mode === "light" ? <DarkModeIcon sx={{ color: "white"}}/> : <LightModeIcon sx={{ color: "white"}}/>}
    
        </Button>
    );
  };

const DarkAndLightMode = () => {
  return (
    <CssVarsProvider theme= { theme }>   
        <ModeSwitcher/>
    </CssVarsProvider>
  )
}

export default DarkAndLightMode