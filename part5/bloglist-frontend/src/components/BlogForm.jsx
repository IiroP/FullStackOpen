import { useState } from "react";

const BlogForm = ({ createBlog, showMessage }) => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const newBlog = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
      };
      await createBlog(newBlog);
      setBlogTitle("");
      setBlogAuthor("");
      setBlogUrl("");
      showMessage(
        "success",
        `A new blog "${newBlog.title}" by ${newBlog.author} added`
      );
    } catch (exception) {
      console.error(exception);
      showMessage("error", "Blog creation failed, check the input");
    }
  };

  return (
    <div>
      <h3>Create new blog</h3>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={blogTitle}
              onChange={({ target }) => setBlogTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Author:
            <input
              type="text"
              name="author"
              value={blogAuthor}
              onChange={({ target }) => setBlogAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            URL:
            <input
              type="text"
              name="url"
              value={blogUrl}
              onChange={({ target }) => setBlogUrl(target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit">Create blog</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
