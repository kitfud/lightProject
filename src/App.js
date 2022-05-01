
import AdminMinting from './components/AdminMinting';
import Home from './components/Home';
import { Routes, Route } from 'react-router-dom'
import Shop from './components/Shop';
import Header from './components/Header';
import Footer from './components/Footer';

import { createTheme, ThemeProvider, Card, Container, CardContent } from '@mui/material'


let theme = createTheme({
  palette: {
    primary: {
      main: '#6b6b6b',
    },
    secondary: {
      main: '#EAEAEA',
    }
  }
})



function App() {



  return (

    <>
    <ThemeProvider theme={theme}>
   <Header/>
    <Card sx={{height:'100vh',backgroundColor:'#EAEAEA'}}>
    <Routes>
    <Route path='/' element ={<Home/>}/>
    <Route path='/home' element ={<Home/>}/>
    <Route path='/shop' element ={<Shop/>}/>
    <Route path ='/admin' element = {<AdminMinting/>}/>     
    </Routes>
    </Card>
    <Footer/>


      </ThemeProvider>



    </>

  );
}

export default App;
