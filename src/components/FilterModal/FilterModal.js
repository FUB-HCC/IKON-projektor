import React, {Component} from 'react'
import classes from './FilterModal.css'
import FilterElement from './FilterElement'
import {getData} from '../../assets/data'
import {connect} from 'react-redux'

class FilterModal extends Component {
  render () {
    console.log(this.props.filters)
    const filterElements = this.props.filters.map((filter, key) => <FilterElement key={key} name={filter.name}/>)
    return (
      <div className={classes.FilterModal}>
        {filterElements}
      </div>
    )
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

export default connect(mapStateToProps)(FilterModal)
