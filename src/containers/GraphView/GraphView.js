import React, {Component} from 'react'
import {connect} from 'react-redux'
import FilterBox from '../../components/FilterBox/FilterBox'
import PetridishGraph from '../../components/PetridishGraph/PetridishGraph'
import AreaGraph from '../../components/AreaGraph/AreaGraph'
import TimeGraph from './TimeGraph'
import classes from './GraphView.css'
import * as actions from '../../store/actions/actions'
import Navigation from '../../components/Navigation/Navigation'

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
          <button style={{width: '33%'}} onClick={() => this.props.changeGraph('0')}> Petri </button>
          <button style={{width: '33%'}} onClick={() => this.props.changeGraph('1')}> Time </button>
          <button style={{width: '33%'}} onClick={() => this.props.changeGraph('2')}> Area </button>
          <FilterBox type={0}/>
        </div>

        <Navigation changeGraph={this.props.changeGraph} active={this.props.graph}/>

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
    changeGraph: (value) => dispatch(actions.changeGraph(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphView)
