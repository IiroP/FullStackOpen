import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="Bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const Statistics = (props) => {
  const total = props.good + props.bad + props.neutral
  const average = (props.good - props.bad) / total
  const positive = props.good / total * 100
  if (total === 0) {
    return (<p>No feedback yet</p>)
  } else {
    return (
      <table>
        <StatisticLine name="Good:" value={props.good} />
        <StatisticLine name="Neutral:" value={props.neutral} />
        <StatisticLine name="Bad:" value={props.bad} />
        <StatisticLine name="All:" value={total} />
        <StatisticLine name="Average:" value={average} />
        <StatisticLine name="Positive:" value={positive + " %"} />
      </table>
    )
  }
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.name}</td>
      <td>{props.value}</td>
    </tr>
  )
}

export default App