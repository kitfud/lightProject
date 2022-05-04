import React, { useEffect, useState } from 'react'
import { AppBar, IconButton, Grid, Avatar, Button } from '@mui/material'
import { Link } from "react-router-dom"
import { makeStyles } from '@mui/styles'
import { getWeb3, getFactoryContract } from "../utils"
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

const Header = ({ setUserAddress, userAddress, setWallet, setContract, wallet, contract }) => {
  const classes = useStyles()
  const [wrongNetwork, setWrongNetwork] = useState(false)

  if (window.ethereum) {
    window.ethereum.on('chainChanged', function (networkId) {
      connectWallet()
    });
  }

  const connectWallet = async () => {
    if (!wallet) {
      const wallet = await getWeb3()
      let new_contract
      if (contract) {
        new_contract = contract.connect(wallet.signer)
      } else {
        new_contract = getFactoryContract(wallet.signer)
      }
      await setUserAddress(wallet.provider.provider.selectedAddress)
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
          {wallet && wrongNetwork ? (
            <Button onClick={connectWallet} variant="contained" color="error">
              Wrong network
            </Button>) :
            (<Button onClick={connectWallet} variant="contained">
              {typeof userAddress !== "undefined" ? userAddress.substr(0, 6) + "..." + userAddress.substr(userAddress.length - 4, userAddress.length) : "Connect"}
            </Button>)}

        </Grid>
      </Grid>
    </AppBar >
  )
}

export default Header