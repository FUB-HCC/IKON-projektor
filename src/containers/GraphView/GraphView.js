import React, {Component} from 'react'
import {connect} from 'react-redux'
import {default as PetriDishGraph} from './PetriDish'
import {default as AreaChart} from './AreaChart'
import TimeGraph from './TimeLine'
import ProjectModal from '../../components/Popover/Popover'
import FilterModal from '../../components/FilterModal/FilterModal'
import classes from './GraphView.css'
import * as actions from '../../store/actions/actions'
import Navigation from '../../components/Navigation/Navigation'
import Aux from '../../hoc/AuxComponent/AuxComponent'

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
    let Graph = (<PetriDishGraph/>) // render conditional according to state. Petridish rendered as default
    switch (this.props.graph) {
      case '0':
        Graph = (<PetriDishGraph height={this.state.height} width={this.state.width} onProjectClick={this.projectClickHandler}/>)
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
    let modal = null
    if (this.state.activePopover === 1) {
      modal =
        <Aux>
          <div style={{width: '100vw', height: '100vh', position: 'absolute'}} onClick={() => this.changeModalHandler(-1)}/>
          <ProjectModal data={this.props.selectedDataPoint} height={this.state.height} closeModal = {() => this.changeModalHandler(-1)}/>
        </Aux>
    } else if (this.state.activePopover === 2) {
      modal =
        <Aux>
          <div style={{width: '100vw', height: '100vh', position: 'absolute'}} onClick={() => this.changeModalHandler(-1)}/>
          <FilterModal/>
        </Aux>
    }
    return (
      <div className={classes.OuterDiv}>
        {modal}
        <div className={classes.FilterWrapper}>
          <Navigation active={this.props.graph} changeGraph={this.changeGraphHandler}/>
          <div className={classes.FilterButton}>
            <div className={classes.FilterButtonHeader}>FILTER</div>
            <div className={classes.FilterButtonBody} onClick={() => this.changeModalHandler(2)}>
              <div className={classes.Button}>
                <div className={classes.FilterIndicator}>{this.props.activeFilterCount}</div>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' height='100%'>
                  <path fill={this.state.activePopover === 2 ? '#f0faf0' : '#989aa1'} d='M349.1,52.8c4.2,4.2,6.2,8.1,6.2,11.9v254.5c0,3.8-2.1,7.8-6.2,11.9c-4.2,4.2-8.1,6.2-11.9,6.2H73.5c-3.8,0-7.8-2.1-11.9-6.2s-6.2-8.1-6.2-11.9V64.7c0-3.8,2.1-7.8,6.2-11.9s8.1-6.2,11.9-6.2h263.6C341,46.5,344.9,48.6,349.1,52.8zM346.3,64.7c0-1.3-1.2-3.2-3.6-5.5c-2.4-2.4-4.2-3.6-5.5-3.6H73.5c-1.3,0-3.2,1.2-5.5,3.6c-2.4,2.4-3.6,4.2-3.6,5.5v254.5c0,1.3,1.2,3.2,3.6,5.5c2.4,2.4,4.2,3.6,5.5,3.6h263.6c1.3,0,3.2-1.2,5.5-3.6c2.4-2.4,3.6-4.2,3.6-5.5V64.7z M145.4,201.9c3.6,3.6,5.4,7.9,5.4,12.8c0,4.9-1.8,9.2-5.4,12.8c-3.6,3.6-7.9,5.4-12.8,5.4c-4.9,0-9.2-1.8-12.8-5.4c-3.6-3.6-5.4-7.9-5.4-12.8c0-4.9,1.8-9.2,5.4-12.8c3.6-3.6,7.9-5.4,12.8-5.4C137.6,196.5,141.8,198.3,145.4,201.9z M139,221.1c1.8-1.8,2.7-3.9,2.7-6.4c0-2.5-0.9-4.6-2.7-6.4s-3.9-2.7-6.4-2.7c-2.5,0-4.6,0.9-6.4,2.7c-1.8,1.8-2.7,3.9-2.7,6.4c0,2.5,0.9,4.6,2.7,6.4c1.8,1.8,3.9,2.7,6.4,2.7C135.1,223.8,137.2,222.9,139,221.1z M129.4,181.6c-0.9-0.9-1.3-1.9-1.3-3.3V96.5c0-1.3,0.4-2.4,1.3-3.3c0.9-0.9,1.9-1.3,3.3-1.3s2.4,0.4,3.3,1.3c0.9,0.9,1.3,1.9,1.3,3.3v81.8c0,1.3-0.4,2.4-1.3,3.3c-0.9,0.9-1.9,1.3-3.3,1.3S130.2,182.5,129.4,181.6z M135.9,247.8c0.9,0.9,1.3,1.9,1.3,3.3v27.3c0,1.3-0.4,2.4-1.3,3.3c-0.9,0.9-1.9,1.3-3.3,1.3s-2.4-0.4-3.3-1.3c-0.9-0.9-1.3-1.9-1.3-3.3v-27.3c0-1.3,0.4-2.4,1.3-3.3c0.9-0.9,1.9-1.3,3.3-1.3S135,247,135.9,247.8zM218.1,101.9c3.6,3.6,5.4,7.9,5.4,12.8s-1.8,9.2-5.4,12.8c-3.6,3.6-7.9,5.4-12.8,5.4c-4.9,0-9.2-1.8-12.8-5.4c-3.6-3.6-5.4-7.9-5.4-12.8s1-9.2,5.4-12.8c3.6-3.6,7.9-5.4,12.8-5.4C210.3,96.5,214.5,98.3,218.1,101.9z M211.8,121.1c1.8-1.8,2.7-3.9,2.7-6.4s-0.9-4.6-2.7-6.4c-1.8-1.8-3.9-2.7-6.4-2.7c-2.5,0-4.6,0.9-6.4,2.7c-1.8,1.8-2.7,3.9-2.7,6.4s0.9,4.6,2.7,6.4s3.9,2.7,6.4,2.7C207.8,123.8,210,122.9,211.8,121.1z M208.6,147.8c0.9,0.9,1.3,1.9,1.3,3.3v127.3c0,1.3-0.4,2.4-1.3,3.3c-0.9,0.9-1.9,1.3-3.3,1.3c-1.3,0-2.4-0.4-3.3-1.3c-0.9-0.9-1.3-1.9-1.3-3.3V151.1c0-1.3,0.4-2.4,1.3-3.3c0.9-0.9,1.9-1.3,3.3-1.3C206.7,146.5,207.8,147,208.6,147.8z M290.9,247.4c3.6,3.6,5.4,7.9,5.4,12.8c0,4.9-1.8,9.2-5.4,12.8c-3.6,3.6-7.9,5.4-12.8,5.4c-4.9,0-9.2-1.8-12.8-5.4c-3.6-3.6-5.4-7.9-5.4-12.8c0-4.9,1.8-9.2,5.4-12.8c3.6-3.6,7.9-5.4,12.8-5.4C283,242,287.3,243.8,290.9,247.4z M284.5,266.6c1.8-1.8,2.7-3.9,2.7-6.4s-0.9-4.6-2.7-6.4c-1.8-1.8-3.9-2.7-6.4-2.7c-2.5,0-4.6,0.9-6.4,2.7c-1.8,1.8-2.7,3.9-2.7,6.4s0.9,4.6,2.7,6.4c1.8,1.8,3.9,2.7,6.4,2.7C280.5,269.3,282.7,268.4,284.5,266.6zM274.8,227.1c-0.9-0.9-1.3-1.9-1.3-3.3V96.5c0-1.3,0.4-2.4,1.3-3.3s1.9-1.3,3.3-1.3c1.3,0,2.4,0.4,3.3,1.3s1.3,1.9,1.3,3.3v127.3c0,1.3-0.4,2.4-1.3,3.3c-0.9,0.9-1.9,1.3-3.3,1.3C276.8,228.3,275.7,227.9,274.8,227.1z'
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        {Graph}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    graph: state.main.graph,
    selectedProject: state.main.selectedProject,
    selectedDataPoint: state.main.selectedProject ? state.main.data[state.main.selectedProject] : undefined,
    activeFilterCount: calculateActiveFilterCount(state.main.filter)
  }
}

const calculateActiveFilterCount = (filter) => {
  let activeFilterCount = 0
  filter.forEach(f => { activeFilterCount += (f.distValues.length !== f.value.length ? 1 : 0) })
  return activeFilterCount
}

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: (value) => dispatch(actions.changeGraph(value)),
    activatePopover: (value, vis) => dispatch(actions.activatePopover(value, vis)),
    deactivatePopover: () => dispatch(actions.deactivatePopover())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphView)
