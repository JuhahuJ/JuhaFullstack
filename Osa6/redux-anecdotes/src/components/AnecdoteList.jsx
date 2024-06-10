import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
	const anecdotes = useSelector(state => state)
	const dispatch = useDispatch()

	const vote = (id) => {
		dispatch(voteAnecdote(id))
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
						<button onClick={() => vote(anecdote.id)}>vote</button>
					</div>
				</div>
			)}
		</>
	)
}

export default AnecdoteForm