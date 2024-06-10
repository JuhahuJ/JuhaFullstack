import { useDispatch } from 'react-redux'
import { newAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
	const dispatch = useDispatch()

	const newA = (event) => {
		console.log(event)
		event.preventDefault()
		const content = event.target.anAnecdote.value
		event.target.anAnecdote.value = ''
		dispatch(newAnecdote(content))
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