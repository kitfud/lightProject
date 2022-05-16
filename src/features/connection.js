import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = undefined

export const connectionSlice = createSlice({
    name: "connection",
    initialState: { value: initialStateValue },
    reducers: {
        setConnection: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setConnection } = connectionSlice.actions

export default connectionSlice.reducer