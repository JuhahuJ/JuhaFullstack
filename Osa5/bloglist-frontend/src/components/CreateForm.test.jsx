import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateForm from './CreateForm'

test('form calls given callback function with correct information', async () => {
  const mockHandler = vi.fn()
  const { container } = render(<CreateForm createBlog={mockHandler}/>)

  const user = userEvent.setup()
  await user.type(container.querySelector('#title-input'), 'Title')
  await user.type(container.querySelector('#author-input'), 'Author')
  await user.type(container.querySelector('#url-input'), 'url.com')
  await user.click(screen.getByText('create'))

  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe('Title' )
  expect(mockHandler.mock.calls[0][0].author).toBe('Author' )
  expect(mockHandler.mock.calls[0][0].url).toBe('url.com' )
})