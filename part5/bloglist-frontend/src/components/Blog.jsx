import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog }) => {
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
        </div>
      )}
    </div>
  );
};

export default Blog;
