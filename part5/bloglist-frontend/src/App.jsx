import { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import login from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState({})

  const [blogTitle, setBlogTitle] = useState("")
  const [blogAuthor, setBlogAuthor] = useState("")
  const [blogUrl, setBlogUrl] = useState("")

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await login.login({ username, password })
      window.localStorage.setItem("loggedInUser", JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    } catch (exception) {
      console.error(exception)
      showMessage("error", "Login failed, check username and password")
    }
  }

  const logout = () => {
    window.localStorage.removeItem("loggedInUser")
    blogService.setToken(null)
    setUser(null)
  }

  const handleCreateBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = {
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl
      }
      const response = await blogService.create(newBlog)
      setBlogs(blogs.concat(response))
      setBlogTitle("")
      setBlogAuthor("")
      setBlogUrl("")
      showMessage("success", `A new blog "${response.title}" by ${response.author} added`)
    } catch (exception) {
      console.error(exception)
      showMessage("error", "Blog creation failed, check the input")
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem("loggedInUser")
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
    }
  }, [])

  const showMessage = (type, content) => {
    setMessage({ type, content })
    setTimeout(() => {
      setMessage({})
    }, 5000)
  }

  const msgBox = () => {
    if (message.content) {
      return (
        <div className={`message ${message.type}`}>
          {message.content}
        </div>
      )
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {msgBox()}
        <form onSubmit={handleLogin}>
          <div>
            <label>
              Username
              <input type="text" name="username" value={username} onChange={({ target }) => setUsername(target.value)} />
            </label>
          </div>
          <div>
            <label>
              Password
              <input type="password" name="password" value={password} onChange={({ target }) => setPassword(target.value)} />
            </label>
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {msgBox()}
      <p>{user.name} logged in <button onClick={logout}>Logout</button></p>

      <h3>Create new blog</h3>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label>
            Title:
            <input type="text" name="title" value={blogTitle} onChange={({ target }) => setBlogTitle(target.value)} />
          </label>
        </div>
        <div>
          <label>
            Author:
            <input type="text" name="author" value={blogAuthor} onChange={({ target }) => setBlogAuthor(target.value)} />
          </label>
        </div>
        <div>
          <label>
            URL:
            <input type="text" name="url" value={blogUrl} onChange={({ target }) => setBlogUrl(target.value)} />
          </label>
        </div>
        <div>
          <button type="submit">Create blog</button>
        </div>
      </form>

      <h3>Current blogs</h3>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App