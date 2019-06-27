import React, { Component } from 'react'
import classes from './SidebarFilterElements.css'
// import { getFieldColor, getTopicColor } from '../../store/utility'

class FilterElements extends Component {
  render () {
    // const labelString = 60
    // const color = getTopicColor(1) === '#989aa1' ? getFieldColor(1) : getTopicColor(1)
    return (
      <div>
        <label className={classes.customCheckbox + ' ' + classes.this.props.color }>{this.props.title}
          <input type={classes.checkbox} onClick={() => this.toggle(this.props.title)} />
          <span className={classes.checkmark + ' ' + classes.this.props.color}></span>
        </label>
      </div>
    )
  }
}

export default FilterElements
