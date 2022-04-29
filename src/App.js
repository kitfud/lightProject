
import './App.css';
import AdminMinting from './components/AdminMinting';
import Home from './components/Home';
import {Routes, Route} from 'react-router-dom'
import Shop from './components/Shop';
import Header from './components/Header';
import Footer from './components/Footer';

import {createTheme, ThemeProvider, Card, Container, CardContent} from '@mui/material'


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



  return (

    <>
   
   <ThemeProvider theme={theme}>

   <Header/>
    <Card sx={{height:'100vh',backgroundColor:'#5357bf'}}>
    <Routes>
    <Route path='/' element ={<Home/>}/>
    <Route path='/home' element ={<Home/>}/>
    <Route path='/shop' element ={<Shop/>}/>
    <Route path ='/admin' element = {<AdminMinting/>}/>     
    </Routes>
    </Card>
    <Footer/>
    {console.log('Hello')}

   </ThemeProvider>



    </>

  );
}

export default App;
