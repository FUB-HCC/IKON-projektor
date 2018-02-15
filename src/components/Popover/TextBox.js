import React from 'react'
import classes from './TextBox.css'

const TextBox = (props) => {
  let fontSize
  switch (props.fontSize) {
    case 1:
      fontSize = '18px'
      break
    case 2:
      fontSize = '24px'
      break
    default:
      fontSize = '14px'
  }
  const borderColor = props.color ? props.color : '#aaaaaa'
  const textColor = props.color ? props.color : '#dddddd'

  return (
    <div className={classes.box} style={{borderColor: borderColor}}>
      <span className={classes.text} style={{color: textColor, fontSize: fontSize}}>{props.text}</span>
    </div>
  )
}

export default TextBox
