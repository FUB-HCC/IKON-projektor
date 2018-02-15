import React, {Component} from 'react'
import RadioModule from './RadioModule'
import FreeModule from './FreeModule'
import {connect} from 'react-redux'
import {getData} from '../../assets/data'
import {fieldsIntToString} from '../../store/utility'
import classes from './FilterBox.css'
import * as actions from '../../store/actions/actions'

class FilterBox extends Component {
  render () {
    const renderedFilters = this.props.filters.map((filter, key) => {
      const activeStyle = this.props.activeBox === key ? {borderLeft: 'white solid 1px'} : null
      return (
        <div key={key} className={classes.Filter1}>
          <div style={activeStyle} className={classes.ClickListener} onClick={() => this.props.change(key)}/>
          {filter.name.charAt(0).toUpperCase() + filter.name.slice(1)}
          {this.props.activeBox === key ? getFilter(filter.keys, filter.name, key, this.props.toggleAllFilters, this.props.filterChangeHandler, filter.value) : null}
        </div>
      )
    })

    return (
      <div className={classes.FilterBox}>
        <div className={classes.Header}>FILTER</div>
        {renderedFilters}
      </div>

    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    filterChangeHandler: (filterId, value, form) => dispatch(actions.filterChange(filterId, value, form)),
    toggleAllFilters: (key, filters) => dispatch(actions.toggleAllFilters(key, filters))
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

    filters.push({name: filter.key, keys: distinctValues, value: filter.value})
  })
  return {
    filters: filters
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterBox)

const getFilter = (keys, name, id, toggleHandler, changeHandler, value) => {
  let filterKeys, filterValue
  id === 0 ? filterKeys = keys.map(k => fieldsIntToString(k)) : filterKeys = keys
  id === 0 ? filterValue = value.map(v => fieldsIntToString(v)) : filterValue = value
  if (keys.length < 16) return <RadioModule toggleHandler={toggleHandler} changeHandler={changeHandler} name={name} id={id} keys={filterKeys} value={filterValue}/>
  else return <FreeModule changeHandler={changeHandler} name={name} id={id} keys={filterKeys} value={value}/>
}
