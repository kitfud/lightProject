import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = undefined

export const factoryContractSlice = createSlice({
    name: "factoryContract",
    initialState: { value: initialStateValue },
    reducers: {
        setFactoryContract: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { setFactoryContract } = factoryContractSlice.actions

export default factoryContractSlice.reducer