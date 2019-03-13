import React, {Component} from 'react'
import classes from '../combined.css'
import {connect} from 'react-redux'
import * as actions from '../../store/actions/actions'
import logo from '../../assets/ikon_logo.png'

class NavigationSubpages extends Component {
  constructor (props) {
    super(props)
    this.changeGraphHandler = this.changeGraphHandler.bind(this)
    this.state = {
      active: 'WISSEN'
    }
  }  

  changeGraphHandler (graph) {   
    console.log(this.state, graph)
     
    if (graph === '0') {
      this.setState({active: 'WISSEN'})
    }
    if (graph === '1') {    
      this.setState({active: 'ZEIT'})
    }
    if (graph === '2') {
      this.setState({active: 'RAUM'})
    }
    console.log(this.state, graph)
    this.props.changeGraph(graph)
    this.setState({
      activePopover: -1
    })
  }
  render () {
    return (
      <div className={classes.navbar}>
        <div className={classes.leftpanel}>
          <ul className={classes.ContainerSub}>
            <li>
              <a className={classes.NavigationElement + ' ' + classes.logo} to='/projects'><img src={logo} /></a>
            </li>
            <li>
              <a className={classes.NavigationElement + ' ' + ((this.state.active === 'WISSEN') ? classes.active : '')} onClick={() => this.changeGraphHandler('0')}>WISSEN <small className={classes.smallHeadTxt}>Projekte in Clustern</small> </a>
            </li>
            <li>
              <a className={classes.NavigationElement + ' ' + ((this.state.active === 'ZEIT') ? classes.active : '') } onClick={() => this.changeGraphHandler('1')}>ZEIT <small className={classes.smallHeadTxt}>Anzahl der Projekte uber Jahre</small> </a>
            </li>
            <li>
              <a className={classes.NavigationElement + ' ' + ((this.state.active === 'RAUM') ? classes.active : '')} onClick={() => this.changeGraphHandler('2')}>RAUM</a>
            </li>
          </ul>
        </div>
        <div className={classes.rightPanel}>
          <ul>
            <li>
              <a className={classes.NavigationRightElement}>SUCHE</a>
            </li>
            <li>
              <a className={classes.NavigationRightElement}>MENU</a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: (value) => dispatch(actions.changeGraph(value)),
    activatePopover: (value, vis) => dispatch(actions.activatePopover(value, vis)),
    deactivatePopover: () => dispatch(actions.deactivatePopover())
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
    filter: state.main.filter,
    filteredData: state.main.filteredData
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationSubpages)
