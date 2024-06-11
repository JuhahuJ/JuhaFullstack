import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload
          ? { ...anecdote, votes: anecdote.votes + 1 }
          : anecdote
      )
    },
    newAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const aNewAnecdote = await anecdoteService.createNew(content)
    dispatch(newAnecdote(aNewAnecdote))
  }
}

export const addVote = content => {
  return async dispatch => {
    const updatedAnecdote = await anecdoteService.update(content)
    dispatch(voteAnecdote(updatedAnecdote.id))
  }
}

export const { voteAnecdote, newAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer