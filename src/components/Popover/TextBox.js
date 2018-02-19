import React from 'react'
import classes from './TextBox.css'

const TextBox = (props) => {
  let fontSize
  switch (props.fontSize) {
    case 1:
      fontSize = '0.7vh'
      break
    case 2:
      fontSize = '1.3vh'
      break
    default:
      fontSize = '0.9vh'
  }
  const borderColor = props.color ? props.color : '#B0B0B0'
  const textColor = props.color ? props.color : '#dddddd'

  return (
    <div className={classes.box} style={{borderColor: borderColor}}>
      <span className={classes.text} style={{color: textColor, fontSize: fontSize}}>{props.text}</span>
    </div>
  )
}

export default TextBox
