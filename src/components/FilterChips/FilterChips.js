import React, {Component} from 'react'
import classes from './FilterChips.css'
import PrimaryChip from './PrimaryChip'

class FilterChips extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeChip: -1
    }
    this.toggleSubChips = this.toggleSubChips.bind(this)
  }

  toggleSubChips (chipId) {
    const newState = chipId === this.state.activeChip ? -1 : chipId
    this.setState({
      activeChip: newState
    })
  }

  render () {
    const primaryChips = []
    for (let i = 0; i < this.props.amount; i++) {
      const expanded = this.state.activeChip === i
      primaryChips.push(<PrimaryChip key={i} expanded={expanded} toggle={this.toggleSubChips} filtId={i}/>)
    }
    return (
      <div className={classes.FullWidth}>
        {primaryChips}
      </div>
    )
  }
}

export default FilterChips
