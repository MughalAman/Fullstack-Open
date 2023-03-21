const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')

const helper = require('./test_helper')

const bcrypt = require('bcrypt')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

test('there are blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('identifying field is id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
        expect(blog.id).toBeDefined()
    })
})

test('can post a blog', async () => {
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'test', name: 'test', passwordHash })

    await user.save()

    const newBlog = {
        title: "Test blog",
        author: "Test author",
        url: "http://test.com",
        likes: 0,
        userId: user._id
    }

    const loginResponse = await api.post('/api/login')
        .send({username: 'test', password: 'sekret'})

    await api.post('/api/blogs')
        .auth(loginResponse.body.token, { type: 'bearer' })
        .send(newBlog)
        .expect(201)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
})

test('can delete a blog', async () => {
    const response = await api.get('/api/blogs')
    const blogToDelete = response.body[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const responseAfterDelete = await api.get('/api/blogs')

    expect(responseAfterDelete.body).toHaveLength(helper.initialBlogs.length - 1)
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})

      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', name: 'Superuser', passwordHash })

      await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
  })

  describe('when there is initially one user at db', () => {

      test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }

        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
    })

afterAll(async () => {
  await mongoose.connection.close()
})