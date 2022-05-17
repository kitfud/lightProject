import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = {
    port: undefined,
    status: false
}

export const connectionSlice = createSlice({
    name: "connection",
    initialState: { value: initialStateValue },
    reducers: {
        setPort: (state, action) => {
            state.port.value = action.payload
        },
        setStatus: (state, action) => {
            state.status.value = action.payload
        }
    }
})

export const { setPort, setStatus } = connectionSlice.actions

export default connectionSlice.reducer