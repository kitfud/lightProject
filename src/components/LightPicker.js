import React, { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color';
import HardwareConnect from './HardwareConnect';

const LightPicker = () => {
  const [projectColor, setProjectColor] = useState("#FFFFFF");
  const [rgbData, setRGBData] = useState(null)

  const handleChangeComplete = (color) => {
    setProjectColor(color.hex)
    setRGBData(color.rgb)
  }

  const formatRGBVal = (color) => {
    let r = color.r
    let g = color.g
    let b = color.b

    console.log(`${r},${g},${b}`)
    setRGBData(color)
  }

useEffect(()=>{
if (rgbData){
formatRGBVal(rgbData)
}
  },[rgbData])

  return (
    <div className="p-4">
      <SketchPicker
        color={projectColor}
        onChangeComplete={(c) => handleChangeComplete(c)}
      />
      <div>
        {projectColor}
      </div>
      <Box><HardwareConnect/></Box>
    </div>
  )
}

export default LightPicker