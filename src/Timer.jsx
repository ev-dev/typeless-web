import React, { Component } from 'react'
import { makeSuggestionRequest } from './helpers'


class Timer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      secondsRemaining: 10,
      countBlocked: false,
      count: 0,
      suggestions: []
    }
  }

  tick = () => {
    this.setState(state => ({
      ...state,
      secondsRemaining: this.state.secondsRemaining - 1
    }))
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval)
    }
  }

  getSuggestions = query => {
    // when timer runs out allow count to continue incrementing
    if (this.state.secondsRemaining <= 0) {
      clearInterval(this.interval)
      this.setState(state => ({
        ...state,
        countBlocked: false
      }))
    }

    if (!this.state.countBlocked) {
      this.setState(state => ({
        ...state,
        count: this.state.count + 1
      }))

      makeSuggestionRequest(query)
        .then(suggestions => {
          this.setState({ suggestions })
        })
    }
    
    // if count exceeds 5 pause count for 10sec (start timer)
    if (this.state.count % 5 === 0) {
      this.setState(state => ({
        ...state,
        secondsRemaining: 10,
        countBlocked: true
      }))
      this.interval = setInterval(this.tick, 1000)
    } 
  }

  unblock = () => {
    this.setState(state => ({
      ...state,
      countBlocked: false
    }))
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    // if (this.state.secondsRemaining <= 0) {
    //   this.unblock()
    // }
    console.log('suggestion State', this.state.suggestions)

    return (
      <div className="center">
        <h1>Seconds Remaining: {this.state.secondsRemaining}</h1>
        <button onClick={this.counter}>+</button>
        <h1>Count: {this.state.count}</h1>
        <h1>Access: {this.state.countBlocked ? 'Blocked' : 'Open'}</h1> 
        {this.state.suggestions.map(suggestion => (
          <h2>{suggestion}</h2>
        ))}
      </div>
    )
  }
}

export default Timer
