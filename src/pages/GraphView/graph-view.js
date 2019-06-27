import React, {Component} from 'react'
import {connect} from 'react-redux'
import ClusterMap from '../../components/ClusterMap/cluster-map'
import AreaChart from '../../components/AreaChart/area-chart'
import TimeGraph from '../../components/TimeLine/time-line'
import classes from './graph-view.module.css'
import * as actions from '../../store/actions/actions'

class GraphView extends Component {
  constructor (props) {
    super(props)
    this.state = {activePopover: this.props.selectedProject ? 1 : -1, height: window.innerHeight, width: window.innerWidth}
    this.changeModalHandler = this.changeModalHandler.bind(this)
    this.changeGraphHandler = this.changeGraphHandler.bind(this)
    this.projectClickHandler = this.projectClickHandler.bind(this)
  }

  componentDidMount () {
    window.addEventListener('resize', this.resize.bind(this))
    this.resize()
    this.props.fetchClusterData()
  }

  resize () {
    this.setState({width: window.innerWidth, height: window.innerHeight})
  }

  changeModalHandler (filter) {
    const newState = (filter === this.state.activePopover) ? -1 : filter
    this.setState({
      activePopover: newState
    })
    if (newState === -1) { this.props.deactivatePopover() }
  }

  projectClickHandler (project, vis) {
    this.props.activatePopover(project, vis)
    this.changeModalHandler(1)
  }

  changeGraphHandler (graph) {
    this.props.changeGraph(graph)
    this.setState({
      activePopover: -1
    })
  }

  render () {
    let Graph = (<ClusterMap/>) // render conditional according to state. Petridish rendered as default
    switch (this.props.graph) {
      case '0':
        Graph = (<ClusterMap height={this.state.height} width={this.state.width} onProjectClick={this.projectClickHandler}/>)
        break
      case '1':
        Graph = (<TimeGraph height={this.state.height} width={this.state.width} onProjectClick={this.projectClickHandler}/>)
        break
      case '2':
        Graph = (<AreaChart height={this.state.height} width={this.state.width} onProjectClick={this.projectClickHandler}/>)
        break
      default:
        break
    }
    
    return (
      <div className={classes.OuterDiv}>
        {Graph}
      </div>
    )
  }
}

const mapStateToProps = state => {
  let selectedProject
  state.main.data.forEach(project => {
    if (project.id === state.main.selectedProject) selectedProject = project
  })

  return {
    graph: state.main.graph,
    filterAmount: state.main.filter.length,
    selectedProject: state.main.selectedProject,
    selectedDataPoint: selectedProject,
    activeFilterCount: calculateActiveFilterCount(state.main.filter),
    filter: state.main.filter,
    filteredData: state.main.filteredData
  }
}

const calculateActiveFilterCount = (filter) => {
  let activeFilterCount = 0
  filter.forEach(f => { activeFilterCount += (f.distValues.length !== f.value.length ? 1 : 0) })
  return activeFilterCount
}

const mapDispatchToProps = dispatch => {
  return {
    fetchClusterData: () => dispatch(actions.fetchClusterData()),
    changeGraph: (value) => dispatch(actions.changeGraph(value)),
    activatePopover: (value, vis) => dispatch(actions.activatePopover(value, vis)),
    deactivatePopover: () => dispatch(actions.deactivatePopover())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphView)
