import { getAllUsers } from "../services/login";
import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    setUsers(state, action) {
      return action.payload;
    },
  },
});

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await getAllUsers();
    dispatch(setUsers(users));
  };
};

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
