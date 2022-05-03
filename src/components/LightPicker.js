import React, { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color';

const LightPicker = () => {
  const [projectColor, setProjectColor] = useState("#F9A8D4");

  const handleChangeComplete = (color) => {
    setProjectColor(JSON.stringify(color.rgb))
  }

  useEffect(() => {
    // console.log(projectColor)
  }, [projectColor])

  return (
    <div className="p-4">
      <SketchPicker
        colors={projectColor}
        color={projectColor}
        onChangeComplete={(c) => handleChangeComplete(c)}
      />
      <div>
        {projectColor}
      </div>
    </div>
  )
}

export default LightPicker