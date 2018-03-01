import React, {Component} from 'react'
import classes from './Projects.css'
import NavigationSubpages from '../../components/NavigationSubpages/NavigationSubpages'

class Projects extends Component {
  render () {
    return (
      <div className={classes.BackGradient}>
        <NavigationSubpages/>
        <h1>Projekte</h1>
      </div>
    )
  }
}

export default Projects
