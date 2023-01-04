import { useState } from 'react'

const Button = ({name, handleClick}) => (<button onClick={handleClick}>{name}</button>)

const StatisticLine = ({text, value, unit}) => (
  <tr>
    <td>{text}</td>
    <td>{value} {unit}</td>
  </tr>
)

const Statistics = ({good, neutral, bad}) => {
  const count = good + neutral + bad
  if (count === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  } else {
    return (
      <table>
        <tbody>
          <StatisticLine text="Good" value={good} />
          <StatisticLine text="Neutral" value={neutral} />
          <StatisticLine text="Bad" value={bad} />
          <StatisticLine text="Total" value={count} />
          <StatisticLine text="Average" value={(good * 1 + neutral * 0 + bad * -1) / count} />
          <StatisticLine text="Positive" value={ good / count * 100} unit="%" />
        </tbody>
      </table>
    )
  }
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <h1>Feedback to Unicafe</h1>
      <Button name="Good" handleClick={() => setGood(good + 1)} />
      <Button name="Neutral" handleClick={() => setNeutral(neutral + 1)} />
      <Button name="Bad" handleClick={() => setBad(bad + 1)} />
      <h2>Statistics</h2>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App