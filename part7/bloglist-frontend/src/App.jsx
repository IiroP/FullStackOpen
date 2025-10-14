import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import blogService from "./services/blogs";
import Togglable from "./components/Togglable";
import { setNotification } from "./reducers/notificationReducer";
import { initializeBlogs } from "./reducers/blogReducer";
import { login, logout, setUser } from "./reducers/loginReducer";
import { Route, Routes, useMatch } from "react-router-dom";
import { initializeUsers } from "./reducers/usersReducer";

const App = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const message = useSelector((state) => state.notification);
  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);

  const blogFormRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const match = useMatch("/users/:id");
  const userById = match ? users.find((u) => u.id === match.params.id) : null;

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

  const MainPage = () => {
    return (
      <>
        <Togglable buttonLabel="New blog" ref={blogFormRef}>
          <BlogForm />
        </Togglable>

        <h3>Current blogs</h3>
        {blogs
          .toSorted((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog key={blog.id} blog={blog} user={user} />
          ))}
      </>
    );
  };

  const Users = () => {
    return (
      <>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <a href={`/users/${user.id}`}>{user.name}</a>
                </td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  };

  const User = ({ user }) => {
    if (!user) {
      return null;
    }

    return (
      <div>
        <h2>{user.name}</h2>
        <h3>Added blogs:</h3>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h2>blogs</h2>
      {msgBox()}
      <p>
        {user.name} logged in{" "}
        <button onClick={() => dispatch(logout())}>Logout</button>
      </p>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/create" element={<MainPage />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<User user={userById} />} />
      </Routes>
    </div>
  );
};

export default App;
