import { useDispatch } from "react-redux";
import { useState } from "react";
import { removeBlog, likeBlog, commentBlog } from "../reducers/blogReducer";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

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
        <Button onClick={handleLike} className="m-2">
          Like
        </Button>
        <br />
        <span>Added by {blog.user.name}</span>
        {user && user.username === blog.user.username && (
          <>
            <br />
            <Button onClick={handleRemove}>Remove</Button>
          </>
        )}
        <h3>Comments</h3>
        <Form onSubmit={handleCommentSubmit}>
          <Row>
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  value={comment}
                  onChange={({ target }) => setComment(target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Button type="submit">Add Comment</Button>
            </Col>
          </Row>
        </Form>
        <Row>
          {blog.comments?.map((comment, index) => (
            <Card key={index} className="p-3 m-2">
              {comment}
            </Card>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Blog;
