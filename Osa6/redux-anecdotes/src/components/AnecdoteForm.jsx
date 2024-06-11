import { useDispatch } from 'react-redux'
import { newAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
	const dispatch = useDispatch()

	const newA = (event) => {
		event.preventDefault()
		const content = event.target.anAnecdote.value
		event.target.anAnecdote.value = ''
		dispatch(newAnecdote(content))
		dispatch(setNotification(`You added '${content}'`))
		setTimeout(() => {
			dispatch(clearNotification())
		}, 5000)
	}

	return (
		<>
			<h2>create new</h2>
			<form onSubmit={newA}>
				<div><input name='anAnecdote' /></div>
				<button type='submit'>create</button>
			</form>
		</>
	)
}

export default AnecdoteForm