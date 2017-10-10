import React, { Component } from 'react'
import Autosuggest from 'react-autosuggest'

import { makeSuggestionRequest } from './helpers'

const dictionary = [
  'dog',
  'cat',
  'ferret',
  'monkey',
  'giraffe',
  'rhino',
  'chimpanze',
  'fish',
  'ant',
  'whale',
  'tortoise',
  'tucan',
  'beatle',
  'amoeba'
]

const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length
  if (inputLength === 0) {
    return []
  } else {
    makeSuggestionRequest(inputValue)
      .then(suggestions => {
        console.log('suggestions: ', suggestions)
        return suggestions
      })
      .catch(console.error)
  }
}

const getSuggestionValue = suggestion => suggestion

const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
)

class PadRAS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: '',
      input: '',
      suggestions: []
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleTabAndArrowKeys, false)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleTabAndArrowKeys, false)
  }

  handleTabAndArrowKeys = evt => {
    if (evt.keyCode == 9) { // tab key
      evt.preventDefault()
      // if (this.state.suggestions.length > 0) {
      //   this.setState(state => ({
      //     ...state,
      //     input: `${this.state.input} ${this.state.suggestions[0]} `
      //   }))
      // }
    }
  }

  onChange = (evt, { newValue }) => {
    this.setState(state => ({
      ...state,
      value: newValue
    }))
  }

  onBlur = (evt, { highlightedSuggestion }) => {
    evt.preventDefault()
    this.setState(state => ({
      ...state,
      value: this.state.value + ' ' + highlightedSuggestion
    }))
  }

  // onSuggestionHighlighted = ({ suggestion }) => {
  //   this.setState(state => ({
  //     ...state,
  //     value: suggestion
  //   }))
  // }

  onSuggestionsFetchRequested = ({ value }) => {
    makeSuggestionRequest(value)
      .then(suggestions => {
        console.log('suggestions: ', suggestions)
        this.setState(state => ({
          ...state,
          suggestions
        }))
      })
      .catch(console.error)
  }

  onSuggestionsClearRequested = () => {
    this.setState(state => ({
      ...state,
      suggestions: []
    }))
  }

  render() {
    const { value, suggestions } = this.state

    const inputProps = {
      placeholder: 'Start typing...',
      value,
      onChange: this.onChange,
      onBlur: this.onBlur
    }

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}

        getSuggestionValue={getSuggestionValue}
        highlightFirstSuggestion={false}
        focusInputOnSuggestionClick={true}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    )
  }
}

export default PadRAS