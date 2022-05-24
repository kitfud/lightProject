import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = {
  socket: undefined,
  status: undefined,
  socketConnected: false,
};

export const webSocketSlice = createSlice({
  name: 'webSocket',
  initialState: { value: initialStateValue },
  reducers: {
    setWebSocket: (state, action) => {
      state.value.socket = action.payload;
    },
    setStatus: (state, action) => {
      state.value.status = action.payload;
    },
    setSocketConnected: (state, action) => {
      state.value.socketConnected = action.payload;
    },
  },
});

export const { setWebSocket, setStatus, setSocketConnected } = webSocketSlice.actions;

export default webSocketSlice.reducer;
