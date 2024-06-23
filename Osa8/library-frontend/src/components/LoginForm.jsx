import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ setToken }) => {
	const [username, setUsername] = useState('mluukkai')
	const [password, setPassword] = useState('secret')
	const navigate = useNavigate()


	const [login, result] = useMutation(LOGIN)

	const token = localStorage.getItem('library-user-token')

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value
			localStorage.setItem('library-user-token', token)
			setToken(token)
			navigate('/')
		}
	}, [result.data])

	const submit = async (event) => {
		event.preventDefault()
		await login({ variables: { username, password } })
	}

	if (token) return <div>you are already logged in</div>

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					username <input
						value={username}
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password <input
						type='password'
						value={password}
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type='submit'>login</button>
			</form>
		</div>
	)
}

export default LoginForm