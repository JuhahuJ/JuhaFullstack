import { useState } from 'react'

const Header = ({header}) => <h1>{header}</h1>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = () => setGood(good + 1)
  const setToNeutral = () => setNeutral(neutral + 1)
  const setToBad = () => setBad(bad + 1)

  return (
    <div>
      <Header header="give feedback" />
      <Button handleClick={() => setToGood()} text="good"/>
      <Button handleClick={() => setToNeutral()} text="neutral"/>
      <Button handleClick={() => setToBad()} text="bad"/>
      <Header header="statistics" />
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
    </div>
  )
}

export default App