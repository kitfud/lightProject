import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SketchPicker } from 'react-color';
import { setRGBColor } from '../features/rgbColor';

const LightPicker = ({
  setCurrentColorSelectRGB,
  currentColorSelectRGB,
  currentColorSelectHex,
  setCurrentColorSelectHex,
}) => {

  const dispatch = useDispatch()

  const handleChangeComplete = (color) => {
    setCurrentColorSelectHex(color.hex)
    setCurrentColorSelectRGB(color.rgb)
  }

  const formatRGBVal = (color) => {

    const r = color.r
    const g = color.g
    const b = color.b

    const rgb_string = `${r},${g},${b}`
    dispatch(setRGBColor(rgb_string))
  }

  useEffect(() => {
    if (currentColorSelectRGB) {
      formatRGBVal(currentColorSelectRGB)
    }
  }, [currentColorSelectRGB])

  return (
    <div className="p-4">
      <SketchPicker
        color={currentColorSelectHex}
        onChangeComplete={(e) => handleChangeComplete(e)}
      />
      <div>
        {currentColorSelectHex}
      </div>
    </div>
  )
}

export default LightPicker