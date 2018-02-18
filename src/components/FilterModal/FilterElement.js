/* eslint-disable no-multi-str */
import React from 'react'

import classes from './FilterElement.css'
import {getFieldColor, getTopicColor, topicToField} from '../../store/utility'

const filterElement = (props) => {
  const filters = props.keys.sort(compare).map((k, key) => {
    const color = getTopicColor(k) === '#989aa1' ? getFieldColor(k) : getTopicColor(k)
    return (
      <div style={{width: props.keys.length > 15 ? '20%' : '25%', fontSize: props.keys.length > 15 ? '1.2vh' : '1.5vh'}}className={classes.Filter} key={key} >
        <input
          onChange={() => props.change(props.id, k, 'a')}
          checked={props.value.some(v => v === k)}
          className={classes.CheckBox}
          type="checkbox"
          name={k}
          key={key}
          id={k}/>
        <label className={classes.CheckBoxLabel} htmlFor={k}/>
        <span style={{color: color}}>{k}</span>
      </div>
    )
  })
  const expandedHeight = 70 + 85 * (Math.ceil(props.keys.length / 4)) + 'px'
  return (
    <div style={{height: props.open ? expandedHeight : '70px'}} className={classes.FilterElement}>
      <div className={classes.Title}>
        <div className={classes.Text}>
          {props.name.charAt(0).toUpperCase() + props.name.slice(1)}
          <span className={classes.Indicator}>{props.value.length}</span>
        </div>
        <svg cursor='pointer' height='60%' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' className={props.open ? classes.ButtonExpanded : classes.ButtonCollapsed} onClick={() => props.expand(props.id)}>
          <path fill='#fff' d='M3.352,48.296l28.56-28.328l28.58,28.347c0.397,0.394,0.917,0.59,1.436,0.59c0.52,0,1.04-0.196,1.436-0.59 c0.793-0.787,0.793-2.062,0-2.849l-29.98-29.735c-0.2-0.2-0.494-0.375-0.757-0.475c-0.75-0.282-1.597-0.107-2.166,0.456 L0.479,45.447c-0.793,0.787-0.793,2.062,0,2.849C1.273,49.082,2.558,49.082,3.352,48.296z'
          />
        </svg>
      </div>
      <div className={classes.Body}>
        {filters}
      </div>
    </div>
  )
}

export default filterElement

const compare = (a, b) => {
  if (topicToField(a) < topicToField(b)) return -1
  if (topicToField(a) > topicToField(b)) return 1
  return 0
}
