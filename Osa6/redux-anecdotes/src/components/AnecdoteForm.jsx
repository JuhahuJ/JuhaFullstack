import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
	const dispatch = useDispatch()

	const newA = async (event) => {
		event.preventDefault()
		const content = event.target.anAnecdote.value
		event.target.anAnecdote.value = ''
		dispatch(createAnecdote(content))
		dispatch(showNotification(`You added '${content}'`, 5))
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