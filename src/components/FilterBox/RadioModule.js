import React from 'react'

import classes from './RadioModule.css'

const filterModuleBig = (props) => {
  const margin = '20px'
  const height = margin * 2 * props.keys.length + 'px'
  const radioElements = props.keys.map((k, key) => {
    return (
      <div style={{marginTop: margin, marginBottom: margin}} className={classes.Filter} key={key} >
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
  return (
    <div style={{height: height}} className={classes.Module} onClick={() => null}>
      <form>
        {radioElements}
      </form>
    </div>
  )
}

export default filterModuleBig
