import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = 0;

export const totalBalanceSlice = createSlice({
  name: 'totalBalance',
  initialState: { value: initialStateValue },
  reducers: {
    setTotalBalance: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setTotalBalance } = totalBalanceSlice.actions;

export default totalBalanceSlice.reducer;
