import React, { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color';
import HardwareConnect from './HardwareConnect';

const LightPicker = ({setCurrentColorSelect}) => {
  const [projectColor, setProjectColor] = useState("#FFFFFF");
  const [rgbData, setRGBData] = useState(null)
  const [hardwareData, setHardwareData]= useState(null)

  const handleChangeComplete = (color) => {
    setProjectColor(color.hex)
    setCurrentColorSelect(color.hex)
    setRGBData(color.rgb)
  }

  const formatRGBVal = (color) => {
    let r = color.r
    let g = color.g
    let b = color.b

   let hardwareData = `${r},${g},${b}`
   setHardwareData(hardwareData)
 
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
    <HardwareConnect colorData={hardwareData}/>
    </div>
  )
}

export default LightPicker