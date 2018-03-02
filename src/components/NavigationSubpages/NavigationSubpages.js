import React from 'react'
import classes from './NavigationSubpages.css'
let NavLink = require('react-router-dom').NavLink

const NavigationSubpages = () => {
  return (
    <ul className={classes.ContainerSub}>
      <li>
        <NavLink className={classes.NavigationElement} activeStyle={{color: '#f0faf0'}} to='/projects'>PROJEKTE</NavLink>
      </li>
      <li>
        <NavLink className={classes.NavigationElement} activeStyle={{color: '#f0faf0'}} to='/explore'>ERKUNDEN</NavLink>
      </li>
      <li>
        <NavLink className={classes.NavigationElement} activeStyle={{color: '#f0faf0'}} to='/discoveries'>ENTDECKUNG</NavLink>
      </li>
      <li>
        <NavLink className={classes.NavigationElement} activeStyle={{color: '#f0faf0'}} to='/about'>HILFE</NavLink>
      </li>
    </ul>
  )
}

export default NavigationSubpages
