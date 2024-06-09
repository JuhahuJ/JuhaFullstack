import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import CreateForm from './components/CreateForm'
import './index.css'

const ErrorMessage = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="notification">
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [notification, setNotification] = useState(null)
  const [update, setUpdate] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [update])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      setUpdate(Math.random)
      setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log(error.response.data)
    }
  }

  const likeBlog = async (blog) => {
    await blogService.update(blog)
    setUpdate(Math.random)
  }

  const removeBlog = async (blog) => {
    if (confirm(`remove ${blog.title} by ${blog.author}`))
      await blogService.remove(blog)
    setUpdate(Math.random)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  if (user === null) {
    return (
      <div>
        <ErrorMessage message={errorMessage}/>
        <h2>Log in to application</h2>
        {loginForm()}
      </div>
    )
  }
  return (
    <div>
      <ErrorMessage message={errorMessage}/>
      <Notification message={notification}/>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <h2>create new</h2>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <CreateForm createBlog={addBlog}/>
      </Togglable>
      {blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1)) && blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} user={user} deleteBlog={removeBlog}/>
      )}
    </div>
  )
}

export default App