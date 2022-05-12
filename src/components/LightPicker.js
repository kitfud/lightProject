import React, { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color';
import HardwareConnect from './HardwareConnect';

const LightPicker = ({ currentColorSelect, setCurrentColorSelect }) => {
  const [rgbData, setRGBData] = useState(null)
  const [hardwareData, setHardwareData]= useState(null)

  const handleChangeComplete = (color) => {
    console.log("Testing onChangeComplete")
    setCurrentColorSelect(color.hex)
    setRGBData(color.rgb)
    console.log("Testing bottom onChangeComplete")
  }

  const formatRGBVal = (color) => {
    let r = color.r
    let g = color.g
    let b = color.b

   let hardwareData = `${r},${g},${b}`
   setHardwareData(hardwareData)
 
  }


useEffect(()=>{
if (rgbData !== null){
console.log("In use effect rgbData")
formatRGBVal(rgbData)
}
  },[rgbData])

  return (
    <div className="p-4">
      <SketchPicker
        color={currentColorSelect}
        onChangeComplete={(c) => handleChangeComplete(c)}
      />
      <div>
        {currentColorSelect}
      </div>
    <HardwareConnect colorData={hardwareData}/>
    </div>
  )
}

export default LightPicker