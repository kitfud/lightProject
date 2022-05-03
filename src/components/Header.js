import React, { useContext, useEffect } from 'react'
import { AppBar, IconButton, Grid, Avatar, Button, Box, Item } from '@mui/material'
import { Link } from "react-router-dom"
import { makeStyles } from '@mui/styles'
import { WalletContext } from "../App"
import { getWeb3 } from "../utils"

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

const Header = ({ setUserAddress, userAddress }) => {
  const wallet = useContext(WalletContext)
  const classes = useStyles()

  const connectWallet = async () => {
    const wallet = await getWeb3()
    setUserAddress(wallet.provider.provider.selectedAddress)
  }

  useEffect(() => {

  }, [userAddress])

  return (
    <AppBar position="static">
      <Grid container>
        <Grid item xs={3} md={3} lg={6}>
          <IconButton color="inherit">
            <Avatar src={require("../img/minilogo.png")} />
          </IconButton>

          <Link to='home' className={classes.link}>
            Home
          </Link>

          <Link to='admin' className={classes.link} >
            Admin
          </Link>

          <Link to='shop' className={classes.link}>
            Store
          </Link>

        </Grid>
        <Grid container justifyContent="center" alignItems="flex-end" direction="column" paddingRight="5px">
          <Button onClick={connectWallet} variant="contained">
            {typeof userAddress !== "undefined" ? userAddress.substr(0, 6) + "..." + userAddress.substr(userAddress.length - 4, userAddress.length) : "Connect"}
          </Button>
        </Grid>
      </Grid>
    </AppBar >
  )
}

export default Header