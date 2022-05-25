import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = undefined;

export const pathnameSlice = createSlice({
  name: 'pathname',
  initialState: { value: initialStateValue },
  reducers: {
    setPathname: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setPathname } = pathnameSlice.actions;

export default pathnameSlice.reducer;
