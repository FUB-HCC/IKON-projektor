import React from 'react'
import {connect} from 'react-redux'
import aGraph from '../../assets/Field.png'
import {default as AreaChartVis} from '../../components/Visualizations/AreaChart'
import * as actions from '../../store/actions/actions'

class AreaChart extends React.Component {
  componentDidMount () {
    // initialize Class here
    // you can get current height with 'props.height' and width with 'props.width'
    // you can get all props defined below[in mapStateToProps] with 'this.props.<name>'
    // if you need any more you can define them there (and you can take anything from the statevas a prop
    this.Graph = new AreaChartVis()
  }

  componentDidUpdate () {
    // update data or size here
    // you can get current height with 'props.height' and width with 'props.width'
    this.Graph.updateData()
  }

  render () {
    if (this.props.isVisActive) {
      return (<svg id={this.props.target}/>)
    } else {
      return (<div><img src={aGraph}/></div>)
    }
  }
}

const mapStateToProps = state => ({
  data: state.main.filteredData, // zu visualisierende Daten (immer up-to-date)
  target: 'graph', // id of the target svg tag
  isVisActive: false // change to true for rendering of true visualization
  // this is also a good place to prepare the data since the data given to the visualization is then minimal
})

const mapDispatchToProps = dispatch => {
  return {
    // function-prop to activate popover - ask for details on how to use, can be given to the class with 'this.props.activatePopover'. Defined in actions and reducer.
    activatePopover: (value) => dispatch(actions.activatePopover(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AreaChart)
