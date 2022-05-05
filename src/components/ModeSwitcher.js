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


const ModeSwitcher = ({setColorMode}) => {

    const [mode,setMode] = useState("light")
  
    return (
        <Button
            sx={{ color: "white" }}
            onClick={() => {
                if (mode === 'light') {
                    setMode("dark")
                    setColorMode("night")
                   
                } else {
                    setMode("light")
                    setColorMode("day")
                }
            }
            }
        >
        {mode === "light" ? <DarkModeIcon sx={{ color: "white"}}/> : <LightModeIcon sx={{ color: "white"}}/>}
    
        </Button>
    );
  };

  export default ModeSwitcher