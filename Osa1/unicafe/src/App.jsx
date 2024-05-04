import { useState } from 'react'

const Header = ({header}) => <h1>{header}</h1>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const setToGood = () => {
    const allValue = all + 1
    const goodValue = good + 1
    setAll(allValue)
    setGood(goodValue)
    console.log(goodValue-bad,allValue)
    setAverage((goodValue-bad)/allValue)
    setPositive(goodValue/allValue)
  }
  const setToNeutral = () => {
    const allValue = all + 1
    setAll(allValue)
    setNeutral(neutral + 1)
    setAverage((good-bad)/allValue)
    setPositive(good/allValue)
  }
  const setToBad = () => {
    const allValue = all + 1
    const BadValue = bad + 1
    setAll(allValue)
    setBad(BadValue)
    setAverage((good-BadValue)/allValue)
    setPositive(good/allValue)
  }

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
      <p>all {all}</p>
      <p>average {average}</p>
      <p>positive {positive} %</p>
    </div>
  )
}

export default App