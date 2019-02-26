/* eslint-disable no-multi-str */
import React from 'react'

import classes from './SidebarFilterElementsNew.css'
import {getFieldColor, getTopicColor} from '../../store/utility'

const SidebarFilterElementsNew = (props) => {
  const filters = props.filters
  return (
    <div className={classes.Body}>
      <div>
        <div>
          <CheckBox disable={true} checked={false} name={filters[0].name.toUpperCase()} classes={classes.Title} />
        </div>
        <div>
          {filters[0].subGroup.map((subGroup, sgIndex) => {
            const color = getTopicColor(subGroup.name) === '#989aa1' ? getFieldColor(subGroup.name) : getTopicColor(subGroup.name)
            return (
              <div key={sgIndex} >
                <CheckBox disable={true} checked={false} name={subGroup.name.toUpperCase()} classes={classes.subGroup} color={color} />
                <div>
                  {subGroup.values.map((name, nIndex) => {
                    return (
                      <CheckBox disable={false} key={nIndex} checked={true} name={name} classes={classes.subGroup} color={color} change={props.change} id={sgIndex === 3 ? 0 : 1} />
                    )
                  })}
                </div>
              </div>
            )        
          })}
        </div>
      </div>

      <div>
        <div>
          <CheckBox disable={true} checked={false} name={filters[1].name.toUpperCase()} classes={classes.Title} />
        </div>
        <div>
          {filters[1].values.map((item, index) => <CheckBox disable={false} key={index} checked={true} name={item} classes={classes.subGroup} color={getTopicColor(item) === '#989aa1' ? getFieldColor(item) : getTopicColor(item)} change={props.change} id={0} />)}
        </div>
      </div>
    </div>
  )
}

const CheckBox = (props) => {
  // console.log(props)
  const config = {disabled: props.disable}
  return (
    <div>
      <span className={props.classes} style={{color: props.color}} >{ props.name }</span>
      <input {...config} checked={props.checked} className={classes.CheckBox} type='checkbox' id={props.name} onChange={() => props.change(props.id, props.name, 'a')} />
      <label className={classes.CheckBoxLabel} htmlFor={props.name} />
    </div>
  )
}

export default SidebarFilterElementsNew
