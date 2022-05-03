
import AdminMinting from './components/AdminMinting';
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom'
import Shop from './components/Shop';
import Header from './components/Header';
import Footer from './components/Footer';
import { createTheme, ThemeProvider, Card, Container, CardContent } from '@mui/material'

import { createContext, useEffect, useState } from "react";
import LightFactory from './ABIs/LightFactory.json'
import LightGenerator from './ABIs/LightGenerator.json'
import { getWeb3, getFactoryContract } from "./utils"
import { DEPLOYMENT_ADDRESS } from "./ABIs/deployment_address"


export const ContractContext = createContext(undefined);

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

  const contract = getFactoryContract()

  useEffect(() => {
    // console.log(contract)
  }, [userAddress])

  return (

    <>
      <ContractContext.Provider value={contract}>
        <ThemeProvider theme={theme}>
          <Header setUserAddress={setUserAddress} userAddress={userAddress} setWallet={setWallet} />
          <Card sx={{ height: '100vh', backgroundColor: '#EAEAEA' }}>
            <Routes>
              <Route path='/' element={<Home wallet={wallet} />} />
              <Route path='/home' element={<Home wallet={wallet} />} />
              <Route path='/shop' element={<Shop />} />
              <Route path='/admin' element={<AdminMinting wallet={wallet} />} />
            </Routes>
          </Card>
          <Footer />
        </ThemeProvider>
      </ContractContext.Provider>
    </>

  );
}

export default App;
