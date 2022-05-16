import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = undefined

export const userAddressSlice = createSlice({
    name: "userAddress",
    initialState: { value: initialStateValue },
    reducers: {
        setUserAddress: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setUserAddress } = userAddressSlice.actions

export default userAddressSlice.reducer