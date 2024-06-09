const createBlog = async (page, title, author, url) => {
	await page.getByRole('button', { name: 'new blog' }).click()
	await page.getByTestId('title-input').fill(title)
	await page.getByTestId('author-input').fill(author)
	await page.getByTestId('url-input').fill(url)
	await page.getByRole('button', { name: 'create' }).click()
}

const loginWith = async (page, username, password) => {
	await page.getByRole('textbox').first().fill(username)
	await page.getByRole('textbox').last().fill(password)
	await page.getByRole('button', { name: 'login' }).click()
}

export { createBlog, loginWith }