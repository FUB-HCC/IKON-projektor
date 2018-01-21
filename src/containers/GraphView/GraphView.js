import React, {Component} from 'react'
import PetridishGraph from '../../components/PetridishGraph/PetridishGraph'
import classes from './GraphView.css'

class GraphView extends Component {
  render () {
    const Graph = (<PetridishGraph/>) // render conditional according to state
    return (
      <div className={classes.BackGradient}>
        <div className={classes.GraphContainer}>
          {Graph}
        </div>
      </div>
    )
  }
}

export default GraphView
