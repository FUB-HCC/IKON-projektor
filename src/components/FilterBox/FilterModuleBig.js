import React from 'react'

import classes from './FilterModuleBig.css'

const filterModuleBig = (props) => {
  const radioElements = props.keys.map((k, key) => {
    return (
      <div key={key} >
        <input
          onChange={() => props.changeHandler(props.id, k, 'a')}
          defaultChecked={true}
          className={classes.Input}
          type="checkbox"
          name={k}
          key={key}
          id={key}/>
        <label htmlFor={key}>{k}</label>
      </div>
    )
  })
  const height = 600 + 'px'
  return (
    <div style={{height: height}} className={classes.Module} onClick={() => null}>
      <form>
        {radioElements}
      </form>
    </div>
  )
}

export default filterModuleBig
