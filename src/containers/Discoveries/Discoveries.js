import React, {Component} from 'react'
import classes from './Discoveries.css'
import NavigationSubpages from '../../components/NavigationSubpages/NavigationSubpages'

class Discoveries extends Component {
  render () {
    return (
      <div className={classes.BackGradient}>
        <NavigationSubpages/>
        <h1>Entdeckung</h1>
      </div>
    )
  }
}

export default Discoveries
