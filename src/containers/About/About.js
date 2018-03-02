import React, {Component} from 'react'
import classes from './About.css'
import NavigationSubpages from '../../components/NavigationSubpages/NavigationSubpages'

class About extends Component {
  render () {
    return (
      <div className={classes.BackGradient}>
        <NavigationSubpages/>
      </div>
    )
  }
}

export default About
