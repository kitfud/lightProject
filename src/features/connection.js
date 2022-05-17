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
<<<<<<< HEAD
            state.value.port = action.payload
=======
            console.log("ACTION:", action)
            state.port.value = action.payload
>>>>>>> 8dc7f65 (hardware lights kind of working, connect listner in app.js with triggering send function in home.js)
        },
        setStatus: (state, action) => {
            state.value.status = action.payload
        }
    }
})

export const { setPort, setStatus } = connectionSlice.actions

export default connectionSlice.reducer