import React from 'react'
import ModeSwitcher from './ModeSwitcher'

/*
  Couldn't figure out how to change the website colors based on light and dark mode. The only colors that change atm are the side bar, and LightPicker box colors.
*/

const DarkAndLightMode = ({ setColorMode }) => {



  return (
    <>
      <ModeSwitcher setColorMode={setColorMode} />
    </>


  )
}

export default DarkAndLightMode