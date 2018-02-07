import React from 'react'

import classes from './FilterModuleSmall.css'

const filterModuleSmall = (props) => {
  const radioElements = props.keys.map((k, key) => {
    return (
      <div key={key} >
        <input
          onChange={() => props.changeHandler(props.id, k, 'a')}
          defaultChecked={props.value.some(v => v === k)}
          className={classes.Input}
          type="checkbox"
          name={k}
          key={key}
          id={key}/>
        <label htmlFor={key}>{k}</label>
      </div>
    ) 
  })
  const height = 100 * props.keys.length + 'px'
  return (
    <div style={{height: height}} className={classes.Module} onClick={() => null}>
      <form>
        {radioElements}
      </form>
    </div>
  )
}

export default filterModuleSmall
