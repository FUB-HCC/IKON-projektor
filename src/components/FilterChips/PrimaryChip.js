import React, {Component} from 'react'
import classes from './Chip.css'
import {connect} from 'react-redux'
import SecondaryChips from './SecondaryChip'
import * as actions from '../../store/actions/actions'

class PrimaryChip extends Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }
    this.toggleSubChips = this.toggleSubChips.bind(this)
  }

  toggleSubChips () {
    const newState = !this.state.expanded
    this.setState({
      expanded: newState
    })
  }

  render () {
    const filter = this.props.filter[this.props.filtId]
    let secChips = filter.value.map(f => <SecondaryChips key={f} val={f} id={this.props.filtId} pop={this.props.popFilter}/>)
    if (secChips.length === 0) return null
    return (
      <div className={classes.ChipContainer}>
        <div className={classes.Chip}>
          {filter.name}
          <div className={classes.Indicator}><div className={classes.IndicatorDigit}>{filter.value.length}</div></div>
        </div>
        <div className={classes.SubChips} style={this.state.expanded ? {width: '100%'} : {width: '0'}}>{secChips}</div>
        <div className={classes.ExpandCollapse} onClick={this.toggleSubChips}>{this.state.expanded ? '<<' : '>>'}</div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    filter: state.main.filter
  }
}
const mapDispatchToProps = dispatch => {
  return {
    popFilter: (filterId, value) => dispatch(actions.filterChange(filterId, value))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryChip)
