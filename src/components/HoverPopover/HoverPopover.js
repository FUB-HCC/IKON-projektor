import React from 'react'
import classes from '../Visualizations/AreaChart/AreaChart.css'

const HoverPopover = (props) => {
  let {locationX, locationY, width, height} = props
  if (!width) { width = `30em` }
  if (!height) { height = `10em` }

  return <div className={classes.popover_body} style={{
    width: width, // TODO dynamically style width
    height: height, // TODO dynamically style height
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
