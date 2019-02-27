/* eslint-disable no-multi-str */
import React, {Component} from 'react'

import classes from './SidebarFilterElementsNew.css'
import {getFieldColor, getTopicColor} from '../../store/utility'

const SidebarFilterElementsNew = (props) => {
  const filters = props.filters
  return (
    <div className={classes.Body}>
      <div className={classes.FirstBlock}>
        <div className={classes.UpperHead}>
          <CheckBox show={false} disable={true} checked={false} name={filters[0].name.toUpperCase()} classes={classes.Title} />
        </div>
        <div>
          {filters[0].subGroup.map((subGroup, sgIndex) => {
            const color = getTopicColor(subGroup.name) === '#989aa1' ? getFieldColor(subGroup.name) : getTopicColor(subGroup.name)
            let checkColor = classes.yellow
            switch (sgIndex) {
              case 0:
                checkColor = classes.yellow
                break
              case 1:
                checkColor = classes.red
                break
              case 2:
                checkColor = classes.green
                break
              case 3:
                checkColor = classes.violet
                break

              default:
                break
            }
            return (
              <div className={classes.CheckContainer} key={sgIndex} >
                <CheckBox checkColor={checkColor} show={true} disable={false} checked={true} name={subGroup.name.toUpperCase()} classes={classes.subGroup} color={color} change={props.change} id={0} value={subGroup.name} />
                <div className={classes.groupMarginFix} >
                  {subGroup.values.map((name, nIndex) => {
                    return (
                      <CheckBox checkColor={checkColor} show={true} disable={false} key={nIndex} checked={true} name={name} classes={classes.subGroup} color={color} change={props.change} id={sgIndex === 3 ? 0 : 1} value={name} />
                    )
                  })}
                </div>
              </div>
            )        
          })}
        </div>
      </div>

      <div className={classes.FirstBlock}>
        <div className={classes.UpperHead} >
          <CheckBox show={false} disable={true} checked={false} name={filters[1].name.toUpperCase()} classes={classes.Title} />
        </div>
        <div className={`${classes.CheckContainer} ${classes.groupMarginFix}`} >
          {filters[1].values.map((item, index) => <CheckBox checkColor={classes.grey} show={true} disable={false} key={index} checked={true} name={item} classes={classes.subGroup} color={getTopicColor(item) === '#989aa1' ? getFieldColor(item) : getTopicColor(item)} change={props.change} id={2} value={item} />)}
        </div>
      </div>
    </div>
  )
}

class CheckBox extends Component {  
  constructor (props) {
    super(props)
    this.state = {
      checked: this.props.checked
    }
    this.onChange = this.onChange.bind(this)
  }
  onChange () {
    this.setState({checked: !this.state.checked})
    this.props.change(this.props.id, this.props.value, 'a')
  }
  render () {
    const props = this.props
    const config = {disabled: props.disable}
    return (
      <div>
        <span className={props.classes} style={{color: props.color}} >{ props.name }</span>
        <input {...config} checked={this.state.checked} className={classes.CheckBox} type='checkbox' id={props.name} onChange={() => this.onChange(props.id, props.name, 'a')} />
        {props.show && <label className={classes.CheckBoxLabel + ' ' + props.checkColor } htmlFor={props.name} /> }
      </div>
    )
  }
}

export default SidebarFilterElementsNew
