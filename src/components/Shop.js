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
import img_led from '../img/led_strip200.jpg';
import img_raspberry from '../img/raspberry_pi_zero_200.jpg';
import { setPathname } from '../features/pathname';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';


const tiers = [
  {
    title: 'Arduino Uno',
    price: '24.10',
    description: [
      'a microcontroller board'
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
      'LED Strip - tunable white'
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
    image: img_raspberry,
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
              
             
                    <a target="_blank" href={tier.vendorURL}>
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
      </Container>
    </React.Fragment>

  );
  console.log(num)
}

export default function Pricing() {
  return <PricingContent />;
}
