import { useDispatch } from "react-redux";
import { removeBlog, likeBlog } from "../reducers/blogReducer";

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch();

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
      </div>
    </div>
  );
};

export default Blog;
