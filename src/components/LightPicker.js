import React,{useEffect, useState} from 'react'
import { SketchPicker } from 'react-color';

const LightPicker = () => {
  const [projectColor, setProjectColor] = useState("#FFFFFF");

  const handleChangeComplete = (color) =>{
    setProjectColor(color.hex)
  }

  useEffect(()=>{
  console.log(JSON.stringify(projectColor))
  },[projectColor])

return (
  <div className="p-4">
    <SketchPicker
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