import React from 'react'
import classes from './TextBox.css'

const TextBox = (props) => {
  let fontSize
  switch (props.fontSize) {
    case 1:
      fontSize = '0.9vh'
      break
    case 2:
      fontSize = '1.5vh'
      break
    default:
      fontSize = '1.3vh'
  }
  const wikilinkActive = props.text === '-keine Beschreibung verfügbar-'
  const borderColor = props.color ? props.color : '#989aa1'
  const textColor = props.color ? props.color : '#f0faf0'
  const title = props.title ? props.title : null

  return (
    <div className={classes.box} style={{borderColor: borderColor}}>
      {title &&
      <div className={classes.title}>{title}</div>
      }
      <span className={classes.text} style={{color: textColor, fontSize: fontSize}}>{props.text} {wikilinkActive &&
      <span>... in <a href={props.wikiHref}>WIKI</a> bearbeiten </span>
      }
      </span>
    </div>
  )
}

export default TextBox
