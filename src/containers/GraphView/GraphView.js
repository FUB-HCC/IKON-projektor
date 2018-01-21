import React, {Component} from 'react'
import {connect} from 'react-redux'

import PetridishGraph from '../../components/PetridishGraph/PetridishGraph'
import AreaGraph from '../../components/AreaGraph/AreaGraph'
import TimeGraph from '../../components/TimeGraph/TimeGraph'
import classes from './GraphView.css'
import * as actions from '../../store/actions/actions'

class GraphView extends Component {
  render () {
    let Graph = this.props.graph // render conditional according to state
    switch (Graph) {
      case '0':
        Graph = (<PetridishGraph/>)
        break
      case '1':
        Graph = (<TimeGraph/>)
        break
      case '2':
        Graph = (<AreaGraph/>)
        break
      default:
        Graph = (<PetridishGraph/>)
    }
    return (
      <div className={classes.BackGradient}>
        <div className={classes.GraphContainer} onClick={this.props.testingOfUrl}>
          {Graph}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    graph: state.graph
  }
}

const mapDispatchToProps = dispatch => {
  return {
    testingOfUrl: () => dispatch(actions.stateUpdatesUrl())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphView)
