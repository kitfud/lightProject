import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialStateValue = {
    port: undefined,
    connected: false,
    sendDataStatus: undefined,
    sendDataProcess: "finished",
    receiveDataStatus: undefined,
    lastSentData: undefined,
    lastReceivedData: undefined
}

export const sendData = createAsyncThunk("connection/sendData", async (rgbColor, thunkAPI) => {
    const states = thunkAPI.getState()
    const port = states.connection.value.port
    if (port) {
        const event = ["paymentMade", rgbColor]
        const stringified = JSON.stringify(event);
        const encoder = new TextEncoder("utf-8");
        const writer = await port.writable.getWriter();
        await writer.write(encoder.encode(stringified + "\r\n"));
        // await writer.write(stringified + "\r\n");
        writer.releaseLock();
    }
})

export const connectionSlice = createSlice({
    name: "connection",
    initialState: { value: initialStateValue },
    reducers: {
        setPort: (state, action) => {
            const new_port = action.payload
            const new_connected = state.value.connected
            const new_sendDataStatus = state.value.sendDataStatus
            const new_sendDataProcess = state.value.sendDataProcess
            const new_receiveDataStatus = state.value.receiveDataStatus
            const new_lastSentData = state.value.lastSentData
            const new_lastReceivedData = state.value.lastReceivedData

            state.value = {
                port: new_port,
                connected: new_connected,
                sendDataStatus: new_sendDataStatus,
                sendDataProcess: new_sendDataProcess,
                receiveDataStatus: new_receiveDataStatus,
                lastSentData: new_lastSentData,
                lastReceivedData: new_lastReceivedData
            }
        },
        setConnected: (state, action) => {
            state.value.connected = action.payload
        },
        setSendDataProcess: (state, action) => {
            state.value.sendDataProcess = action.payload
        },
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

export const { setPort, setConnected, setSendDataProcess } = connectionSlice.actions

export default connectionSlice.reducer