const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 6)
})

test('blog identification is id, not _id', async () => {
    const response = await api.get('/api/blogs')
    assert('id' in response.body[0])
    assert(!('_id' in response.body[0]))
  })

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "How to write fake blogs",
        author: "Author Human",
        url: "http://fake.fakefake",
        likes: 7
    }  

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('How to write fake blogs'))
    assert('id' in response.body[6])
})

test('if no likes given it is set to zero', async () => {
    const newBlog = {
        title: "How to write fake blogs",
        author: "Author Human",
        url: "http://fake.fakefake"
    }  

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body[6].likes, 0)
})

test('if no title or url return 400', async () => {
    const newBlog = {
        author: "Author Human",
        url: "http://fake.fakefake"
    }  

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    const newBlog2 = {
        title: "How to write fake blogs",
        author: "Author Human"
    }  

    await api
        .post('/api/blogs')
        .send(newBlog2)
        .expect(400)
})

test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(r => r.title)
    
    assert(!titles.includes(blogToDelete.title))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test.only('more likes can be added', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedLikes = {likes: 10}

    const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedLikes)
        .expect(200)

    assert.strictEqual(updatedBlog.body.likes, updatedLikes.likes)
})

after(async () => {
  await mongoose.connection.close()
})