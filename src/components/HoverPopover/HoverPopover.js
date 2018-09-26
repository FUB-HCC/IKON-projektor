import React from 'react'
import classes from '../Visualizations/AreaChart/AreaChart.css'

const HoverPopover = (props) => {
  let {locationX, locationY} = props

  return <div className={classes.popover_body} style={{
    width: `30em`, // TODO dynamically style width
    height: `10em`, // TODO dynamically style height
    margin: `1.5em`,
    position: 'absolute',
    left: locationX + 'px',
    top: locationY + 'px',
    backgroundColor: 'rgba(67, 64, 88, 0.8)',
    display: 'flex',
    flexWrap: 'wrap',
    zIndex: 99,
    bottom: 0,
    right: 0
  }}>
    {props.children}
  </div>
}

export default HoverPopover
