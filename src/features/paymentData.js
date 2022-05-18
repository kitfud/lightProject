import { createSlice } from "@reduxjs/toolkit"

const initialStateValue = {
    previousTxHash: undefined,
    currentTxHash: undefined
}

export const paymentDataSlice = createSlice({
    name: "paymentData",
    initialState: { value: initialStateValue },
    reducers: {
        setPreviousTxHash: (state, action) => {
            state.value.previousTxHash = action.payload
        },
        setCurrentTxHash: (state, action) => {
            state.value.currentTxHash = action.payload
        }
    }
})

export const { setPreviousTxHash, setCurrentTxHash } = paymentDataSlice.actions

export default paymentDataSlice.reducer