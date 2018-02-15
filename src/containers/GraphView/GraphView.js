import React, {Component} from 'react'
import {connect} from 'react-redux'
import FilterBox from '../../components/FilterBox/FilterBox'
import PetridishGraph from '../../components/PetridishGraph/PetridishGraph'
import AreaGraph from '../../components/AreaGraph/AreaGraph'
import TimeGraph from './TimeLine'
import Popover from '../../components/Popover/Popover'
import classes from './GraphView.css'
import * as actions from '../../store/actions/actions'
import Navigation from '../../components/Navigation/Navigation'

class GraphView extends Component {
  constructor (props) {
    super(props)
    this.state = {activePopover: -1, height: window.innerHeight, width: window.innerWidth}
    this.filterClickHandler = this.filterClickHandler.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.resize.bind(this))
    this.resize()
  }

  resize () {
    this.setState({width: window.innerWidth, height: window.innerHeight})
  }

  filterClickHandler (filter) {
    const newState = (filter === this.state.activePopover) ? -1 : filter
    this.setState({
      activePopover: newState
    })
  }

  render () {
    let Graph = (<PetridishGraph/>) // render conditional according to state. Petridish rendered as default
    switch (this.props.graph) {
      case '0':
        Graph = (<PetridishGraph/>)
        break
      case '1':
        Graph = (<TimeGraph height={this.state.height} width={this.state.width}/>)
        break
      case '2':
        Graph = (<AreaGraph/>)
        break
      default:
        break
    }
    return (
      <div className={classes.BackGradient}>
        <Popover hidden={this.props.popover.hidden} data={this.props.popover.element} height={this.state.height}/>
        <div style={{width: '100vw', height: '100vh', position: 'absolute'}} onClick={() => this.filterClickHandler(-1)}/>
        <div className={classes.FilterWrapper}>
          <Navigation changeGraph={this.props.changeGraph} active={this.props.graph}/>
          <FilterBox activeBox={this.state.activePopover} change={this.filterClickHandler}/>
        </div>
        <div>
          {Graph}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    graph: state.graph,
    popover: state.popover
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: (value) => dispatch(actions.changeGraph(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphView)
