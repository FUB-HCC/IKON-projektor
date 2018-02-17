import React, {Component} from 'react'
import {connect} from 'react-redux'
import FilterBox from '../../components/FilterBox/FilterBox'
import PetridishGraph from '../../components/PetridishGraph/PetridishGraph'
import AreaGraph from '../../components/AreaGraph/AreaGraph'
import TimeGraph from './TimeLine'
import ProjectModal from '../../components/Popover/Popover'
import FilterModal from '../../components/FilterModal/FilterModal'
import classes from './GraphView.css'
import * as actions from '../../store/actions/actions'
import Navigation from '../../components/Navigation/Navigation'

class GraphView extends Component {
  constructor (props) {
    super(props)
    this.state = {activePopover: -1, height: window.innerHeight, width: window.innerWidth}
    this.filterClickHandler = this.filterClickHandler.bind(this)
    this.changeGraphHandler = this.changeGraphHandler.bind(this)
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

  changeGraphHandler (graph) {
    this.props.changeGraph(graph)
    this.setState({
      activePopover: -1
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
        {this.props.selectedProject &&
        <ProjectModal data={this.props.selectedDataPoint} height={this.state.height}/>
        }
        <FilterModal/>
        <div style={{width: '100vw', height: '100vh', position: 'absolute'}} onClick={() => this.filterClickHandler(-1)}/>
        <div className={classes.FilterWrapper}>
          <Navigation active={this.props.graph} changeGraph={this.changeGraphHandler}/>
          <FilterBox activeBox={this.state.activePopover} change={this.filterClickHandler}/>
        </div>
        <div className={classes.graphFrame}>
          {Graph}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    graph: state.graph,
    selectedProject: state.selectedProject,
    selectedDataPoint: state.selectedProject ? state.data[state.selectedProject] : undefined
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: (value) => dispatch(actions.changeGraph(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphView)
