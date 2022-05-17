import React from 'react'
import { SketchPicker } from 'react-color';

const LightPicker = ({
  currentColorSelectHex,
  setCurrentColorSelectHex,
  setCurrentColorSelectRGB
}) => {

  const handleChangeComplete = (color) => {
    setCurrentColorSelectHex(color.hex)
    const rgb_string = formatRGBVal(color.rgb)
    setCurrentColorSelectRGB(rgb_string)
  }

  const formatRGBVal = (color) => {

    const r = color.r
    const g = color.g
    const b = color.b

    const rgb_string = `${r},${g},${b}`
    return rgb_string
  }

  return (
    <div className="p-4">
      <SketchPicker
        color={currentColorSelectHex}
        onChangeComplete={(e) => handleChangeComplete(e)}
      />
      <div>
        {currentColorSelectHex ? currentColorSelectHex : "---"}
      </div>
    </div>
  )
}

export default LightPicker