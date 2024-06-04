const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
  .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
  if (!request.decodedToken) {
    return response.status(401).json({ error: 'token invalid' })
  }
  try {
    const { title, author, url, likes} = request.body
    
    const user = request.user
    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id
    })
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(400).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  if (!request.decodedToken) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const blog = await Blog.findById(request.params.id)
  if(!blog) {
    return response.status(204).end()
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(401).json({ error: 'wrong user' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true, runValidators: true, context: 'query' })
  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter