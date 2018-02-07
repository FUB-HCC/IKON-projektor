import React, {Component} from 'react'
import FilterModuleSmall from './FilterModuleSmall'
import FilterModuleBig from './FilterModuleBig'
import FilterModuleFree from './FilterModuleFree'
import {connect} from 'react-redux'
import {getData} from '../../assets/data'
import classes from './FilterBox.css'
import * as actions from '../../store/actions/actions'

class FilterBox extends Component {
  constructor (props) {
    super(props)
    this.state = {activePopover: -1}
  }

  filterClickHandler (filter) {
    const newState = (filter === this.state.activePopover) ? -1 : filter
    this.setState({
      activePopover: newState
    })
  }

  render () {
    const renderedFilters = this.props.filters.map((filter, key) => {
      return (
        <div key={key} className={classes.Filter1}>
          <div className={classes.ClickListener} onClick={() => this.filterClickHandler(key)}/>
          <span className={classes.filterText}> {filter.name} </span>
          {this.state.activePopover === key ? getFilter(filter.keys, filter.name, key, this.props.filterChangeHandler, filter.value) : null}
        </div>
      )
    })

    return (
      <div className={classes.FilterBox}>
        <div className={classes.Header}>Filter</div>
        {renderedFilters}
      </div>

    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    filterChangeHandler: (filterId, value, form) => dispatch(actions.filterChange(filterId, value, form))
  }
}

const mapStateToProps = state => {
  let filters = []
  const data = getData()
  state.filter.map((filter) => {
    const distinctValues = []
    Object.keys(data).forEach(dataEntries => {
      Object.keys(data[dataEntries]).forEach(dataKeys => {
        if (dataKeys === filter.key) {
          if (!distinctValues.some(e => e === data[dataEntries][filter.key])) {
            distinctValues.push(data[dataEntries][filter.key])
          }
        }
      })
    })
    filters.push({name: filter.name, keys: distinctValues, value: filter.value})
  })
  return {
    filters: filters
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterBox)

const getFilter = (keys, name, id, changeHandler, value) => {
  if (keys.length < 6) return <FilterModuleSmall changeHandler={changeHandler} name={name} id={id} keys={keys} value={value} />
  else if (keys.length < 16) return <FilterModuleBig changeHandler={changeHandler} name={name} id={id} keys={keys} value={value}/>
  else return <FilterModuleFree changeHandler={changeHandler} name={name} id={id} keys={keys}/>
}
