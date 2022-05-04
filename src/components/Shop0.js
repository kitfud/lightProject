import React, { useState } from "react";
import { Card, Button, Typography, Box, Grid, CircularProgress } from '@mui/material'
import img_arduino from '../img/arduino-uno.jpg';



const Shop = () => {
  const [num, setNum] = useState(0);

  const changeNum = () => {
    let number = num;
    number++;
    setNum(number);
  };

  function myName() {
    return "Kit";
  }

  let user = myName();
  console.log(user);

  const MyAnimal = () => {
    return (
      <div>
        <Button sx={{ color: "pink" }} variant="contained">
          Animal Button
        </Button>
      </div>
    );
  };

  const MyDinner = () => {
    return <div>Apple Pie</div>;
  };

  1 === "1" ? console.log("true") : console.log("false");

  return (
    <>
    {/* <div>Hello World</div> */}
      <div>{`my number is ${num}`}</div>
      <button onClick={changeNum}>Change Num</button>
      {num % 2 === 0 ? <MyAnimal /> : <MyDinner />}


      <Grid sx={{ alignItems: "left", display: "flex", flexDirection: "column", marginTop: 3 }}>
        <Card style={{ display: "flex", justifyContent: 'left', raised: true }}>
          <img src={require('../img/arduino-uno.jpg')} />
        </Card>
        <Box style={{ display: "flex", justifyContent: 'center' }}>
          <Card sx={{ alignItems: "center", display: "flex", flexDirection: "column", marginTop: 1, padding: 3 }}>
            <Typography gutterBottom variant="h5" component="div">
              NFT Minting
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mint your NFT here!
            </Typography>

            <Box mr={2} ml={2}>

            </Box>
          </Card>
        </Box>
      </Grid>



      // <div><img src={img_arduino} alt="this is car image" /></div>
    </>
  );
};

export default Shop;
