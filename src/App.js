
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

export const ContractContext = createContext(undefined);
export const WalletContext = createContext();

let theme = createTheme({
  palette: {
    primary: {
      main: '#BFBB53',
    },
    secondary: {
      main: '#5357bf',
    }
  }
})



function App() {
  const [userAddress, setUserAddress] = useState(undefined)

  const contract = {
    address: LightFactory.address,
    abi_LightFactory: LightFactory.abi,
    abi_LightGenerator: LightGenerator.abi,
    userAddress: userAddress
  }

  useEffect(() => {
    console.log("User just changed")
  }, [userAddress])

  return (

    <>
      <ContractContext.Provider value={contract}>
        {/* <WalletContext.Provider value={ }></WalletContext.Provider> */}
        <ThemeProvider theme={theme}>
          <Header setUserAddress={setUserAddress} userAddress={userAddress} />
          <Card sx={{ height: '100vh', backgroundColor: '#5357bf' }}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/home' element={<Home />} />
              <Route path='/shop' element={<Shop />} />
              <Route path='/admin' element={<AdminMinting />} />
            </Routes>
          </Card>
          <Footer />
        </ThemeProvider>
      </ContractContext.Provider>




    </>

  );
}

export default App;
