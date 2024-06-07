import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach } from 'vitest'

const blog = {
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  user: {
    name: 'Human Person',
    username: 'user'
  }
}

const blogUser = {
  username: 'user'
}

const mockHandler = vi.fn()

beforeEach(() => {
  render(<Blog blog={blog} user={blogUser} likeBlog={mockHandler}/>)
})

test('shows title and author, does not show url and likes', () => {
  expect(screen.getByText(blog.title, { exact: false })).toBeDefined()
  expect(screen.getByText(blog.author, { exact: false })).toBeDefined()
  expect(screen.queryByText(blog.url, { exact: false })).toBeNull()
  expect(screen.queryByText(blog.likes, { exact: false })).toBeNull()
})

test('url and likes shown after button press', async () => {

  const user = userEvent.setup()
  await user.click(screen.getByText('View'))

  expect(screen.getByText(blog.url, { exact: false })).toBeDefined()
  expect(screen.getByText(blog.likes, { exact: false })).toBeDefined()
})

test('event handler called twice on two like button presses', async () => {

  const user = userEvent.setup()
  await user.click(screen.getByText('View'))
  await user.click(screen.getByText('Like'))
  await user.click(screen.getByText('Like'))

  expect(mockHandler.mock.calls).toHaveLength(2)
})