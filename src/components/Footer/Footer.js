import React, {Component} from 'react'
import classes from '../redesigned.css'
import {connect} from 'react-redux'
import * as actions from '../../store/actions/actions'
import Select from 'react-select'
import InputRange from 'react-input-range'

class Footer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      value: { min: 1996, max: 2018 },
      selectedOption: 'sketchiness',
      secondSelectedOption: 'standard'
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleOptionChange = this.handleOptionChange.bind(this)
    this.handleYearChange = this.handleYearChange.bind(this)
  }  
  handleChange (selectedOption) {
    this.setState({ selectedOption })
    // console.log(selectedOption.value)
    this.props.changeVisType(selectedOption.value)
    // console.log(`Option selected:`, selectedOption)
  }

  handleYearChange (selectedValue) {
    this.setState({
      value: selectedValue
    })
    this.props.yearChangeHandler(selectedValue)
  }

  handleOptionChange (selectedSecondOption) {
    this.setState({ selectedSecondOption })
    // console.log(selectedOption.value)
    this.props.changeViewType(selectedSecondOption.value)
    // console.log(`Option selected:`, selectedOption)
  }

  render () {  
    const { selectedOption } = this.state
    const options = [
      { value: 'sketchiness', label: 'Sketchiness' },
      { value: 'dashing', label: 'Dashing' },
      { value: 'blur', label: 'Blur' },
      { value: 'none', label: 'None' }
    ]

    // console.log(this.state.value, this.props.selectedYears.value)

    const { secondSelectedOption } = this.state
    const secondOptions = [
      { value: 'standard', label: 'Standard' },
      { value: 'other1', label: 'Other' },
      { value: 'other2', label: 'Other' }
    ]
    return (

      <React.Fragment>
        <div className={classes.footer}>
          <div className={classes.leftFooter}>
            <div className={classes.timeSlider}>
              <InputRange maxValue={this.props.selectedYears.distValues.max} minValue={this.props.selectedYears.distValues.min} value={this.props.selectedYears.value} onChange={this.handleYearChange} />
            </div>
          </div>
          
          <div className={classes.milldleLeft}>
            <div className={classes.filter}>
              <div className={classes.filterWrap}>
                <label className={classes.selectLabel} >VIS. TYPE</label>
                <Select
                  value={selectedOption}
                  onChange={this.handleChange}
                  options={options}
                />
              </div>
              <div className={classes.filterWrap}>
                <label className={classes.selectLabel} >VIEW</label>
                <Select
                  value={secondSelectedOption}
                  onChange={this.handleOptionChange}
                  options={secondOptions}
                />
              </div>
            </div>
          </div>
          
          <div className={classes.milldleRight}>
            <button className={classes.btnFooter}>SPEICHERN</button>
          </div>
          
          <div className={classes.rightFooter + ' ' + classes.dslfjdsl}>
            <button className={classes.btnFooter}>TEILEN</button>

          </div>
        </div>
      </React.Fragment>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: (value) => dispatch(actions.changeGraph(value)),
    activatePopover: (value, vis) => dispatch(actions.activatePopover(value, vis)),
    deactivatePopover: () => dispatch(actions.deactivatePopover()),
    yearChangeHandler: (value) => dispatch(actions.yearChange(value)),
    changeVisType: (value) => dispatch(actions.visTypeChange(value)),
    changeViewType: (value) => dispatch(actions.viewTypeChange(value))
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
    filteredData: state.main.filteredData,
    selectedYears: state.main.selectedYears
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
