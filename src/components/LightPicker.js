import React from 'react'
import { SketchPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { setHexColor } from '../features/color';

const LightPicker = () => {

  const dispatch = useDispatch()
  const { HexColor } = useSelector(state => state.color.value)
  const { sendDataProcess } = useSelector(state => state.connection.value)

  const handleChangeComplete = (color) => {
    dispatch(setHexColor(color.hex))
  }

  return (
    <div className="p-4">
      <SketchPicker
        disabled={sendDataProcess === "finished" ? false : true}
        color={HexColor}
        onChangeComplete={(e) => handleChangeComplete(e)}
      />
      <div>
        {HexColor ? HexColor : "---"}
      </div>
    </div>
  )
}

export default LightPicker