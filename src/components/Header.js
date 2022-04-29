import React from 'react'
import {AppBar, Toolbar, CssBaseline, Typography, IconButton} from '@mui/material'
import {Link} from "react-router-dom"

import {makeStyles} from '@mui/styles'

const useStyles = makeStyles((theme) => ({
    navlinks: {
      marginLeft: theme.spacing(1),
      display: "flex",
    },
    logo: {
      flexGrow: "1",
      cursor: "pointer",
    },
    link: {
      textDecoration: "none",
      color: "white",
      fontSize: "20px",
      marginLeft: theme.spacing(20),
      "&:hover": {
        color: "yellow",
        borderBottom: "1px solid white",
      },
    },
  }));

const Header = () => {

    const classes = useStyles()

  return (
    <AppBar position="static">

    <div>
       
        <Link to='home' className = {classes.link}>
        Home
        </Link>
       

      
        <Link to='admin' className = {classes.link} >
          Admin 
         </Link>
       

      
            <Link to='shop' className = {classes.link}>
            Store       
            </Link>
       


    </div>




    </AppBar>
  )
}

export default Header