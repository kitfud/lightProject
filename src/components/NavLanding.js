import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Box, Typography, Card, CardContent, CardActions, CardMedia } from "@mui/material"
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
                <Card sx={{ background: "rgba(255,255,255,0.5)", margin: "30px", flexGrow: "1", maxWidth: "500px", }}>
                    <CardMedia
                        component="img"
                        height="300px"
                        image={gearsPic}
                        alt="Pic of gears"
                    />
                    <CardContent sx={{ height: "75px" }}>
                        <Typography gutterBottom={true} variant="h5" component="div" sx={{ fontSize: "35px", fontFamily: "Nunito" }}>
                            Admin Page
                        </Typography>
                        <Typography variant="body3" color="white" sx={{ fontSize: "20px", fontFamily: "Nunito" }}>
                            Set up and manage your lighting systems.
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "center" }}>
                        <Link to="admin" style={{ textDecoration: "none" }}>
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
                                    sx={{ fontSize: "32px", fontFamily: "Nunito" }}>ADMIN</Typography>
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
                <Card sx={{ background: "rgba(255,255,255,0.5)", margin: "30px", flexGrow: "1", maxWidth: "500px" }}>
                    <CardMedia
                        component="img"
                        height="300px"
                        image={shoppingPic}
                        alt="Shopping cart"
                    />
                    <CardContent sx={{ height: "75px" }}>
                        <Typography gutterBottom={true} variant="h5" component="div" sx={{ fontSize: "35px", fontFamily: "Nunito" }}>
                            Shopping Page
                        </Typography>
                        <Typography variant="body3" color="white" sx={{ fontSize: "20px", fontFamily: "Nunito" }}>
                            Shop to make your very own lighting system.
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
                                <Typography sx={{ fontSize: "32px", fontFamily: "Nunito" }}>SHOP</Typography>
                            </Button>
                        </Link>
                    </CardActions>
                </Card>
            </Box>
        </div>
    )
}

export default NavLanding