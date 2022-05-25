import { createSlice } from '@reduxjs/toolkit';

const initialStateValue = {
  HexColor: undefined,
  RGBColorString: undefined,
  HexBulbColor: undefined,
};

export const colorSlice = createSlice({
  name: 'color',
  initialState: { value: initialStateValue },
  reducers: {
    setRGBColorString: (state, action) => {
      if (action.payload) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(action.payload);
        const rgb_color = result
          ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
          : null;

        const r = rgb_color.r;
        const g = rgb_color.g;
        const b = rgb_color.b;

        const rgb_string = `${r},${g},${b}`;

        const hex_color = state.value.RGBColorString;
        const rgb_color_string = rgb_string;
        const hex_bulb_color = state.value.HexBulbColor;
        const new_sate = {
          HexColor: hex_color,
          RGBColorString: rgb_color_string,
          HexBulbColor: hex_bulb_color,
        };
        state.value = { ...new_sate };
      } else {
        const hex_color = state.value.RGBColorString;
        const rgb_color_string = action.payload;
        const hex_bulb_color = state.value.HexBulbColor;
        const new_sate = {
          HexColor: hex_color,
          RGBColorString: rgb_color_string,
          HexBulbColor: hex_bulb_color,
        };
        state.value = { ...new_sate };
      }
    },
    setHexColor: (state, action) => {
      const hex_color = action.payload;
      const rgb_color_string = state.value.RGBColorString;
      const hex_bulb_color = state.value.HexBulbColor;
      const new_sate = {
        HexColor: hex_color,
        RGBColorString: rgb_color_string,
        HexBulbColor: hex_bulb_color,
      };
      state.value = { ...new_sate };
    },
    setHexBulbColor: (state, action) => {
      const hex_color = state.value.RGBColorString;
      const rgb_color_string = state.value.RGBColorString;
      const hex_bulb_color = action.payload;
      const new_sate = {
        HexColor: hex_color,
        RGBColorString: rgb_color_string,
        HexBulbColor: hex_bulb_color,
      };
      state.value = { ...new_sate };
    },
  },
});

export const { setHexColor, setRGBColorString, setHexBulbColor } = colorSlice.actions;

export default colorSlice.reducer;
