
import AdminMinting from './components/AdminMinting';
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom'
import Shop from './components/Shop';
import Header from './components/Header';
import Footer from './components/Footer';
import { createTheme, ThemeProvider, Card, Container, CardContent } from '@mui/material'
import { useEffect, useState } from "react";
import { getFactoryContract } from "./utils"
import { DEPLOYMENT_ADDRESS } from "./ABIs/deployment_address"

let theme = createTheme({
  palette: {
    primary: {
      main: '#696969',
    },
    secondary: {
      main: '#EAEAEA',
    }
  }
})



function App() {
  const [userAddress, setUserAddress] = useState(undefined)
  const [wallet, setWallet] = useState(undefined)
  const [contract, setContract] = useState(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const new_contract = getFactoryContract()
    setContract(new_contract)
  }, [])

  return (

    <>
      <ThemeProvider theme={theme}>
        <Header setUserAddress={setUserAddress} userAddress={userAddress} setWallet={setWallet} setContract={setContract} wallet={wallet} contract={contract} />
        <Card sx={{ height: '100vh', backgroundColor: '#EAEAEA' }}>
          <Routes>
            <Route path='/' element={<Home wallet={wallet} contract={contract} />} />
            <Route path='/home' element={<Home wallet={wallet} contract={contract}/>} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/admin' element={<AdminMinting wallet={wallet} contract={contract} loading={loading} setLoading={setLoading} />} />
          </Routes>
        </Card>
        <Footer />
      </ThemeProvider>
    </>

  );
}

export default App;
