import React, {Component} from 'react'
import classes from './FreeModule.css'
import Autosuggest from 'react-autosuggest'

class FilterModuleFree extends Component {
  constructor (props) {
    super(props)
    this.state = {value: '', suggestions: remapSuggestions(this.props.keys)}
    this.handleChange = this.handleChange.bind(this)
    this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this)
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this)
  }

  handleChange (event, { newValue, method }) {
    this.setState({value: newValue})
    this.props.changeHandler(this.props.id, newValue, 's')
  }

  onSuggestionsFetchRequested ({ value }) {
    this.setState({suggestions: getSuggestions(value, remapSuggestions(this.props.keys))})
  }

  onSuggestionsClearRequested () {
    this.setState({
      suggestions: []
    })
  }

  render () {
    const inputProps = {
      placeholder: this.props.name,
      onChange: this.handleChange,
      value: this.state.value
    }
    return (
      <div className={classes.Input}>
        <Autosuggest
          className={classes.InputBox}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          theme={classes}
        />
      </div>
    )
  }
}

export default FilterModuleFree

const renderSuggestion = (suggestion) => {
  return (
    <span>{suggestion.name}</span>
  )
}

const getSuggestionValue = (suggestion) => {
  return suggestion.name
}

const remapSuggestions = (suggestions) => {
  let reMaped = []
  suggestions.map(e => reMaped.push({name: e, value: e}))
  return reMaped
}

const getSuggestions = (value, suggestions) => {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length
  return inputLength === 0 ? [] : suggestions.filter(lang =>
    lang.name.toLowerCase().includes(inputValue)
  )
}
