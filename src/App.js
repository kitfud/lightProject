
import AdminMinting from './components/AdminMinting';
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom'
import Shop from './components/Shop';
import Header from './components/Header';
import Footer from './components/Footer';
import { createTheme, ThemeProvider, Card, Container, CardContent } from '@mui/material'
import { createContext } from "react";
import LightFactory from './ABIs/abi_LightFactory.json'
import LightGenerator from './ABIs/abi_LightGenerator.json'

export const ContractContext = createContext();

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

  const contract = {
    address: '0x89A86DDF445e04944a3B66Af6456B8979A584b74',
    abi_LightFactory: LightFactory,
    abi_LightGenerator: LightGenerator
  }

  return (

    <>
      <ContractContext.Provider value={contract}>
        <ThemeProvider theme={theme}>
          <Header />
          <Card sx={{ height: '100vh', backgroundColor: '#EAEAEA' }}>
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
