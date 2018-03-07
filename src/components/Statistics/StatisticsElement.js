import React from 'react'
import classes from './StatisticsElement.css'

const StatisticsElement = (props) => {
  const color = props.color ? props.color : '#f0faf0'
  return (
    <div className={classes.outerDiv}>
      <p className={classes.title} style={{color: color}}>{props.title}:</p>
      <p className={classes.content} style={{color: color}}>{props.content}</p>
    </div>
  )
}

export default StatisticsElement
