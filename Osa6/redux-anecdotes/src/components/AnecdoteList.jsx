import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
	const anecdotes = useSelector(state => state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter)))
	const dispatch = useDispatch()

	const vote = (anecdote) => {
		dispatch(addVote(anecdote))
		dispatch(showNotification(`You voted '${anecdote.content}'`, 5))
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