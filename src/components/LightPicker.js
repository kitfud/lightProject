import React, { useEffect, useRef, useState } from 'react'
import { SketchPicker } from 'react-color';
import HardwareConnect from './HardwareConnect';
import { ethers } from 'ethers'
import { getProductContract } from '../utils';

const LightPicker = ({
  paymentData,
  setData,
  setCurrentColorSelectRGB,
  currentColorSelectRGB,
  currentColorSelectHex,
  setCurrentColorSelectHex,
  productSelectedAddress,

}) => {

  const [hardwareData, setHardwareData] = useState(null)

  const handleChangeComplete = (color) => {
    setCurrentColorSelectHex(color.hex)
    setCurrentColorSelectRGB(color.rgb)
  }



  useEffect(() => {
    if (currentColorSelectRGB !== '0,0,0') {
      formatRGBVal(currentColorSelectRGB)
      console.log(currentColorSelectHex)
    }
    // setRGBData(currentColorSelect.rgb.r)
  }, [currentColorSelectRGB])


  useEffect(() => {
    if (currentColorSelectHex) {
    }
  }, [currentColorSelectHex])

  const formatRGBVal = (color) => {

    let r = color.r
    let g = color.g
    let b = color.b

    let hardwareData = `${r},${g},${b}`
    setHardwareData(hardwareData)

  }

  return (
    <div className="p-4">
      <SketchPicker
        color={currentColorSelectHex}
        onChangeComplete={(e) => handleChangeComplete(e)}
      />
      <div>
        {currentColorSelectHex}
      </div>
      <HardwareConnect colorData={hardwareData} />
    </div>
  )
}

export default LightPicker