import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = undefined

export const generatorSlice = createSlice({
    name: "generator",
    initialState: { value: initialStateValue },
    reducers: {
        setGeneratorList: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setGeneratorList } = generatorSlice.actions

export default generatorSlice.reducer