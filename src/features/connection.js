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
            state.value.port = action.payload
        },
        setStatus: (state, action) => {
            state.value.status = action.payload
        }
    }
})

export const { setPort, setStatus } = connectionSlice.actions

export default connectionSlice.reducer