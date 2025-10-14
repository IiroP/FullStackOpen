import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import Togglable from "./components/Togglable";
import { setNotification } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { login, logout, setUser } from "./reducers/loginReducer";
import { Link, Route, Routes, useMatch } from "react-router-dom";
import { initializeUsers } from "./reducers/usersReducer";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import UserList from "./components/UserList";
import User from "./components/User";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const message = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);

  const blogFormRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userMatch = useMatch("/users/:id");
  const userById = userMatch
    ? users.find((u) => u.id === userMatch.params.id)
    : null;

  const blogMatch = useMatch("/blogs/:id");
  const blogById = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null;

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await dispatch(login({ username, password }));
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.error(exception);
      showMessage("error", "Login failed, check username and password");
    }
  };

  const updateBlogs = async () => {
    dispatch(initializeBlogs());
  };

  useEffect(() => {
    updateBlogs();
    dispatch(initializeUsers());
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      blogService.setToken(user.token);
      dispatch(setUser(user));
    }
  }, []);

  const showMessage = (type, content) => {
    dispatch(setNotification(type, content));
  };

  const msgBox = () => {
    if (message.content) {
      return <div className={`message ${message.type}`}>{message.content}</div>;
    }
  };

  if (user === null) {
    return (
      <Container>
        <h2 className="mt-5">Log in to application</h2>
        {msgBox()}
        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>
              Username
              <Form.Control
                type="text"
                name="username"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </Form.Label>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Password
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </Form.Label>
          </Form.Group>
          <div>
            <Button type="submit">Login</Button>
          </div>
        </Form>
      </Container>
    );
  }

  const MainPage = () => {
    return (
      <>
        <Togglable buttonLabel="New blog" ref={blogFormRef}>
          <BlogForm />
        </Togglable>

        <h3>Current blogs</h3>
        <Row>
          {blogs
            .toSorted((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Card
                key={blog.id}
                className="p-3 m-2"
                style={{ maxWidth: "300px" }}
              >
                <a href={`/blogs/${blog.id}`}>
                  {blog.title} by {blog.author}
                </a>
              </Card>
            ))}
        </Row>
      </>
    );
  };

  return (
    <div className="container">
      <Navbar>
        <Container>
          <Navbar.Brand>
            <Nav.Link as={Link} to="/">
              Blog App
            </Nav.Link>
          </Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/">
              Blogs
            </Nav.Link>
            <Nav.Link as={Link} to="/users">
              Users
            </Nav.Link>
          </Nav>
          <span>
            {user.name} logged in{" "}
            <Button onClick={() => dispatch(logout())}>Logout</Button>
          </span>
        </Container>
      </Navbar>

      <h2>Blogs</h2>
      {msgBox()}

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<MainPage />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<User user={userById} />} />
        <Route
          path="/blogs/:id"
          element={<Blog blog={blogById} user={user} />}
        />
      </Routes>
    </div>
  );
};

export default App;
