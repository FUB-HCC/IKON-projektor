import React, {Component} from 'react'
import PetridishGraph from '../../components/PetridishGraph/PetridishGraph'
import AreaGraph from '../../components/AreaGraph/AreaGraph'
import TimeGraph from '../../components/TimeGraph/TimeGraph'
import classes from './GraphView.css'

class GraphView extends Component {
  render () {
    let Graph = 1 // render conditional according to state
    switch (Graph) {
      case 0:
        Graph = (<PetridishGraph/>)
        break
      case 1:
        Graph = (<TimeGraph/>)
        break
      case 2:
        Graph = (<AreaGraph/>)
        break
      default:
        Graph = null
    }

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
