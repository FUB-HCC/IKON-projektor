import React, {Component} from 'react'
import classes from './Sidebar.css'
import {connect} from 'react-redux'
import * as actions from '../../store/actions/actions'
import SidebarFilterElements from './SidebarFilterElements'

class Sidebar extends Component {
  constructor (props) {
    super(props)
    const expFilters = new Array(this.props.filters.length)
    expFilters.fill(true)
    this.state = {expandedFilters: expFilters, value: ''}
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (event) {
    this.setState({value: event.target.value})
  }
  render () {  
    console.log(this.props.filters, 'this.props.filters')      
    const filterElements = this.props.filters.map((filter, key) => filter.type === 'a'
      ? <SidebarFilterElements id={key} key={key} name={filter.name} keys={filter.distValues} value={filter.value} open={this.state.expandedFilters[key]} change={this.props.filterChangeHandler} expand={this.handleFilterExpand}/> : null)
    return (
      <div className={classes.FilterModal}>
        <div className={classes.CheckBoxes}>
          {filterElements}
        </div>
        <div className={classes.TextSearch}>
          <div className={classes.SearchField}>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' height='80%'>
              <path fill='#A19EAB' d='M187.3,57.3c11.5,4.9,21.5,11.7,30,20.2c8.5,8.5,15.2,18.5,20.2,30s7.4,23.7,7.4,36.6c0,12.1-2.2,23.6-6.6,34.5c-4.4,10.8-10.4,20.4-18.1,28.9c0.2,0.2,0.4,0.3,0.6,0.4c0.2,0.1,0.3,0.2,0.3,0.4l19.3,19.3c3.5-2.1,7.4-2.8,11.5-2.4s7.6,2.1,10.4,4.9l75.9,76.2c1.7,1.7,3,3.6,3.9,5.7c0.9,2.1,1.4,4.4,1.4,6.9s-0.5,4.7-1.4,6.9c-0.9,2.1-2.2,4.1-3.9,5.7c-1.7,1.7-3.6,3-5.7,3.9c-2.1,0.9-4.4,1.4-6.9,1.4c-2.4,0-4.7-0.5-6.9-1.4c-2.1-0.9-4.1-2.2-5.7-3.9l-76.2-75.9c-1.7-1.7-2.9-3.6-3.8-5.9c-0.8-2.2-1.3-4.5-1.3-6.7c0-1.7,0.2-3.3,0.6-4.9c0.4-1.6,1-3,2-4.3l-19.3-19.3c-0.2,0-0.3-0.1-0.4-0.3s-0.2-0.4-0.4-0.6c-8.4,7.7-18,13.7-28.9,18.1c-10.8,4.4-22.3,6.6-34.5,6.6c-12.9,0-25.1-2.5-36.6-7.4s-21.5-11.7-30-20.2S69,192,64,180.6c-4.9-11.5-7.4-23.7-7.4-36.6s2.5-25.1,7.4-36.6s11.7-21.5,20.2-30s18.5-15.2,30-20.2s23.7-7.4,36.6-7.4S175.8,52.4,187.3,57.3z M183.9,222.4c10.4-4.5,19.4-10.6,27-18.2c7.7-7.7,13.7-16.7,18.2-27s6.7-21.4,6.7-33.2s-2.2-22.8-6.7-33.2s-10.6-19.4-18.2-27s-16.7-13.7-27-18.2c-10.4-4.5-21.4-6.7-33.2-6.7c-11.8,0-22.8,2.2-33.2,6.7s-19.4,10.6-27,18.2s-13.7,16.7-18.2,27c-4.5,10.4-6.7,21.4-6.7,33.2s2.2,22.8,6.7,33.2c4.5,10.4,10.6,19.4,18.2,27c7.7,7.7,16.7,13.7,27,18.2c10.4,4.5,21.4,6.7,33.2,6.7C162.5,229.2,173.5,226.9,183.9,222.4z M176.9,82.1c8.1,3.5,15.2,8.4,21.3,14.4c6.1,6.1,10.9,13.2,14.4,21.3c3.5,8.1,5.3,16.9,5.3,26.2s-1.8,18.1-5.3,26.2c-3.5,8.1-8.4,15.2-14.4,21.3c-6.1,6.1-13.2,10.9-21.3,14.4c-8.1,3.5-16.9,5.3-26.2,5.3c-9.3,0-18.1-1.8-26.2-5.3c-8.1-3.5-15.2-8.4-21.3-14.4c-6.1-6.1-10.9-13.2-14.4-21.3s-5.3-16.9-5.3-26.2s1.8-18.1,5.3-26.2s8.4-15.2,14.4-21.3c6.1-6.1,13.2-10.9,21.3-14.4c8.1-3.5,16.9-5.3,26.2-5.3C160,76.8,168.8,78.5,176.9,82.1z M173.4,197.6c7.1-3.1,13.3-7.2,18.5-12.5c5.2-5.2,9.4-11.4,12.5-18.5c3.1-7.1,4.6-14.7,4.6-22.7s-1.5-15.6-4.6-22.7c-3.1-7.1-7.2-13.3-12.5-18.5c-5.2-5.2-11.4-9.4-18.5-12.5c-7.1-3.1-14.7-4.6-22.7-4.6s-15.6,1.5-22.7,4.6c-7.1,3.1-13.3,7.2-18.5,12.5c-5.2,5.2-9.4,11.4-12.5,18.5c-3.1,7.1-4.6,14.7-4.6,22.7s1.5,15.6,4.6,22.7c3.1,7.1,7.2,13.3,12.5,18.5c5.2,5.2,11.4,9.4,18.5,12.5c7.1,3.1,14.7,4.6,22.7,4.6S166.3,200.7,173.4,197.6z M252.9,234.3c-1.1-0.5-2.3-0.7-3.6-0.7c-1.1,0-2.2,0.2-3.4,0.7s-2.1,1.2-2.8,2.1c-0.9,0.7-1.6,1.7-2.1,2.8c-0.5,1.1-0.7,2.2-0.7,3.4c0,1.3,0.2,2.5,0.7,3.6c0.5,1.1,1.2,2.1,2.1,2.8l75.9,76.2c1.7,1.7,3.8,2.5,6.4,2.5c2.6,0,4.8-0.8,6.4-2.5c0.7-0.9,1.4-2,1.8-3.1s0.7-2.2,0.7-3.4s-0.2-2.2-0.7-3.4s-1.1-2.1-1.8-3.1l-76.2-75.9C255,235.5,254.1,234.8,252.9,234.3z'
              />
            </svg>
            <input onChange={this.handleInputChange} className={classes.Input} type="text"/>
          </div>
        </div>
        {/* <div className={classes.closebutton} onClick={this.props.closeModal}><img src={CloseIcon}/></div> */}
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
  return {
    filters: state.main.filter
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
