import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mediaUsers: [],
  message: {},
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketMediaUsers: (state, action) => {
      state.mediaUsers = action.payload;
    },
    setSocketMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { setSocketMediaUsers, setSocketMessage } = socketSlice.actions;
export default socketSlice.reducer;
