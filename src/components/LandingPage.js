import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { setPathname } from '../features/pathname'
import {  Button,
        CircularProgress,
        Box,
        Typography,
        Card,
        CardContent,
        CardMedia,
        Grid,
        ThemeProvider,
        createTheme,
        Collapse,
    } from "@mui/material"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link as Scroll } from "react-scroll"
import NavLanding from './NavLanding'
import colorfulLightsPic from "../img/colorfulLights.jpg"


export const LandingPage = () => {

    const dispatch = useDispatch()
    const [checked, setChecked] = useState(false)
    const [animation, setAnimation] = useState(false)


    useEffect(() => {
        dispatch(setPathname(window.location.pathname))
    }, [])

    useEffect(() => {
        setChecked(true)
    }, [])
      
    const TextHeader = () => {

        return (
            <Box
                sx={{
                    backgroundImage: `url(${colorfulLightsPic})`,
                    height: "100%",
                    width: "100%",
                    backgroundSize: "cover",
                }}
            >    
                <Box sx={{ textAlign: "center", background: "none", height: "100vh"}}>
                    <Collapse 
                        in={checked}
                        { ...(checked ? { timeout: 1000 } : {}) }
                        collapsedHeight={50}
                    >   
                        <Box sx={{background: "none", textAlign: "center"}}>
                            <Typography 
                                sx={{
                                    color: "white",
                                    fontSize: 80,                                    
                                }}
                            >
                                Welcome to Candy Lamps.
                            </Typography> 
                        </Box>
                    <Scroll to="places-to-visit" smooth={true}>
                        <KeyboardArrowDownIcon 
                           sx={{
                                color: "white",
                                fontSize: "4rem",            
                            }}
                        />
                    </Scroll>
                    </Collapse>
                </Box>
                <NavLanding />
                <Box sx={{ background: "none", }}>
                    <Typography sx={{ textAlign: "center", color: "gray"}}>
                        Photo: Adonyi Gábor
                    </Typography>
                </Box>
            </Box>
            
        )
    }

    return (
        <>
            <Grid>
                <TextHeader />
            </Grid>
          
        </>
    )
}
