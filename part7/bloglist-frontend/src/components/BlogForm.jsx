import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const BlogForm = () => {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogUrl, setBlogUrl] = useState("");
  const dispatch = useDispatch();

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    try {
      const newBlog = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
      };
      dispatch(createBlog(newBlog));
      setBlogTitle("");
      setBlogAuthor("");
      setBlogUrl("");
      dispatch(
        setNotification(
          "success",
          `A new blog "${newBlog.title}" by ${newBlog.author} added`
        )
      );
    } catch (exception) {
      console.error(exception);
      dispatch(
        setNotification("error", "Blog creation failed, check the input")
      );
    }
  };

  return (
    <Card className="p-3 mb-3" style={{ maxWidth: "400px" }}>
      <h3>Create new blog</h3>
      <Form onSubmit={handleCreateBlog}>
        <Form.Group className="mb-3">
          <Form.Label>Title:</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={blogTitle}
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Author:</Form.Label>
          <Form.Control
            type="text"
            name="author"
            value={blogAuthor}
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>URL:</Form.Label>
          <Form.Control
            type="text"
            name="url"
            value={blogUrl}
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Button type="submit">Create blog</Button>
        </Form.Group>
      </Form>
    </Card>
  );
};

export default BlogForm;
