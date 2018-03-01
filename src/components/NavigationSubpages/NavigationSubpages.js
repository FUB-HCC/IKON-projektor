import React from 'react'
import classes from './NavigationSubpages.css'
let NavLink = require('react-router-dom').NavLink

const NavigationSubpages = () => {
  return (
    <ul className={classes.ContainerSub}>
      <li>
        <NavLink activeClassName='active' to='/projects'>PROJEKTE</NavLink>
      </li>
      <li>
        <NavLink activeClassName='active' to='/graphview'>ERKUNDEN</NavLink>
      </li>
      <li>
        <NavLink activeClassName='active' to='/discoveries'>ENTDECKUNG</NavLink>
      </li>
      <li>
        <NavLink activeClassName='active' to='/about'>HILFE</NavLink>
      </li>
    </ul>
  )
}

export default NavigationSubpages
