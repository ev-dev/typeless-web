import React, { Component } from 'react'

class SuggestionBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLog: false
    }
  }

  toggleLog = evt => {
    evt.preventDefault()
    this.setState({ showLog: !this.state.showLog })
  }

  render() {
    const { showLog } = this.state
    const { suggestions, selected } = this.props

    return (
      <div className="suggestion-container box-shadow-class">
        <div className="suggestion-list">
          {suggestions && suggestions.map((suggestion, i) => (
            <div key={i}
              className={`suggestion-item ${i === selected && 'suggestion-selected'}`}
            >
              <p className="suggestion-text">{suggestion}</p>
            </div>
          ))}
        </div>
        <div className="instruction-container">
          <h3 className="suggestion-title subtitle">Suggestions</h3>
          <ul className="instructions">
            <li>- Hit Tab To Complete</li>
            <li>- Select Options With Arrows</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default SuggestionBar
