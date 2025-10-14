import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeBlog, likeBlog } from "../reducers/blogReducer";

const Blog = ({ blog, user }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const handleLike = async () => {
    try {
      dispatch(likeBlog(blog.id));
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleRemove = async () => {
    if (
      window.confirm(
        `Are you sure you want to remove blog ${blog.title} by ${blog.author}?`
      )
    ) {
      try {
        dispatch(removeBlog(blog.id));
      } catch (error) {
        console.error("Failed to remove blog:", error);
      }
    }
  };

  return (
    <div style={{ padding: 5 }} className="blog">
      <span>{blog.title}</span> <span>{blog.author}</span>
      <button onClick={() => setOpen(!open)}>{open ? "Hide" : "View"}</button>
      {open && (
        <div>
          <span>{blog.url}</span>
          <br />
          <span>Likes: {blog.likes}</span>
          <button onClick={handleLike}>Like</button>
          <br />
          <span>Added by {blog.user.name}</span>
          {user && user.username === blog.user.username && (
            <>
              <br />
              <button onClick={handleRemove}>Remove</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
