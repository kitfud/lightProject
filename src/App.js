
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
      main: '#696969',
    },
    secondary: {
      main: '#EDEDED',
    }

  }
})


let themeDarkMode = createTheme({

  palette: {
    primary: {
      main: '#7B7B7B',
    },
    secondary: {
      main: '#353535',
    }

  }
})

function App() {
  const [userAddress, setUserAddress] = useState(undefined)
  const [wallet, setWallet] = useState(undefined)
  const [contract, setContract] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [colorMode, setColorMode] = useState("light")


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
            <Route path='/home' element={<Home wallet={wallet} contract={contract} />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/admin' element={<AdminMinting wallet={wallet} contract={contract} loading={loading} setLoading={setLoading} userAddress={userAddress} />} />
          </Routes>
        </Card>
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default App;
