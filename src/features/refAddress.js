import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = undefined

export const refAddressSlice = createSlice({
    name: "refAddress",
    initialState: { value: initialStateValue },
    reducers: {
        setRefAddress: (state, action) => {
            state.value = action.payload
        }
    }
}
)

export const { setRefAddress } = refAddressSlice.actions

export default refAddressSlice.reducer