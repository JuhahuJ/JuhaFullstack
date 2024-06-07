import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [showInfo, setShowInfo] = useState(false)

  const deleteButton = () => {
    if (user.username === blog.user.username)
      return (
        <button onClick={() => deleteBlog(blog)}>
        Remove
        </button>
      )
  }

  const showInfoBlog = () => {
    return (
      <div>
        <p>{blog.url}<br/>
          likes {blog.likes} <button onClick={() => likeBlog(blog)}>Like</button><br/>
          {blog.user.name}
        </p>
        {deleteButton()}
      </div>
    )
  }

  return (
    <div>
      {blog.title} by {blog.author} <button onClick={() => setShowInfo(!showInfo)}>
        {showInfo ? 'Hide' : 'View'}
      </button>
      {showInfo && showInfoBlog()}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog