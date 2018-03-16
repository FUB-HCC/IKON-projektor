import React, {Component} from 'react'
import classes from './Chip.css'
import {connect} from 'react-redux'
import SecondaryChips from './SecondaryChip'
import * as actions from '../../store/actions/actions'

class PrimaryChip extends Component {
  render () {
    const filter = this.props.filter[this.props.filtId]
    let secChips = filter.value.map(f => <SecondaryChips key={f} val={f} id={this.props.filtId} pop={this.props.popFilter}/>)
    if (secChips.length === 0) return null
    return (
      <div className={classes.ChipContainer}>
        <div className={classes.Chip}>
          <span className={classes.Caption}>{filter.name}</span>
          <div className={classes.Indicator}><div className={classes.IndicatorDigit}>{filter.value.length}</div></div>
        </div>
        <div className={classes.SubChips} style={this.props.expanded ? {maxWidth: '260vh'} : {maxWidth: '0'}}>{secChips}</div>
        <div className={classes.ExpandCollapse} onClick={() => this.props.toggle(this.props.filtId)}>{this.props.expanded ? '<<' : '>>'}</div>
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
