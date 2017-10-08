import React, { Component } from 'react'
import googleSuggestions from 'google-suggestions'

import { makeSuggestionRequest, fetchSuggestions } from './helpers'
import SuggestionBar from './SuggestionBar'
import Timer from './Timer'

export default class Pad extends Component {
  state = {
    input: '',
    selected: 0,
    suggestions: [],
    secondsRemaining: 0,
    requestBlocked: false,
    requestCount: 0
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleTabAndArrowKeys, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleTabAndArrowKeys, false)
    clearInterval(this.interval)
  }

  componentDidCatch(err, info) {
    console.log(err)
    console.log(info)
  }

  handleInputChange = ({ target }) => {
    const { input, requestBlocked } = this.state
    this.setState(state => ({ ...state, input: target.value }))
    
    if (!requestBlocked || input[input.length - 1] === ' ') {
      this.getSuggestions(input)
    }
  }

  handleTabAndArrowKeys = evt => {
    const { selected, suggestions, input } = this.state

    if (evt.keyCode == 9) { // tab key
      evt.preventDefault()
      this.setState(state => ({
        ...state,
        input: `${input}${suggestions[selected]} `
      }))
    }
    else if (evt.keyCode == 38) { // up arrow
      evt.preventDefault()
      if (selected === 0)
        this.setState(state => ({
          ...state,
          selected: suggestions.length - 1
        }))
      else
        this.setState(state => ({
          ...state,
          selected: selected - 1
        }))
    }
    else if (evt.keyCode == 40) { // down arrow
      evt.preventDefault()
      if (selected === suggestions.length - 1)
        this.setState(state => ({ ...state, selected: 0 }))
      else
        this.setState(state => ({ ...state, selected: selected + 1 }))
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
    const { requestBlocked, requestCount, secondsRemaining } = this.state
    
    // when timer runs out allow count to continue incrementing
    if (secondsRemaining <= 0) {
      clearInterval(this.interval)
      this.setState(state => ({
        ...state,
        requestBlocked: false
      }))
    }

    if (!requestBlocked) {
      this.setState(state => ({
        ...state,
        requestCount: requestCount + 1
      }))

      // does requests from client
      googleSuggestions(query)
        .then(suggestions => {
          console.log('request made')
          console.log(suggestions)
          
          // if (this.state.suggestions && this.state.suggestions[0] === suggestions[0]) {
          //   console.log('same results already in state')
          // } else {
          //   this.setState({ suggestions })
          // }
        })
        .catch(console.error)

      // hits backend server
      // makeSuggestionRequest(query)
      //   .then(suggestions => {
      //     console.log('request made')
      //     console.log(suggestions)
          
      //     if (this.state.suggestions && this.state.suggestions[0] === suggestions[0]) {
      //       console.log('same results already in state')
      //     } else {
      //       this.setState({ suggestions })
      //     }
      //   })
    }

    // if requestCount exceeds 5 pause requestCount for 10sec (start timer)
    if (requestCount % 3 === 0) {
      this.setState(state => ({
        ...state,
        secondsRemaining: 1,
        requestBlocked: true
      }))
      this.interval = setInterval(this.tick, 1000)
    }
  }

  unblock = () => {
    this.setState(state => ({
      ...state,
      requestBlocked: false
    }))
  }

  render() {
    const { 
      input, 
      suggestions, 
      selected, 
      requestCount, 
      requestBlocked,
      secondsRemaining
    } = this.state
  
    if (input[input.length - 1] === ' ') {
      this.getSuggestions(input)
    }

    return (
      <div className="app-body">
        <div className="center">
          <h1>Request Count:  {requestCount && requestCount}</h1>
          <h1>Access:  {requestBlocked ? 'Blocked' : 'Open'}</h1>
          <h1>Seconds Until Unblock:  {secondsRemaining}</h1>
        </div>

        <h3 className="center subtitle output-title">Output</h3>
        <div className="columns">
          <div className="column output-container">
            <h4 className="center output-text">{input.length ? input : 'Your text here...'}</h4>
          </div>
        </div>

        <div className="columns">
          <div className="column main-pad-container">
            <textarea
              id="text-area"
              className="main-pad box-shadow-class"
              placeholder="Start typing to see suggestions..."
              onChange={this.handleInputChange}
              value={input}
              onKeyPress={this.handleTabAndArrowKeys}
              autoFocus
            >
            </textarea>
          </div>
          <div className="column suggestion-higher-container">
            <SuggestionBar suggestions={suggestions} selected={selected} />
          </div>
        </div>
      </div>
    )
  }
}
