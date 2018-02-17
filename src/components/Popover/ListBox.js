import React from 'react'
import classes from './ListBox.css'

const ListBox = (props) => {
  const borderColor = props.color ? props.color : '#aaaaaa'
  const title = props.title ? props.title : 'TITLE'
  const list = props.list ? props.list : [{name: 'Chip-Name', color: '#AAA'}]

  const chips = list.map((l, i) => {
    return <div key={i} className={classes.chip} style={{backgroundColor: l.color}}>{l.name}</div>
  })

  return (
    <div className={classes.box} style={{borderColor: borderColor}}>
      <div style={{width: '100%', height: '32%'}}><h2 className={classes.title}>{title}</h2></div>
      <div className={classes.chipsframe} style={{width: '100%', height: '60%'}}>{chips}</div>
    </div>
  )
}

export default ListBox
