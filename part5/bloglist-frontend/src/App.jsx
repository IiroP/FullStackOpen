import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import login from "./services/login";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({});

  const blogFormRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await login.login({ username, password });
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.error(exception);
      showMessage("error", "Login failed, check username and password");
    }
  };

  const logout = () => {
    window.localStorage.removeItem("loggedInUser");
    blogService.setToken(null);
    setUser(null);
  };

  const createBlog = async (blog) => {
    const response = await blogService.create(blog);
    setBlogs(blogs.concat(response));
    blogFormRef.current.toggleVisibility();
  };

  const updateBlogs = async () => {
    const newBlogs = await blogService.getAll();
    setBlogs(newBlogs);
  };

  const addLike = async (id) => {
    await blogService.like(id);
  };

  useEffect(() => {
    updateBlogs();
  }, []);

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInUser");
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const showMessage = (type, content) => {
    setMessage({ type, content });
    setTimeout(() => {
      setMessage({});
    }, 5000);
  };

  const msgBox = () => {
    if (message.content) {
      return <div className={`message ${message.type}`}>{message.content}</div>;
    }
  };

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {msgBox()}
        <form onSubmit={handleLogin}>
          <div>
            <label>
              Username
              <input
                type="text"
                name="username"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Password
              <input
                type="password"
                name="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      {msgBox()}
      <p>
        {user.name} logged in <button onClick={logout}>Logout</button>
      </p>

      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm createBlog={createBlog} showMessage={showMessage} />
      </Togglable>

      <h3>Current blogs</h3>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            updateBlogs={updateBlogs}
            addLike={addLike}
          />
        ))}
    </div>
  );
};

export default App;
