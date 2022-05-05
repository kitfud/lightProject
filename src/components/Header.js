
import React, { useEffect, useState } from 'react'
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, MenuItem } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from "react-router-dom"
import { makeStyles } from '@mui/styles'
import { getWeb3, getFactoryContract } from "../utils"
import { ethers } from "ethers"
import LightFactoryInfo from "../ABIs/LightFactory.json"

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

const pages = ['Home', 'Admin', 'Shop'];


const Header = ({ setUserAddress, userAddress, setWallet, setContract, wallet, contract }) => {
  const classes = useStyles()
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  if (window.ethereum) {
    window.ethereum.on('chainChanged', function (networkId) {
      connectWallet()
    });
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const connectWallet = async () => {
    if (!wallet) {
      const wallet = await getWeb3()
      let new_contract
      if (contract) {
        new_contract = contract.connect(wallet.signer)
      } else {
        new_contract = getFactoryContract(wallet.signer)
      }
      await setUserAddress(ethers.utils.getAddress(wallet.provider.provider.selectedAddress))
      await setWallet(wallet)
      await setContract(new_contract)
    } else if (wallet && wrongNetwork) {
      const contract_chaindId = LightFactoryInfo.networkId[0]
      await wallet.provider.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x" + Number(contract_chaindId).toString(16) }],
      })
    } else {
      await setUserAddress(undefined)
      await setWallet(undefined)
      const new_contract = getFactoryContract()
      await setContract(new_contract)
    }
  }

  useEffect(() => {
    if (wallet) {
      const chainId_hex = wallet.provider.provider.chainId
      const chainId = parseInt(chainId_hex, 16)
      const contract_chaindIds = LightFactoryInfo.networkId
      if (contract_chaindIds.includes(chainId)) {
        setWrongNetwork(false)
      } else {
        setWrongNetwork(true)
      }
    }
  }, [wallet])

  return (

    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <Avatar src={require("../img/minilogo.png")} />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Link key={page} to={page} onClick={handleCloseNavMenu} className={classes.link}>
                {page}
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>

            {wallet && wrongNetwork ? (
              <Button onClick={connectWallet} variant="contained" color="error">
                Wrong network
              </Button>) :
              (<Button color={typeof userAddress !== "undefined" ? "success" : "warning"} onClick={connectWallet} variant="contained">
                {typeof userAddress !== "undefined" ? userAddress.substr(0, 6) + "..." + userAddress.substr(userAddress.length - 4, userAddress.length) : "Connect"}
              </Button>)}
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  )
}

export default Header
