import { createSlice } from '@reduxjs/toolkit';
import { CHAIN_ID } from '../ABIs/deployment_address';

const initialStateValue = {
  chainId: CHAIN_ID,
  wrongNetwork: false,
};

export const networkSlice = createSlice({
  name: 'network',
  initialState: { value: initialStateValue },
  reducers: {
    setNetwork: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setNetwork } = networkSlice.actions;

export default networkSlice.reducer;
