import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return "";
    },
  },
});

export const setNotification = (message) => {
  return async (dispatch) => {
    dispatch(notificationSlice.actions.setNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };
};

export const { clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
