import { useState } from 'react'

const Header = ({header}) => <h1>{header}</h1>

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({text, value, percent}) => <tr><td>{text}</td><td>{value} {percent}</td></tr>

const Statistics = (props) => {
  const all = props.all
  if (all == 0) return (
    <div>
      <p>No feedback given</p>
    </div>
  )
  return (
    <table>
      <tbody>
        <StatisticLine text="good" value ={props.good}/>
        <StatisticLine text="neutral" value ={props.neutral}/>
        <StatisticLine text="bad" value ={props.bad}/>
        <StatisticLine text="all" value ={all}/>
        <StatisticLine text="average" value ={props.average}/>
        <StatisticLine text="positive" value ={props.positive} percent={"%"}/>
      </tbody>
    </table>
  )
}

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
    setAverage((goodValue-bad)/allValue)
    setPositive(goodValue/allValue*100)
  }
  const setToNeutral = () => {
    const allValue = all + 1
    setAll(allValue)
    setNeutral(neutral + 1)
    setAverage((good-bad)/allValue)
    setPositive(good/allValue*100)
  }
  const setToBad = () => {
    const allValue = all + 1
    const BadValue = bad + 1
    setAll(allValue)
    setBad(BadValue)
    setAverage((good-BadValue)/allValue)
    setPositive(good/allValue*100)
  }

  return (
    <div>
      <Header header="give feedback" />
      <Button handleClick={() => setToGood()} text="good"/>
      <Button handleClick={() => setToNeutral()} text="neutral"/>
      <Button handleClick={() => setToBad()} text="bad"/>
      <Header header="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>
  )
}

export default App