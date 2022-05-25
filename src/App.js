
import { useDispatch, useSelector } from 'react-redux'
import AdminMinting from './components/AdminMinting'
import Home from './components/Home'
import { Routes, Route } from 'react-router-dom'
import Shop from './components/Shop'
import Header from './components/Header'
import Footer from './components/Footer'
import Transfer from './components/Transfer'
import { createTheme, ThemeProvider, Card, Snackbar, Slide, Alert, IconButton, CircularProgress } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect, useRef, useState } from "react"
import { getFactoryContract, getGeneratorContract, getProductContract } from "./utils"
import { setFactoryContract } from './features/factoryContract'
import { setGeneratorList } from "./features/generator"
import { setProductList } from './features/product'
import { setUserAddress } from './features/userAddress'
import { setAlerts } from './features/alerts'
import { setWebSocket, setStatus, setSocketConnected } from './features/webSocket'
import { ethers } from "ethers"
import { LandingPage } from './components/LandingPage'
import { io } from "socket.io-client"

const new_socket = io("/websocket", { forceNew: true })

let themeLightMode = createTheme({

  palette: {
    primary: {
      main: '#C0C0C0',
    },
    secondary: {
      main: '#FFFFFF',
    },
    neutral: {
      main: '#',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
      fontFamily: "Nunito",
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
    neutral: {
      main: '#',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      fontFamily: "Nunito",
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
  const provider = useSelector((state) => state.provider.value)
  const { status, socketConnected } = useSelector((state) => state.webSocket.value)
  const wrongNetwork = useSelector((state) => state.network.value.wrongNetwork)
  const refAddress = useSelector(state => state.refAddress.value)

  const providerRef = useRef()
  providerRef.current = provider

  const [loading, setLoading] = useState(false)
  const [colorMode, setColorMode] = useState("dark")
  const [sumProductBalances, setSumProductBalances] = useState(undefined)

  const handleAlerts = (msg, severity, loading = false) => {
    dispatch(setAlerts([true, msg, severity, loading]))
  }

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
    if ((wallet && userAddress) || (refAddress && providerRef.current) && !wrongNetwork) {
      handleAlerts("Fetching NFTs owned by address...", "info", true)
      let use_address
      if (refAddress) {
        use_address = refAddress
      } else {
        use_address = userAddress
      }

      let isOwner = false
      const tokensOwned = await factoryContract.addressToTokenID(use_address)

      if (tokensOwned.includes(true)) {
        isOwner = true
      }

      if (isOwner) {
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

        if (Object.keys(generatorsObj).length > 0) {
          dispatch(setGeneratorList(generatorsObj))
          handleAlerts("NFTs owned by address collected!", "info")
        } else {
          dispatch(setGeneratorList(undefined))
          handleAlerts("No NFTs owned by this address.", "info")
        }
      } else {
        dispatch(setGeneratorList(undefined))
        handleAlerts("No NFTs owned by this address.", "info")
      }
    } else {
      dispatch(setGeneratorList(undefined))
    }
  }

  const updateProductList = async () => {
    if (generatorList && (wallet || providerRef.current)) {
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

          let product_contract
          let product_balance_BN
          if (wallet) {
            product_contract = getProductContract(product.contractAddress, wallet.signer)
            product_balance_BN = await wallet.provider.getBalance(product.contractAddress)
          } else if (providerRef.current) {
            product_contract = getProductContract(product.contractAddress)
            product_balance_BN = await providerRef.current.getBalance(product.contractAddress)
          }
          const product_balance = parseFloat(ethers.utils.formatEther(product_balance_BN))

          objOfProducts_fromGenerator[product_id] = {
            name: product.name,
            priceUSD: parseFloat(ethers.utils.formatEther(product.priceUSD)).toFixed(2),
            address: product.contractAddress,
            selected: false,
            balance: product_balance,
            contract: product_contract

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

  // SocketIO listeners
  useEffect(() => {
    const new_contract = getFactoryContract()
    dispatch(setFactoryContract(new_contract))

    dispatch(setWebSocket(new_socket))
    new_socket.on("connect", () => {
      dispatch(setSocketConnected(true))
    })

    new_socket.on('disconnect', () => {
      dispatch(setSocketConnected(false))
    })

    return () => {
      new_socket.off("connect")
      new_socket.off("disconnect")
    }
  }, [])

  useEffect(() => {
    if (status === "finished") {
      dispatch(setStatus(undefined))
    }
  }, [status])

  useEffect(() => {
    if (!socketConnected) {
      handleAlerts("Connecting server...", "info", true)
    } else {
      handleAlerts("Server connected!", "success")
    }
  }, [socketConnected])

  useEffect(() => {
    if (alerts[0]) {
      if (!alerts[3]) {
        setTimeout(handleCloseAlerts, 3000)
      }
    }
  }, [alerts])

  useEffect(() => {
    if ((wallet || provider) && !wrongNetwork) {
      if (wallet) {
        updateGeneratorList()
      } else if (provider) {
        updateGeneratorList(refAddress)
      }
      // handleAlerts("Data from address collected!", "info")
    }

  }, [wrongNetwork])

  return (
    <>
      <ThemeProvider theme={colorMode === "dark" ? themeDarkMode : themeLightMode}>
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
            <Route path="/transfer" element={
              <Transfer />
            } />
            <Route path='/' element={
              <LandingPage />} />
            <Route path='/home' element={
              <Home
                handleAlerts={handleAlerts}
                updateGeneratorList={updateGeneratorList}
                updateProductList={updateProductList}
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
                colorMode={colorMode}
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
