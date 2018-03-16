import React from 'react'
import classes from './SecondaryChip.css'
import {getColor} from '../../store/utility'
import exit from '../../assets/Exit.svg'

const secondaryChips = (props) => {
  const style = {background: getColor(props.val)}
  const tooltip = props.val
  const labelString = props.val.length > 30 ? props.val.slice(0, 30) + '...' : props.val
  return (
    <div style={style} className={classes.Chip} title={tooltip}>
      <nobr style={{marginTop: '0.2vh'}}>{labelString}</nobr>
      <div className={classes.PopButton} onClick={() => props.pop(props.id, props.val)}><img src={exit}/></div>
    </div>
  )
}

export default secondaryChips
