
import AdminMinting from './components/AdminMinting';
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom'
import Shop from './components/Shop';
import Header from './components/Header';
import Footer from './components/Footer';
import { createTheme, ThemeProvider, Card } from '@mui/material'
import { useEffect, useState } from "react";
import { getFactoryContract } from "./utils"

let themeLightMode = createTheme({

  palette: {
    primary: {
      main: '#9A9A9A',
    },
    secondary: {
      main: '#FFFFFF',
    },
    text: {
      primary: '#000000',
      secondary: '#4C4C4C',
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
      primary: '#9A9A9A',
      secondary: '#000000',
    }
  }
})

function App() {
  const [userAddress, setUserAddress] = useState(undefined)
  const [wallet, setWallet] = useState(undefined)
  const [contract, setContract] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [colorMode, setColorMode] = useState("light")
  const [selectGeneratorAddress, setSelectGeneratorAddress] = useState(undefined)
  const [selectedProduct, setSelectedProduct] = useState("clowny")
  const [selectProductPrice, setSelectProductPrice] = useState(undefined)




  useEffect(() => {
    console.log("In app js component " + selectProductPrice )
    
  }, [selectProductPrice])

  useEffect(() => {
    const new_contract = getFactoryContract()
    setContract(new_contract)
  }, [])


  return (
    <>
      <ThemeProvider theme={colorMode === "light" ? themeLightMode : themeDarkMode}>

        <Header
          setColorMode={setColorMode}
          setUserAddress={setUserAddress}
          userAddress={userAddress}
          setWallet={setWallet}
          setContract={setContract}
          wallet={wallet}
          contract={contract} />

        <Card sx={{ height: '110vh', bgcolor: "secondary.main" }}>
          <Routes>
            <Route path='/' element={<Home wallet={wallet} contract={contract} />} />
            <Route path='/home' element={
              <Home
                wallet={wallet}
                contract={contract}
                selectGeneratorAddress={selectGeneratorAddress}
                selectedProduct={selectedProduct}
                selectProductPrice={selectProductPrice}
              />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/admin' element={
              <AdminMinting
                wallet={wallet}
                contract={contract}
                loading={loading}
                setLoading={setLoading}
                userAddress={userAddress}
                setSelectGeneratorAddress={setSelectGeneratorAddress}
                setSelectedProduct={setSelectedProduct}
                setSelectProductPrice={setSelectProductPrice}
            
            />} />
          </Routes>
        </Card>
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
