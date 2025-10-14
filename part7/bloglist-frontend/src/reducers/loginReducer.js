import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import loginService from "../services/login";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const login = ({ username, password }) => {
  return async (dispatch) => {
    const user = await loginService.login({ username, password });
    window.localStorage.setItem("loggedInUser", JSON.stringify(user));
    blogService.setToken(user.token);
    dispatch(userSlice.actions.setUser(user));
  };
};

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.removeItem("loggedInUser");
    blogService.setToken(null);
    dispatch(userSlice.actions.clearUser());
  };
};

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
