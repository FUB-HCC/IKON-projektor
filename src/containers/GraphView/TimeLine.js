import React from 'react'
import {connect} from 'react-redux'
import {fieldsIntToString, getFieldColor} from '../../store/utility'
import {default as TimeLineGraph} from '../../components/Visualizations/TimeLine/TimeLine'

class TimeLine extends React.Component {
  componentDidMount () {
    this.Graph.updateTimeGraph({dataSplitFb: this.props.dataSplitFb, projects: this.props.projects}, this.props.width, this.props.height, 20)
  }

  componentDidUpdate () {
    this.Graph.updateTimeGraph({dataSplitFb: this.props.dataSplitFb, projects: this.props.projects}, this.props.height, this.props.width, 20)
  }

  render () {
    return (<TimeLineGraph ref={(node) => { this.Graph = node }} width={this.props.width} height={this.props.height} margin={20} ></TimeLineGraph>)
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
  const processedData = processData(state.main.filteredData, graphColors)
  return {
    dataSplitFb: processedData,
    projects: state.main.filteredData,
    target: 'graph',
    colors: graphColors
  }
}

const processData = (data, colors) => {
  /*
   Private
   Transforms the data in to a format which can be easily used for the Visulisation.

     inData - the newProjects.json set or a subset of it

     Returns the visData.

   (Possibly split up into a different function for each Visualisation type)
 */
  // create baseData and split by FB
  if (!data) return [[], [], [], []]
  let splitFbs = [[], [], [], []]

  Object.keys(data).forEach(pId => {
    let d = {
      num: 0,
      color: getFieldColor(fieldsIntToString(data[pId].forschungsbereichNumber)),
      startDate: new Date(data[pId].start),
      endDate: new Date(data[pId].end),
      projectId: pId,
      project: data[pId]
    }
    splitFbs[data[pId].forschungsbereichNumber - 1].push(d)
  })

  return splitFbs
}

export default connect(mapStateToProps)(TimeLine)
