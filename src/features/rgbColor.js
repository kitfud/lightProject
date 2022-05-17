import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = undefined

export const rgbColorSlice = createSlice({
    name: "rgbColor",
    initialState: { value: initialStateValue },
    reducers: {
        setRGBColor: (state, action) => {
            state.value = action.payload
        }
    }
}
)

export const { setRGBColor } = rgbColorSlice.actions

export default rgbColorSlice.reducer