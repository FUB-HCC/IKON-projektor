import React, {Component} from 'react'
import classes from './Discoveries.css'
import NavigationSubpages from '../../components/NavigationSubpages/NavigationSubpages'

class Discoveries extends Component {
  render () {
    return (
      <div className={classes.BackGradient}>
        <NavigationSubpages/>
      </div>
    )
  }
}

export default Discoveries
