
import { useDispatch, useSelector } from 'react-redux'
import AdminMinting from './components/AdminMinting'
import Home from './components/Home'
import { Routes, Route } from 'react-router-dom'
import Shop from './components/Shop'
import Header from './components/Header'
import Footer from './components/Footer'
import { 
  createTheme, 
  ThemeProvider, 
  Card, 
  Snackbar, 
  Slide, 
  Alert, 
  IconButton, 
  CircularProgress,
  Box,
  Typography,
  Grid,
  Button
 } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useState } from "react"
import { getFactoryContract, getGeneratorContract, getProductContract } from "./utils"
import { setFactoryContract } from './features/factoryContract'
import { setGeneratorList } from "./features/generator"
import { setProductList } from './features/product'
import { setUserAddress } from './features/userAddress'
import { setAlerts } from './features/alerts'
import { ethers } from "ethers"
import {connect} from "simple-web-serial";

let themeLightMode = createTheme({

  palette: {
    primary: {
      main: '#C0C0C0',
    },
    secondary: {
      main: '#F3F3F3',
    },
    text: {
      primary: '#926F34',
      secondary: '#000000',
    }
  }
})


let themeDarkMode = createTheme({

  palette: {
    primary: {
      main: '#4D4D4D',
    },
    secondary: {
      main: '#212121',
    },
    text: {
      primary: '#FFFF00',
      secondary: '#FFFFFF',
    }
  }
})

function App() {

  const dispatch = useDispatch()

  const factoryContract = useSelector((state) => state.factoryContract.value)
  const userAddress = useSelector((state) => state.userAddress.value)
  const wallet = useSelector((state) => state.wallet.value)
  const generatorList = useSelector((state) => state.generator.value)
  const alerts = useSelector((state) => state.alerts.value)

  const [loading, setLoading] = useState(false)
  const [colorMode, setColorMode] = useState("dark")
  const [sumProductBalances, setSumProductBalances] = useState(undefined)
  const [connection, setConnection] = useState(false);
  const [buttoncolor, setButtonColor] = useState("primary")
  const [connectionStatus, setConnectionStatus] = useState(false)

  const [newtransaction, setNewTransaction] = useState(undefined)
  const [oldtransaction, setOldTransaction] = useState(undefined)

  const handleAlerts = (msg, severity, loading = false) => {
    dispatch(setAlerts([true, msg, severity, loading]))
  }

  useEffect(()=>{
    console.log("last transaction:",newtransaction)
    if(connection && newtransaction!== oldtransaction){
      setOldTransaction(newtransaction)
      let data ='255,0,0'
      connection.send("paymentMade",data)
    }
  },[])

  useEffect(()=>{
    if(connection){
  console.log("APP CONNECTION", connection)
    }
  },[connection])

  const handleCloseAlerts = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    dispatch(setAlerts([false]))
  };

  const copyToClipboard = async (evt) => {
    // const text = evt.target.value
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(evt.target.innerText);
    } else {
      return document.execCommand('copy', true, evt.target.innerText);
    }
  }

  const updateGeneratorList = async (refAddress = undefined) => {
    if ((wallet && userAddress) || refAddress) {
      handleAlerts("Fetching NFTs owned by address...", "info", true)
      let use_address
      if (refAddress) {
        use_address = refAddress
      } else {
        use_address = userAddress
      }
      const isOwner = await factoryContract.checkIfTokenHolder(use_address)
      let tokensOwned
      if (isOwner) {
        tokensOwned = await factoryContract.addressToTokenID(use_address)
        let generatorsObj = {}
        for (let ii = 0; ii < tokensOwned.length; ii++) {
          if (tokensOwned[ii] === true) {
            const generator_address = await factoryContract.tokenIDToGenerator(ii)

            let gen_contract
            if (wallet) {
              gen_contract = getGeneratorContract(generator_address, wallet.signer)
            } else {
              gen_contract = getGeneratorContract(generator_address)
            }
            const gen_name = await gen_contract.generatorName()

            generatorsObj[ii] = {
              name: gen_name,
              address: generator_address,
              contract: gen_contract
            }
          }
        }
        dispatch(setGeneratorList(generatorsObj))
        handleAlerts("NFTs owned by address collected!", "info")
      }
    } else {
      dispatch(setGeneratorList(undefined))
    }
  }

  const updateProductList = async () => {
    if (generatorList && wallet) {
      handleAlerts("Fetching products registered per NFT...", "info", true)
      let objOfProducts_perGenerator = {}
      let totalBalances = {}
      const generatorList_KeysArr = Object.keys(generatorList)
      for (let jj = 0; jj < generatorList_KeysArr.length; jj++) {
        const generatorKey = generatorList_KeysArr[jj]
        const generatorContract = generatorList[generatorKey].contract
        const products_num = await generatorContract.productCount()
        let objOfProducts_fromGenerator = {}
        let total_balance = 0
        for (let ii = 0; ii < products_num; ii++) {
          const product = await generatorContract.idToProduct(ii)
          const product_id = parseInt(product.id, 16)
          const product_balance_BN = await wallet.provider.getBalance(product.contractAddress)
          const product_balance = parseFloat(ethers.utils.formatEther(product_balance_BN))

          objOfProducts_fromGenerator[product_id] = {
            name: product.name,
            priceUSD: parseFloat(ethers.utils.formatEther(product.priceUSD)).toFixed(2),
            address: product.contractAddress,
            selected: false,
            balance: product_balance,
            contract: getProductContract(product.contractAddress, wallet.signer)

          }

          total_balance += product_balance
        }
        totalBalances[generatorKey] = total_balance
        objOfProducts_perGenerator[generatorKey] = objOfProducts_fromGenerator
      }

      dispatch(setProductList(objOfProducts_perGenerator))
      setSumProductBalances(totalBalances)
      handleAlerts("Products per NFT collected!", "info")

    } else {
      dispatch(setProductList(undefined))
      setSumProductBalances(undefined)
    }
  }

  useEffect(() => {
    const new_contract = getFactoryContract()
    dispatch(setFactoryContract(new_contract))
  }, [])

  useEffect(() => {
    if (alerts[0]) {
      if (!alerts[3]) {
        setTimeout(handleCloseAlerts, 3000)
      }
    }
  }, [alerts])



  const handleConnect = ()=>{
    setConnection(connect(57600))
    setConnectionStatus(true)
    setButtonColor("success")  
  }

  const handleDisconnect = ()=>{
    setButtonColor("primary")
    setConnectionStatus(false)
    window.location.reload(false)
    }

    const ConnectButton = ()=>{
      return( 
           <Box>
          <Button variant="contained" color="primary" onClick={handleConnect}>
          CONNECT Vending Machine
          </Button>
             </Box>    
      )
    }
  
    const DisconnectButton= ()=>{
      return (
        <>    
      <Box>
      <Button 
      variant="contained" 
      color="error"
      sx={{marginTop:"2px", marginBottom:"10px"}}
      onClick={handleDisconnect}
      >
        Disconnect Machine
      </Button>
      </Box>  
        </>
      )
    }

  return (
    <>
      <ThemeProvider theme={colorMode === "dark" ? themeDarkMode : themeLightMode}>
      {

connectionStatus === false? 
        <ConnectButton/>:
            <Grid sx={{alignItems:"center",display:'flex', flexDirection:'column'}}>
            <Card sx={{width:1/2, backgroundColor: '#84ffff' }}>
                <Typography component="span">Hardware Connected</Typography>
                <DisconnectButton/>
            </Card>
            </Grid>


}
        <Header
          setColorMode={setColorMode}
          setUserAddress={setUserAddress}
          userAddress={userAddress}
          updateGeneratorList={updateGeneratorList}
          updateProductList={updateProductList}
          handleAlerts={handleAlerts}
          handleCloseAlerts={handleCloseAlerts}
          copyToClipboard={copyToClipboard}
        />

        <Card sx={{ bgcolor: "secondary.main" }}>
          <Routes>
            <Route path='/' element={
              <Home
                setNewTransaction={setNewTransaction}
                connection = {connection}
                handleAlerts={handleAlerts}
                updateGeneratorList={updateGeneratorList}
              />} />
            <Route path='/home' element={
              <Home
                setNewTransaction={setNewTransaction}
                connection = {connection}
                handleAlerts={handleAlerts}
                updateGeneratorList={updateGeneratorList}
              />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/admin' element={
              <AdminMinting
                loading={loading}
                setLoading={setLoading}
                updateGeneratorList={updateGeneratorList}
                updateProductList={updateProductList}
                sumProductBalances={sumProductBalances}
                handleAlerts={handleAlerts}
                copyToClipboard={copyToClipboard}
              />} />

          </Routes>
        </Card>
        <Snackbar
          TransitionComponent={Slide}
          onClick={handleCloseAlerts}
          autoHideDuration={6000}
          open={alerts[0]}
        >
          <Alert
            onClick={handleCloseAlerts}
            elevation={6}
            variant="filled"
            severity={alerts[2]}
            sx={{ width: '100%' }}
          >
            {alerts[1]}
            {alerts[3] ? (<CircularProgress size={20} color="inherit" />) : (<ins></ins>)}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseAlerts}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Alert>
        </Snackbar>
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
