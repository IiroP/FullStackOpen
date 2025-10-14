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

export const setNotification = (type, content, timeout = 5) => {
  return async (dispatch) => {
    dispatch(notificationSlice.actions.setNotification({ type, content }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, timeout * 1000);
  };
};

export const { clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
