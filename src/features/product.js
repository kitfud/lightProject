import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = undefined;

export const productSlice = createSlice({
  name: 'product',
  initialState: { value: initialStateValue },
  reducers: {
    setProductList: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setProductList } = productSlice.actions;

export default productSlice.reducer;
