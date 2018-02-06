import React, {Component} from 'react'
import classes from './FilterBox.css'

class FilterModuleFree extends Component {
  constructor (props) {
    super(props)
    this.state = {value: ''}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    this.setState({value: event.target.value})
    this.props.changeHandler(this.props.id, event.target.value, 's')
  }

  render () {
    return (
      <div>
        <input
          type="text"
          className={classes.Input}
          value={this.state.value}
          onChange={this.handleChange}/>
      </div>
    )
  }
}

export default FilterModuleFree
