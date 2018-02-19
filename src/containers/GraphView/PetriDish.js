import React from 'react'
import {connect} from 'react-redux'
import {default as PetriDishGraph} from '../../components/Visualizations/PetriDish/PetriDish'
import * as actions from '../../store/actions/actions'

class PetriDish extends React.Component {
  componentDidMount () {
    this.Graph = new PetriDishGraph('#' + this.props.target, this.props.data, this.props.width, this.props.height, this.props.onProjectClick)
  }

  componentDidUpdate () {
    this.Graph.updateData(this.props.data, this.props.width, this.props.height)
  }

  render () {
    return (
      <svg id={this.props.target}/>
    )
  }
}

const mapStateToProps = state => ({
  data: state.filteredData,
  target: 'graph'

})

const mapDispatchToProps = dispatch => {
  return {
    activatePopover: (value) => dispatch(actions.activatePopover(value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PetriDish)
