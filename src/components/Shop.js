import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';

import img_arduino from '../img/arduino_uno_200.jpg';
import img_wires from '../img/JumperWires.jpg';
import img_led from '../img/led_strip200.jpg';
import circuit_diagram from '../img/CryptoLightsCircuit.png'

import { setPathname } from '../features/pathname';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';


const tiers = [
  {
    title: 'Arduino Uno',
    price: '24.10',
    description: [
      'A microcontroller board'
    ],
    image: img_arduino,
    buttonText: 'Buy now',
    buttonVariant: 'contained',
    vendorURL: 'https://amzn.to/3LsZVzI'
  },
  {
    title: 'Led Strip',
    price: '11',
    description: [
      'LED Strip - Tunable White'
    ],
    image: img_led,
    buttonText: 'Buy now',
    buttonVariant: 'contained',
    vendorURL: 'https://amzn.to/3wzXbLm'
  },
  {
    title: 'Jumper Wires',
    price: '5',
    description: [
      'Wire your LED lights to Arduino'
    ],
    image: img_wires,
    buttonText: 'Buy now',
    buttonVariant: 'contained',
    vendorURL: 'https://amzn.to/3aaveSW'
  },
];

function PricingContent() {

  const dispatch = useDispatch()
  const [num, setNum] = useState(0);

  const changeNum = () => {
    let number = num;
    number++;
    setNum(number);
    console.log(num)
    console.log('Soon this will get you to the store...')
  };

  useEffect(() => {
    dispatch(setPathname(window.location.pathname))
    window.scrollTo(0, 0)
  }, [])

  return (
    <React.Fragment>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      {/* Hero unit */}
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 4, pb: 5 }}>
        <Typography
          component="h1"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontFamily: "Nunito" }}
        >
          Build your setup
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" component="p">
          Quickly build an effective setup for your Light Generator.
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === 'Led Strip' ? 12 : 10}
              md={4}
            >
              <Card sx={{ bgcolor: "primary.main" }}>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[500],
                  }}
                />
                <CardContent>
               
                  <img src={tier.image} />
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
              
             
                    <a target="_blank" href={tier.vendorURL} style={{ textDecoration: "none" }}>
                    <Button color="success" fullWidth variant={tier.buttonVariant} >
                    {tier.buttonText}
                  </Button>
                    </a>
                
             
               
                
             
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Footer */}
      <Container
        maxWidth="md"
        component="footer"
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          mt: 8,
          py: [3, 6],
        }}
      >
        <Grid container spacing={4} justifyContent="space-evenly">
        </Grid>

        <Typography
          component="h1"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontFamily: "Nunito" }}
        >
         Wire the Components: 
        </Typography>
        
       
      </Container>
      <center>
        <Box>
        <img src={circuit_diagram} />
        </Box>
      </center>
    
      <Typography
          marginTop={3}
          component="h1"
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontFamily: "Nunito" }}
        >
        Code The Arduino: 
        </Typography>
        <Grid sx={{alignItems:"center",display:'flex', flexDirection:'column'}}>
        <Box align="center">
        <pre>
        <code>{
        `
        #include <List.hpp>
        #include <Adafruit_NeoPixel.h>
        #include <SimpleWebSerial.h>
        SimpleWebSerial WebSerial;
        
        #ifdef __AVR__
         #include <avr/power.h> // Required for 16 MHz Adafruit Trinket
        #endif
        
        #define LED_PIN    6
        
        #define LED_COUNT 100
        
        // Declare our NeoPixel strip object:
        Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);
        
        String color;
        String lastColor;
        String colorData[3];
        
        void setup() {
        WebSerial.on("paymentMade", handlePayment);
        #if defined(__AVR_ATtiny85__) && (F_CPU == 16000000)
          clock_prescale_set(clock_div_1);
        #endif
          // END of Trinket-specific code.
         Serial.begin(57600);
          strip.begin();           // INITIALIZE NeoPixel strip object (REQUIRED)
          strip.show();            // Turn OFF all pixels ASAP
          strip.setBrightness(50); // Set BRIGHTNESS to about 1/5 (max = 255)  
        }
        
        void handlePayment(JSONVar data) {
         color = data;
        }
        
        void processColor(){
            int commaCount = 0;
            String StringRed;
            String StringGreen;
            String StringBlue;
          for (int i = 0; i <= color.length(); i++) {
          
            if(color[i]==','){
              commaCount++;
              continue;
            }
        
            if(commaCount ==0){
             StringRed += color[i];
            }
            if (commaCount ==1){
             StringGreen +=color[i];    
            }
            if (commaCount ==2){
             StringBlue +=color[i];
            }
          }
        
          int red = StringRed.toInt();
          int green = StringGreen.toInt();
          int blue = StringBlue.toInt();
        
          colorWipe(strip.Color(red,   green,   blue)); 
        
          Serial.print(red);
          Serial.print(green);
          Serial.println(blue);
        }
        
        void loop() {
        WebSerial.check();
        Serial.println(color);
        delay(10);
        while (color != lastColor){
          lastColor = color;
          processColor();
        }
        
        }
        void colorWipe(uint32_t color) {
          for(int i=0; i<strip.numPixels(); i++) { // For each pixel in strip...
            strip.setPixelColor(i, color);         //  Set pixel's color (in RAM)
            strip.show();                          //  Update strip to match
        
          }
        }`
        }
        </code>
        </pre>
        </Box>
       </Grid>
    </React.Fragment>

  );

}

export default function Pricing() {
  return <PricingContent />;
}
