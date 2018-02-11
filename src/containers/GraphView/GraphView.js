import React, {Component} from 'react'
import {connect} from 'react-redux'
import FilterBox from '../../components/FilterBox/FilterBox'
import PetridishGraph from '../../components/PetridishGraph/PetridishGraph'
import AreaGraph from '../../components/AreaGraph/AreaGraph'
import TimeGraph from './TimeLine'
import classes from './GraphView.css'
import * as actions from '../../store/actions/actions'

class GraphView extends Component {
  render () {
    let Graph = (<PetridishGraph/>) // render conditional according to state. Petridish rendered as default
    switch (this.props.graph) {
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
        break
    }
    return (
      <div className={classes.BackGradient}>
        <div className={classes.FilterWrapper}>
          <button style={{width: '33%'}} onClick={() => this.props.testingOfFilterUp('0')}> Petri </button>
          <button style={{width: '33%'}} onClick={() => this.props.testingOfFilterUp('1')}> Time </button>
          <button style={{width: '33%'}} onClick={() => this.props.testingOfFilterUp('2')}> Area </button>
          <FilterBox type={0}/>
        </div>
        <div className={classes.GraphContainer}>
          {/* added Buttons for Filter Testing */}
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
    testingOfFilterUp: (key, value) => dispatch(actions.changeGraph(key, value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphView)
