import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = {
    HexColor: undefined,
    RGBColorString: undefined,
    HexBulbColor: undefined
}

export const colorSlice = createSlice({
    name: "color",
    initialState: { value: initialStateValue },
    reducers: {
        setRGBColorString: (state, action) => {
            if (action.payload) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(action.payload)
                const rgb_color = result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null

                const r = rgb_color.r
                const g = rgb_color.g
                const b = rgb_color.b

                const rgb_string = `${r},${g},${b}`
                state.value.RGBColorString = rgb_string
            } else {
                state.value.RGBColorString = action.payload
            }
        },
        setHexColor: (state, action) => {
            state.value.HexColor = action.payload
        },
        setHexBulbColor: (state, action) => {
            state.value.HexBulbColor = action.payload
        },
    }
}
)

export const { setHexColor, setRGBColorString, setHexBulbColor } = colorSlice.actions

export default colorSlice.reducer