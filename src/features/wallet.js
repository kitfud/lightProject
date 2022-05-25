import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = undefined;

export const walletSlice = createSlice({
  name: 'wallet',
  initialState: { value: initialStateValue },
  reducers: {
    setWallet: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setWallet } = walletSlice.actions;

export default walletSlice.reducer;
