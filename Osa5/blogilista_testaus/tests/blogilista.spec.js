const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Note app', () => {
	beforeEach(async ({ page, request }) => {
		await request.post('http:localhost:3003/api/testing/reset')
		await request.post('http://localhost:3003/api/users', {
			data: {
				name: 'Matti Luukkainen',
				username: 'mluukkai',
				password: 'salainen'
			}
		})
		await request.post('http://localhost:3003/api/users', {
			data: {
				name: 'ittuM neniakkuuL',
				username: 'iakkuulm',
				password: 'nenialas'
			}
		})

		await page.goto('http://localhost:5173')
	})

	test('Login form is shown', async ({ page }) => {
		await expect(page.getByText('Log in to application')).toBeVisible()
		await expect(page.getByText('username')).toBeVisible()
		await expect(page.getByText('password')).toBeVisible()
		await expect(page.getByText('login')).toBeVisible()
	})

	describe('Login', () => {
		test('succeeds with correct credentials', async ({ page }) => {
			await loginWith(page, 'mluukkai', 'salainen')

			await expect(page.getByText('blogs')).toBeVisible()
		})

		test('fails with wrong credentials', async ({ page }) => {
			await loginWith(page, 'mluukkai', 'salaiton')

			await expect(page.getByText('wrong credentials')).toBeVisible()
		})
	})

	describe('When logged in', () => {
		beforeEach(async ({ page }) => await loginWith(page, 'mluukkai', 'salainen'))

		test('a new blog can be created', async ({ page }) => {
			await createBlog(page, 'Title', 'Author', 'url.com')

			await expect(page.getByText('a new blog Title by Author added')).toBeVisible()
			await page.waitForTimeout(5000)
			await expect(page.getByText('Title by Author')).toBeVisible()
			await expect(page.getByText('View')).toBeVisible()
		})

		test('a blog can be liked', async ({ page }) => {
			await createBlog(page, 'Title', 'Author', 'url.com')

			await page.getByRole('button', { name: 'View' }).click()
			await expect(page.getByText('likes 0')).toBeVisible()

			await page.getByRole('button', { name: 'Like' }).click()
			await expect(page.getByText('likes 1')).toBeVisible()
		})

		test('a blog can be deleted', async ({ page }) => {
			await createBlog(page, 'Title', 'Author', 'url.com')

			await page.getByRole('button', { name: 'View' }).click()
			page.on('dialog', dialog => dialog.accept());
			await page.getByRole('button', { name: 'Remove' }).click()

			await page.waitForTimeout(100)
			await expect(page.getByText('Title by Author')).toBeHidden()
		})

		test('only correct user sees delete button', async ({ page }) => {
			await createBlog(page, 'Title', 'Author', 'url.com')

			await page.getByRole('button', { name: 'View' }).click()
			await expect(page.getByText('Remove')).toBeVisible()

			await page.getByRole('button', { name: 'logout' }).click()
			await loginWith(page, 'iakkuulm', 'nenialas')
			await page.getByRole('button', { name: 'View' }).click()
			await expect(page.getByText('Remove')).toBeHidden()
		})

		test('likes are sorted correctly', async ({ page }) => {
			await createBlog(page, 'Title', 'Author', 'url.com')
			await createBlog(page, 'Title2', 'Author2', 'url.com2')

			await page.getByRole('button', { name: 'View' }).first().click()
			await page.getByRole('button', { name: 'Like' }).click()
			await page.getByRole('button', { name: 'Hide' }).click()

			await page.getByRole('button', { name: 'View' }).last().click()
			await page.getByRole('button', { name: 'Like' }).click()
			await page.waitForTimeout(100)
			await page.getByRole('button', { name: 'Like' }).click()
			await page.waitForTimeout(100)
			await page.getByRole('button', { name: 'Hide' }).click()
			await page.waitForTimeout(100)
			await page.getByRole('button', { name: 'View' }).first().click()
			await expect(page.getByText('likes 2')).toBeVisible()
			await page.getByRole('button', { name: 'Hide' }).click()

			await createBlog(page, 'Title3', 'Author3', 'url.com3')
			await page.waitForTimeout(100)
			await page.getByRole('button', { name: 'View' }).last().click()
			await page.getByRole('button', { name: 'Like' }).click()
			await page.waitForTimeout(100)
			await page.getByRole('button', { name: 'Like' }).click()
			await page.waitForTimeout(100)
			await page.getByRole('button', { name: 'Like' }).click()
			await page.waitForTimeout(100)
			await page.getByRole('button', { name: 'Hide' }).click()
			await page.waitForTimeout(100)
			await page.getByRole('button', { name: 'View' }).first().click()
			await expect(page.getByText('likes 3')).toBeVisible()
		})
	})
})