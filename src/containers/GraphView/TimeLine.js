import React from 'react'
import {connect} from 'react-redux'
import {getFieldColor} from '../../store/utility'
import {default as TimeLineGraph} from '../../components/Visualizations/TimeLine/TimeLine'

class TimeLine extends React.Component {
  componentDidMount () {
    this.Graph.updateTimeGraph({dataSplitFbYear: this.props.dataSplitFbYear, projects: this.props.projects}, this.props.width, this.props.height, 20, this.props.years.min, this.props.years.max, this.props.missingVisType)
  }

  componentDidUpdate () {
    this.Graph.updateTimeGraph({dataSplitFbYear: this.props.dataSplitFbYear, projects: this.props.projects}, this.props.height, this.props.width, 20, this.props.years.min, this.props.years.max, this.props.missingVisType)
  }

  render () {
    return (<TimeLineGraph ref={(node) => { this.Graph = node }} onProjectClick={this.props.onProjectClick} width={this.props.width} height={this.props.height} margin={20} />)
  }
}

const graphColors = {
  system: {
    'active': '#f0faf0',
    'inactive': '#989aa1',
    'background': '#434058'
  }
}

const mapStateToProps = state => {
  const processedData = processData(state.main.filteredData, graphColors, state.main.selectedYears.value.min, state.main.selectedYears.value.max)
  return {
    dataSplitFbYear: processedData,
    projects: state.main.filteredData,
    colors: graphColors,
    years: state.main.selectedYears.value,
    missingVisType: state.main.missingVisType
  }
}

const processData = (data, colors, minYear, maxYear) => {
  /*
   Private
   Transforms the data in to a format which can be easily used for the Visulisation.

     inData - the newProjects.json set or a subset of it

     Returns the visData.

 */

  if (!data) return [[], [], [], []]

  let dataSplitYears = []
  for (let projectsKey in data) {
    if (!(data[projectsKey].forschungsbereichstr in dataSplitYears)) {
      dataSplitYears[data[projectsKey].forschungsbereichstr] = []
    }

    let startDate = parseInt(data[projectsKey].start_date)
    let endDate = parseInt(data[projectsKey].end_date)
    if (isNaN(endDate) || endDate === '') endDate = new Date().getFullYear()

    let forschungsbereichData = dataSplitYears[data[projectsKey].forschungsbereichstr]

    let year = startDate
    while (year <= endDate) {
      let yearExists = false
      for (let yearFbIndex in forschungsbereichData) { // check if year already is existent for the forschungsbereich
        if (forschungsbereichData[yearFbIndex].year === year) {
          yearExists = true
          forschungsbereichData[yearFbIndex].numberOfActiveProjects = forschungsbereichData[yearFbIndex].numberOfActiveProjects + 1
          forschungsbereichData[yearFbIndex].projects.push(data[projectsKey])
        }
      }
      if (!yearExists) {
        forschungsbereichData.push(
          {
            year: year,
            fb: data[projectsKey].forschungsbereichstr,
            numberOfActiveProjects: 1,
            projects: [data[projectsKey]],
            color: getFieldColor(data[projectsKey].forschungsbereichstr)
          })
      }
      year++
    }
    dataSplitYears[data[projectsKey].forschungsbereichstr] = forschungsbereichData.filter(a => a.year >= minYear && a.year <= maxYear).sort((a, b) => a.year - b.year)
  }

  return dataSplitYears
}

export default connect(mapStateToProps)(TimeLine)
