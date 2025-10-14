import { useDispatch } from "react-redux";
import { useState } from "react";
import { removeBlog, likeBlog, commentBlog } from "../reducers/blogReducer";

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  if (!blog) {
    return null;
  }

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

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    dispatch(commentBlog(blog.id, comment));
    setComment("");
  };

  return (
    <div style={{ padding: 5 }} className="blog">
      <h2>
        {blog.title} by {blog.author}
      </h2>
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
        <h3>Comments</h3>
        <form onSubmit={handleCommentSubmit}>
          <input
            type="text"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <button type="submit">Add Comment</button>
        </form>
        <ul>
          {blog.comments?.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Blog;
