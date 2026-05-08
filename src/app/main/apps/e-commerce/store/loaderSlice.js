import { createSlice } from '@reduxjs/toolkit';

const loaderSlice = createSlice({
  name: 'loader',
  initialState: '',
  reducers: {
    updateloader(state, action) {
      return action.payload;
    },
  },
});

export const { updateloader } = loaderSlice.actions;
export default loaderSlice.reducer;
