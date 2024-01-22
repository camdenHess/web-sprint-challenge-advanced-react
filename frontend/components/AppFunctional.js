import React, { useState } from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const grids = ['(1, 1)', '(2, 1)', '(3, 1)',
  '(1, 2)', '(2, 2)', '(3, 2)',
  '(1, 3)', '(2, 3)', '(3, 3)']

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)
  const [steps, setSteps] = useState(initialSteps)
  const [index, setIndex] = useState(initialIndex)
  
  function getXY(idx) {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let xy =[]
    const newCoordinates = grids[idx]
    let coordArray = newCoordinates.split('')
    xy.push(coordArray[1])
    xy.push(coordArray[4])
    return xy
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    let xyArray = getXY(index)
    return `Coordinates (${Number(xyArray[0])}, ${Number(xyArray[1])})`
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setIndex(initialIndex)
    setSteps(initialSteps)
    setMessage(initialMessage)
    setEmail(initialEmail)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let newIndex = index
    if (direction === 'up') {
      if (index < 3) {
        setMessage("You can't go up")
        return newIndex
      }
      newIndex = index - 3
    }
    if (direction === 'left') {
      if (index === 0 || index === 3 || index === 6) {
        setMessage("You can't go left")
        return newIndex
      }
      newIndex = index - 1
    }
    if (direction === 'right') {
      if (index === 2 || index === 5 || index === 8) {
        setMessage("You can't go right")
        return newIndex
      }
      newIndex = index + 1
    }
    if (direction === 'down') {
      setMessage("You can't go down")
      if (index > 5) {
        return newIndex
      }
      newIndex = index + 3
    }
    setSteps(steps + 1)
    setMessage(initialMessage)
    return newIndex
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const { id } = evt.target
    const nextIndex = getNextIndex(id)
    setIndex(nextIndex)
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    const { value } = evt.target
    setEmail(value)
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    let xyArray = getXY(index)
    let submitForm = {x: Number(xyArray[0]), y: Number(xyArray[1]), steps: steps, email: email}

    axios.post('http://localhost:9000/api/result', submitForm)
      .then(res => {
        setMessage(res.data.message)
        setSteps(initialSteps)
        setEmail(initialEmail)
        setIndex(initialIndex)
      })
      .catch(err => {
        setMessage(err.response.data.message)
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps === 1 ? `${steps} time` : `${steps} times`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button onClick={move} id="left">LEFT</button>
        <button onClick={move} id="up">UP</button>
        <button onClick={move} id="right">RIGHT</button>
        <button onClick={move} id="down">DOWN</button>
        <button onClick={reset} id="reset">reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input onChange={onChange} value={email} id="email" type="email" placeholder="type email"></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
