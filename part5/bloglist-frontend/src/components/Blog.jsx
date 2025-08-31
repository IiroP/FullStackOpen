import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, user, updateBlogs }) => {
  const [open, setOpen] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const handleLike = async () => {
    try {
      await blogService.like(blog.id);
      setLikes(likes + 1);
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
        await blogService.remove(blog.id);
        updateBlogs();
      } catch (error) {
        console.error("Failed to remove blog:", error);
      }
    }
  };

  return (
    <div style={{ padding: 5 }}>
      {blog.title} {blog.author}
      <button onClick={() => setOpen(!open)}>{open ? "Hide" : "View"}</button>
      {open && (
        <div>
          <span>{blog.url}</span>
          <br />
          <span>
            Likes: {likes} <button onClick={handleLike}>Like</button>
          </span>
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
