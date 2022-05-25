import React from 'react'
import { Link } from 'react-router-dom'
import {  Button,
    CircularProgress,
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    CardMedia,
    Grid,
    ThemeProvider,
    createTheme,
    Collapse,
} from "@mui/material"
import adminPic from "../img/adminHardHat.jpg"
import shoppingPic from "../img/shoppingCart.jpg"
import gearsPic from "../img/Gears.jpg"

const NavLanding = () => {
  return (
    <div id="places-to-visit">
        <Box 
            sx={{ 
                id: "places-to-visit",
                background: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                height: "100vh",
            }}
        >
                        
            <Card sx={{background: "rgba(255,255,255,0.5)", margin: "30px", flexGrow: "1", maxWidth: "500px",}}>
                <CardMedia 
                    component="img"
                    height="300px"
                    image={gearsPic}
                    alt="Administrator wearing hardhat"
                    
                />
                <CardContent sx={{ height: "75px" }}>
                    <Typography gutterBottom={true} variant="h5" component="div">
                        Admin Page
                    </Typography>
                    <Typography variant="body3" color="white">
                        Set up and manage your lighting systems.
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "center"}}>
                <Link to="admin" style={{ textDecoration: "none"}}>
                    <Button 
                        sx={{
                            maxWidth: "150px",
                            maxHeight: "75px",
                            minWidth: "150px",
                            minHeight: "75px",
                        }}
                        variant="contained"
                        color='success'
                    >
                        <Typography 
                            sx={{ fontSize: "32px" }}>ADMIN</Typography>
                    </Button>
                </Link>
                </CardActions>
            </Card>

            <Card sx={{background: "rgba(255,255,255,0.5)", margin: "30px", flexGrow: "1", maxWidth: "500px"}}>
                <CardMedia 
                   component="img"
                   height="300px"
                   image={shoppingPic}
                   alt="Shopping cart" 
                />
                <CardContent sx={{ height: "75px" }}>
                    <Typography gutterBottom={true} variant="h5" component="div">
                        Shopping Page
                    </Typography>
                    <Typography variant="body3" color="white">
                        Shop for lights, hardware, and lighting accessories to make your very own lighting system.
                    </Typography>
                </CardContent>
                <CardActions
                    sx={{
                        justifyContent: "center",
                    }}
                >
                    <Link to="shop" style={{ textDecoration: "none" }} >
                        <Button
                            sx={{
                                maxWidth: "150px",
                                maxHeight: "75px",
                                minWidth: "150px",
                                minHeight: "75px",
    
                            }}
                            variant="contained"
                            color="warning"
                        >
                            <Typography sx={{ fontSize: "32px" }}>SHOP</Typography>
                        </Button>
                    </Link>
                </CardActions>
                
            </Card>
            
        </Box>

    </div>

    
  )
}

export default NavLanding