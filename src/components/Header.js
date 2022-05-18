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
import { setProvider } from '../features/provider'
import { setGeneratorList } from '../features/generator'
import { setProductList } from '../features/product'
import { setSendDataProcess } from '../features/connection';

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
  const provider = useSelector((state) => state.provider.value)
  const refAddress = useSelector((state) => state.refAddress.value)

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

  const getProvider = async () => {
    if (!provider) {
      const new_provider = new ethers.providers.Web3Provider(window.ethereum)
      dispatch(setProvider(new_provider))

      const new_contract = getFactoryContract()

      dispatch(setFactoryContract(new_contract))

      if (refAddress) {
        await updateGeneratorList(refAddress)
        await updateProductList()
        handleAlerts("Data from address collected!", "info")
      }

    } else if (provider && wrongNetwork) {
      const req = await provider.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x" + Number(CHAIN_ID).toString(16) }],
      })

      const new_provider = new ethers.providers.Web3Provider(window.ethereum)

      const new_contract = getFactoryContract()

      dispatch(setFactoryContract(new_contract))

      dispatch(setProvider(new_provider))

      await getChainId()

      if (refAddress) {
        await updateGeneratorList(refAddress)
        await updateProductList()
        handleAlerts("Data from address collected!", "info")
      }
    } else {
      dispatch(setGeneratorList(undefined))
      dispatch(setProductList(undefined))
    }
  }

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
      await wallet.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: "0x" + Number(CHAIN_ID).toString(16) }],
      })

      await getChainId()

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

  const getChainId = async () => {
    let chain_Id
    if (wallet) {
      const { chainId } = await wallet.provider.getNetwork()
      chain_Id = chainId
    } else if (provider) {
      const { chainId } = await provider.getNetwork()
      chain_Id = chainId
    }

    if (wallet && CHAIN_ID === chain_Id) {
      setButtonColor("success")
    } else if (provider && CHAIN_ID !== chain_Id) {
      dispatch(setGeneratorList(undefined))
      dispatch(setProductList(undefined))
    }
    dispatch(setNetwork({
      chainId: chain_Id,
      wrongNetwork: !(CHAIN_ID === chain_Id)
    }))
  }


  useEffect(() => {
    if ((window.ethereum && first) && (pathname === "/Admin" || pathname === "/Shop")) {
      window.ethereum.on('chainChanged', function () {
        connectWallet()
      });
      window.ethereum.on('accountsChanged', async function () {
        connectWallet()
        connectWallet()
      });
      first = false
    } else if (window.ethereum && first && !(pathname === "/Admin" || pathname === "/Shop")) {
      window.ethereum.on('chainChanged', function () {
        getProvider()
      });
    }
  }, [])

  useEffect(() => {
    if (wallet || provider) {
      getChainId()
      if (provider) {
        getProvider()
        // provider.on("pending", (tx) => {
        //   dispatch(setSendDataProcess("initializdd"))
        // });
      }
    }
    if (!provider) {
      getProvider()
    }
  }, [wallet, provider])

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

            {(pathname === "/Admin" || pathname === "/Shop") ? (wallet && wrongNetwork ? (
              <Button className={errorPulseClass.pulse} onClick={connectWallet} variant="contained" color={"error"}>
                Switch network
              </Button>) :
              (<Button className={buttonColor === "warning" ? warningPulseClass.pulse : ""} color={buttonColor} onClick={connectWallet} variant="contained">
                {typeof userAddress !== "undefined" ? userAddress.substr(0, 6) + "..." + userAddress.substr(userAddress.length - 4, userAddress.length) : "Connect"}
              </Button>)
            ) : (
              (provider && wrongNetwork) ? (<Button className={errorPulseClass.pulse} onClick={getProvider} variant="contained" color={"error"}>
                Switch network
              </Button>) : (<ins></ins>)
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar >
  )
}

export default Header
