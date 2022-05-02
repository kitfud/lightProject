import { color } from '@mui/system'
import React, { useState, useEffect, useRef } from 'react'
import { SketchPicker } from 'react-color'

const LightPicker = () => {

  const [activeColor, setActiveColor] = useState({ activeColor: "#fff"})
  
  /*
  useRef is a hook that allows you to persist values between renders.
  It does not cause a re-render when updated.
  Can be used to access a DOM element directly.
  */
  const divRef = useRef(null)//Initializing divRef as an empty useRef hook. Not sure if necessary.

  //Shows "Page load." in the log every time the page loads.
  useEffect(() => {
    console.log("Page load.")
  },[])
  

  //If color's value changes, this function runs.
  const handleChangeComplete = (color) => {
    divRef.current = color//This allows for color's value to persist between re-renders without resetting. Not sure if necessary.

    console.log(color.rgb)//In console, shows rgb color values on click, using slider, and from clicking color boxes.
    /*
      Currently shows an issue where palette cursor is stuck in place, causing our rgb values to be tweaked based on palette selection positioning.
      Our current palette positioning cursor thing is not having it's new selections being updated. Stuck in bottom left corner on black.
      RGB color values from palette clicks are coming in as accurate, palette is not updating though.
    */

    setActiveColor({activeColor: color.hex.toUpperCase()})
    //You can also access the RGB or HSL values of the selected color via color.rgb or color.hsl

    console.log(activeColor)//activeColor is returning a proper and current hex value at this point.
    /*Needing to figure out why the color palette is static.   
      Also just noticed that activeColor's shown values in log are "1 click behind".
        ex:
          first click doesn't generate accurate hex value, but is standard #fff
          2nd click shows 1st click, 3rd click shows 2nd, etc etc.

      Possibility that console.log(activeColor) line of code operates before setActiveColor can set the color? 
    */
  }

  return (
    <>
    <div>LightPicker</div>

    {
    /* 
      Basically, we're saying the SketchPicker color is whatever the activeColor value is currently assigned to. 
      
      color = controls what color is active on color picker.
      onChange= Passes function every time color is changed. Can happen frequently due to drag events. We are not using onChange.
      onChangeComplete= Used if you just need to get the color once. "Pass a function to call once a color change is complete"
      */
    }
    <SketchPicker
      color={ activeColor }
      onChangeComplete={ handleChangeComplete }
    />
    </>
  )
}

export default LightPicker