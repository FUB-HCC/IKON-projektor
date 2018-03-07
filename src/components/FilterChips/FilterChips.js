import React from 'react'
import classes from './FilterChips.css'
import PrimaryChip from './PrimaryChip'

const filterChips = (props) => {
  const primaryChips = []
  for (let i = 0; i < props.amount; i++) {
    primaryChips.push(<PrimaryChip key={i} filtId={i}/>)
  }
  return (
    <div className={classes.FullWidth}>
      {primaryChips}
    </div>
  )
}

export default filterChips
