import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
	const anecdotes = useSelector(state => state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter)))
	const dispatch = useDispatch()

	const vote = (anecdote) => {
		dispatch(voteAnecdote(anecdote.id))
		dispatch(setNotification(`You voted '${anecdote.content}'`))
		setTimeout(() => {
			dispatch(clearNotification())
		}, 5000)
	}

	return (
		<>
			{anecdotes.sort((a, b) => (a.votes > b.votes ? -1 : 1)) && anecdotes.map(anecdote =>
				<div key={anecdote.id}>
					<div>
						{anecdote.content}
					</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => vote(anecdote)}>vote</button>
					</div>
				</div>
			)}
		</>
	)
}

export default AnecdoteForm