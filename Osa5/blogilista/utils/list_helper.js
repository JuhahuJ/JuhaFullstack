const lodash = require('lodash')

const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = (blogs) => blogs.reduce((max, blog) => (blog.likes > max.likes) ? blog : max)

const mostBlogs = (blogs) => {
  const groupedByAuthor = lodash.groupBy(blogs, 'author')
  const authorBlogCounts = lodash.map(groupedByAuthor, (authorBlogs, author) => ({
    author: author,
    blogs: authorBlogs.length
  }))
  return lodash.maxBy(authorBlogCounts, 'blogs')
}

const mostLikes = (blogs) => {
  const groupedByAuthor = lodash.groupBy(blogs, 'author')
  const authorLikes = lodash.map(groupedByAuthor, (authorBlogs, author) => ({
    author: author,
    likes: lodash.sumBy(authorBlogs, 'likes')
  }))
  return lodash.maxBy(authorLikes, 'likes')
}
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }