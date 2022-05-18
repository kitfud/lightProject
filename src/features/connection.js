import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialStateValue = {
    port: undefined,
    connected: false,
    sendDataStatus: undefined,
    receiveDataStatus: undefined,
    lastSentData: undefined,
    lastReceivedData: undefined
}

export const sendData = createAsyncThunk("connection/sendData", async (rgbColor, thunkAPI) => {
    const states = thunkAPI.getState()
    const port = states.connection.value.port
    if (port) {
        const encoder = new TextEncoder();
        const writer = await port.writable.getWriter();
        await writer.write(encoder.encode(rgbColor));
        writer.releaseLock();
    }
})

export const connectionSlice = createSlice({
    name: "connection",
    initialState: { value: initialStateValue },
    reducers: {
        setPort: (state, action) => {
            state.value.port = action.payload
        },
        setConnected: (state, action) => {
            state.value.connected = action.payload
        }
    },
    extraReducers: {
        [sendData.pending]: (state, action) => {
            state.value.sendDataStatus = 'pending'
        },
        [sendData.fulfilled]: (state, action) => {
            state.value.sendDataStatus = 'success'
            state.value.lastSentData = action.payload
        },
        [sendData.rejected]: (state, action) => {
            state.value.sendDataStatus = 'failed'
        }
    }
})

export const { setPort, setConnected } = connectionSlice.actions

export default connectionSlice.reducer