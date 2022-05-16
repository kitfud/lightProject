import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = [false]

export const alertsSlice = createSlice({
    name: "alerts",
    initialState: { value: initialStateValue },
    reducers: {
        setAlerts: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setAlerts } = alertsSlice.actions

export default alertsSlice.reducer