import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  AppBar, Box, Toolbar, IconButton, Typography,
  Menu, Container, Avatar, Button, MenuItem, Tooltip, Chip
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { Link } from "react-router-dom"
import { makeStyles } from '@mui/styles'
import { getWeb3, getFactoryContract } from "../utils"
import { ethers } from "ethers"
import DarkAndLightMode from './DarkAndLightMode'
import { CHAIN_ID } from "../ABIs/deployment_address.js"
import { setWallet } from '../features/wallet'
import { setFactoryContract } from '../features/factoryContract'
import { setUserAddress } from '../features/userAddress'
import { setNetwork } from '../features/network'

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
}))

const warningPulse = makeStyles((theme) => ({
  pulse: {
    boxShadow: "0 0 0 0 rgba(255, 167, 38, 1)",
    transform: "scale(1)",
    animation: "$pulse 2s infinite"
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(0.95)",
      boxShadow: "0 0 0 0 rgba(255, 167, 38, 0.7)"
    },
    "70%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 10px rgba(255, 167, 38, 0)"
    },
    "100%": {
      transform: "scale(0.95)",
      boxShadow: "0 0 0 0 rgba(255, 167, 38, 0)"
    }
  }
}))

const errorPulse = makeStyles((theme) => ({
  pulse: {
    boxShadow: "0 0 0 0 rgba(244, 67, 54, 1)",
    transform: "scale(1)",
    animation: "$pulse 2s infinite"
  },
  "@keyframes pulse": {
    "0%": {
      transform: "scale(0.95)",
      boxShadow: "0 0 0 0 rgba(244, 67, 54, 0.7)"
    },
    "70%": {
      transform: "scale(1)",
      boxShadow: "0 0 0 10px rgba(244, 67, 54, 0)"
    },
    "100%": {
      transform: "scale(0.95)",
      boxShadow: "0 0 0 0 rgba(244, 67, 54, 0)"
    }
  }
}))


const pages = ['Admin', 'Shop'];

let first = true


const Header = ({
  setColorMode, updateProductList, updateGeneratorList, handleAlerts, copyToClipboard
}) => {
  // Global Variables
  const dispatch = useDispatch()
  const wallet = useSelector((state) => state.wallet.value)
  const factoryContract = useSelector((state) => state.factoryContract.value)
  const userAddress = useSelector((state) => state.userAddress.value)
  const wrongNetwork = useSelector((state) => state.network.value.wrongNetwork)

  // Local Variables
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [buttonColor, setButtonColor] = useState("warning")
  const [refLink, setRefLink] = useState(undefined)
  const classes = useStyles()
  const warningPulseClass = warningPulse()
  const errorPulseClass = errorPulse()

  const pathname = window.location.pathname

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const connectWallet = async () => {
    if (!wallet) {
      const new_wallet = await getWeb3()
      let new_contract
      if (factoryContract) {
        new_contract = factoryContract.connect(new_wallet.signer)
      } else {
        new_contract = getFactoryContract(new_wallet.signer)
      }

      const new_user_address = ethers.utils.getAddress(new_wallet.provider.provider.selectedAddress)

      dispatch(setWallet(new_wallet))
      dispatch(setFactoryContract(new_contract))
      dispatch(setUserAddress(new_user_address))


      await updateGeneratorList()
      await updateProductList()

      setRefLink(window.location.origin + "?ref=" + new_user_address)
    } else if (wallet && wrongNetwork) {
      await wallet.provider.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x" + Number(CHAIN_ID).toString(16) }],
      })

      await updateGeneratorList()
      await updateProductList()
      handleAlerts("Data from address collected!", "info")

    } else {
      dispatch(setUserAddress(undefined))
      dispatch(setWallet(undefined))
      const new_contract = getFactoryContract()
      dispatch(setFactoryContract(new_contract))
      setButtonColor("warning")
      setRefLink(undefined)
    }
  }

  useEffect(() => {
    if (window.ethereum && first) {
      window.ethereum.on('chainChanged', function () {
        connectWallet()
      });
      window.ethereum.on('accountsChanged', async function () {
        connectWallet()
        connectWallet()
      });
      first = false
    }
  }, [])

  useEffect(() => {
    if (wallet) {
      const chainId_hex = wallet.provider.provider.chainId
      const chainId = parseInt(chainId_hex, 16)
      const contract_chainIds = CHAIN_ID
      setButtonColor("success")
      if (contract_chainIds === chainId) {
        dispatch(setNetwork({
          chainId,
          wrongNetwork: false
        }))
      } else {
        dispatch(setNetwork({
          chainId,
          wrongNetwork: true
        }))
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
              }}            >
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
            {pathname === "/Admin" || pathname === "/Shop" ? pages.map((page) => (
              <Link key={page} to={page} onClick={handleCloseNavMenu} className={classes.link}>
                {page}
              </Link>
            )) : (<ins></ins>)}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <DarkAndLightMode setColorMode={setColorMode} />
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {pathname === "/Admin" || pathname === "/Shop" ? (
              <Tooltip title="copy to clipboard">
                <Chip
                  label={refLink ? refLink : "Referral link"}
                  onClick={copyToClipboard}
                  disabled={refLink ? false : true}
                />
              </Tooltip>) : (<ins></ins>)}

            {pathname === "/Admin" || pathname === "/Shop" ? (wallet && wrongNetwork ? (
              <Button className={errorPulseClass.pulse} onClick={connectWallet} variant="contained" color={"error"}>
                Wrong network
              </Button>) :
              (<Button className={buttonColor === "warning" ? warningPulseClass.pulse : ""} color={buttonColor} onClick={connectWallet} variant="contained">
                {typeof userAddress !== "undefined" ? userAddress.substr(0, 6) + "..." + userAddress.substr(userAddress.length - 4, userAddress.length) : "Connect"}
              </Button>)
            ) : (<ins></ins>)}
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  )
}

export default Header
