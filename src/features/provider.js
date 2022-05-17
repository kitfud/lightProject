import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = undefined

export const providerSlice = createSlice({
    name: "provider",
    initialState: { value: initialStateValue },
    reducers: {
        setProvider: (state, action) => {
            state.value = action.payload
        }
    }
}
)

export const { setProvider } = providerSlice.actions

export default providerSlice.reducer