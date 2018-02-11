import React from 'react'
import {connect} from 'react-redux'
import {default as TimeLineGraph} from '../../components/Visualizations/TimeLine'

class TimeLine extends React.Component {
  componentDidMount () {
    this.Graph = new TimeLineGraph()
    this.Graph.setupTimeGraph('#' + this.props.target, this.props.data)
  }

  componentDidUpdate () {
    this.Graph.updateTimeGraph(this.props.data)
  }

  render () {
    return (
      <div>
        <svg id={this.props.target} width="1200" height="800"></svg>
      </div>
    )
  }
}

const graphColors = {
  fb: {
    '1': '#7d913c',
    '2': '#d9ef36',
    '3': '#8184a7',
    '4': '#985152'
  },
  fbLight: {
    '1': '',
    '2': '',
    '3': '',
    '4': ''
  },
  fbDark: {
    '1': '',
    '2': '',
    '3': '',
    '4': ''
  },
  system: {
    'active': '#f0faf0',
    'inactive': '#989aa1',
    'background': '#434058'
  }
}

const mapStateToProps = state => {
  const processedData = processData(state.filteredData, graphColors)
  return {
    data: processedData,
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
  // Stage 1 create baseData and split by FB
  if (!data) return []
  let splitFbs = [[], [], [], []]

  Object.keys(data).forEach(pId => {
    let d = {
      num: 0,
      color: colors.fb[data[pId].forschungsbereich],
      startDate: new Date(data[pId].start),
      endDate: new Date(data[pId].end),
      projectId: pId,
      foundFit: false // needed to optimize Spacing (later deleted)
    }
    splitFbs[data[pId].forschungsbereich - 1].push(d)
  })

  // Stage 2 Optimize space for each fb and insert spacing between fbs
  let resultData = []
  let previousNums = 0
  for (let i = 0; i < splitFbs.length; i++) {
    // concat didnot work :(
    let result = shuffleArray(optimizeSpace(splitFbs[i], previousNums))
    for (let j = 0; j < result.length; j++) {
      resultData.push(result[j])
    }
    previousNums += splitFbs[i].length
    for (let j = 0; j < 5 && i < splitFbs.length - 1; j++) {
      resultData.push({num: previousNums, startDate: null, endDate: null, projectId: null})
      previousNums += 1
    }
  }
  return resultData
}

const optimizeSpace = (data, offset) => {
  /*
      Group Projects into the same Row to minimize the width
      by giving them the same num value.
      (Restricted to 2 Projects per row with at least 1 Month between them )
        data - preprocessed projects data
        offset - int increasing all nums of this dataset
          This is used to avoid overlapping num values between datasets.
    */
  data.sort(endDateSort)
  for (let i = 0; i < data.length; i++) {
    if (!data[i].foundFit) {
      data[i].num = i + offset
      for (let j = i + 1; j < data.length; j++) {
        if (!data[j].foundFit && data[i].endDate.getTime() + (31 * 24 * 60 * 60 * 1000) <
            data[j].startDate.getTime()) {
          data[j].num = i + offset
          data[j].foundFit = true
          break
        }
      }
    }
    delete data[i].foundFit
  }
  return data
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

const endDateSort = (a, b) => {
  return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
}

export default connect(mapStateToProps)(TimeLine)
