import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload);
    },
    setBlogs(state, action) {
      return action.payload;
    },
    likeBlogLocal(state, action) {
      const id = action.payload;
      const blog = state.find((n) => n.id === id);
      const updated = {
        ...blog,
        likes: blog.likes + 1,
      };
      return state.map((a) => (a.id !== id ? a : updated));
    },
    removeBlogLocal(state, action) {
      const id = action.payload;
      return state.filter((blog) => blog.id !== id);
    },
  },
});

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(blog);
    dispatch(appendBlog(newBlog));
  };
};

export const likeBlog = (id) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.like(id);
    dispatch(likeBlogLocal(updatedBlog.id));
  };
};

export const removeBlog = (id) => {
  return async (dispatch) => {
    await blogService.remove(id);
    dispatch(removeBlogLocal(id));
  };
};

export const { appendBlog, setBlogs, likeBlogLocal, removeBlogLocal } =
  blogSlice.actions;
export default blogSlice.reducer;
