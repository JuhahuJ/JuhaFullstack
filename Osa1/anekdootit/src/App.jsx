import { useState } from 'react'

const Header = ({header}) => <h1>{header}</h1>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [maxVoted, setMaxVoted] = useState(0)
  const [votecount, setVoteCount] = useState(0)
  const [maxVoteCount, setMaxVoteCount] = useState(0)
  const [voteCounter, setCounter] = useState(new Uint8Array(8))

  const getRandom = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const setToSelected = () => {
    const selectedNumber = getRandom(0,7)
    setSelected(selectedNumber)
    setVoteCount(voteCounter[selectedNumber])
  }

  const setToVote = () => {
    const voteCopy = [...voteCounter]
    voteCopy[selected] += 1
    const voteMax = Math.max(...voteCopy)
    setCounter(voteCopy)
    setVoteCount(voteCopy[selected])
    setMaxVoted(voteCopy.indexOf(voteMax))
    setMaxVoteCount(voteMax)
  }

  return (
    <div>
      <Header header="Anecdote of the day"/>
      {anecdotes[selected]} <br/>
      <p>has {votecount} votes</p>
      <Button handleClick={() => setToVote()} text="vote"/>
      <Button handleClick={() => setToSelected()} text="next anecdote"/>
      <Header header="Anecdote with most votes"/>
      {anecdotes[maxVoted]} <br/>
      <p>has {maxVoteCount} votes</p>
    </div>
  )
}

export default App