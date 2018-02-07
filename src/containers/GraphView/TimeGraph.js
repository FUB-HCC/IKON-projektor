import React from 'react'
import {connect} from 'react-redux'
import {select as d3Select, event as d3Event} from 'd3-selection'
import {scaleBand as d3ScaleBand, scaleTime as d3ScaleTime} from 'd3-scale'
import {axisRight as d3AxisRight} from 'd3-axis'
import {min as d3Min, max as d3Max} from 'd3-array'
import 'd3-transition'
import classes from './TimeGraph.css'

class TimeGraph extends React.Component {
  componentDidMount () {
    this.setupTimeGraph('#graph', this.props.data)
  }

  componentDidUpdate () {
    this.updateTimeGraph(this.props.data)
  }

  render () {
    return (
      <div>
        <svg id="graph" width="1200" height="800"></svg>
      </div>
    )
  }

  setupTimeGraph (svgId, data, type = 'default', config = {}) {
    console.log('VISUALIZATION CHANGE: SETUP TIMELINE')
    /*
      Public
      Creates all nessecary data and shows the Visulisation
        svgId - defines the SVG Id (e.g."#svgChart") where the Visulisation should be appended
        data  - the newProjects.json set or a subset of it
        type  - String defining the Visualisation Type
        config- Json with variables defining the Style properties
    */
    this.transitionTime = 1000
    // Delays data change to let removed elements fade out and new Elements fade in.
    this.delayTime = 0
    this.tooltipTransitionTime = 200
    this.colors = this.props.colors
    /*
      visdata  - Is an array where each entry represents an Object in the Chart. To seperate e.g.
            the FBs, there are 4 empty entries between them.

            num is used to put two or more objects in the same row to Optimize space
            [{num:,color:,startDate:, endDate:,projectId:},...]
    */
    this.visData = data
    this.svg = d3Select(svgId)
    this.width = this.svg.attr('width')
    this.height = this.svg.attr('height')
    this.g = this.svg.append('g')
      .attr('transform', 'translate(' + (this.width / 4) + ',' +
        (this.height / 4) + ')')
    this.xScale = d3ScaleBand()
      .range([0, this.width / 2])
      .padding(0.1)
    this.yScale = d3ScaleTime()
      .range([this.height / 2, 0])
    this.rightAxis = this.g.append('g')
      .attr('class', 'yTimeLine')

    this.g.append('line').attr('class', 'currentDay').style('opacity', 0)
    this.g.append('circle').attr('class', 'rightDot').style('opacity', 0)
    this.g.append('circle').attr('class', 'leftDot').style('opacity', 0)

    this.tooltip = d3Select('body').append('div')
      .attr('class', classes.tooltip)
      .style('opacity', 0)

    this.updateD3Functions()
    this.updateSvgElements()
  }

  updateTimeGraph (data) {
    console.log('VISUALIZATION CHANGE: UPDATE TIMELINE')
    /*
      Public
      Updates The Visulisation with the new Data
        data - the newProjects.json set or a subset of it
    */
    this.visData = data
    this.updateD3Functions()
    this.updateSvgElements()
  }

  updateD3Functions () {
    /*
      Private
      Updates all nessecary D3 functions (e.g. ForceSimulation, Scales)
      Uses the globally defined Data in this.visData
    */
    this.xScale.domain(this.visData.map(function (d) {
      return d.num
    }))
    this.yScale.domain([d3Min(this.visData, function (d) {
      return d.startDate
    }),
    d3Max(this.visData, function (d) {
      return d.endDate
    })])
  }

  updateSvgElements () {
    /*
      Private
      Updates all nessecary SVG elements
    */
    this.updateAxis()
    this.updateCurrentDayIndication()
    this.updateBars()
  }

  updateAxis () {
    /*
      Updates the axis in the svg
    */
    this.g.select('.yTimeLine').transition().delay(this.delayTime).duration(this.transitionTime)
      .call(d3AxisRight(this.yScale)
        .tickSize(this.width / 2))
      .selectAll('.tick text')
      .attr('x', this.xScale.range()[1] + 20)
  }

  updateCurrentDayIndication () {
    /*
      Updates the CurrentDayIndication in the svg
    */
    let d = new Date()

    this.g.select('.currentDay')
      .attr('stroke', this.colors.system.active)
      .transition().delay(this.delayTime).duration(this.transitionTime)
      .attr('y1', this.yScale(d))
      .attr('y2', this.yScale(d))
      .attr('x1', -5)
      .attr('x2', this.width / 2 + 5)
      .style('opacity', 1)

    this.g.select('.rightDot')
      .style('fill', this.colors.system.active)
      .transition().delay(this.delayTime).duration(this.transitionTime)
      .attr('r', 4)
      .attr('cx', -5)
      .attr('cy', this.yScale(d))
      .style('opacity', 1)

    this.g.select('.leftDot')
      .style('fill', this.colors.system.active)
      .transition().delay(this.delayTime).duration(this.transitionTime)
      .attr('r', 4)
      .attr('cx', this.width / 2 + 5)
      .attr('cy', this.yScale(d))
      .style('opacity', 1)
  }

  updateBars () {
    /*
      Updates all Bars in the svg and a tooltip in the Body
    */
    /*
      Replace Bars with path or polygon for different Visulisations of the Project
      (possibly seperate Class)
    */
    const that = this
    const bars = this.g.selectAll('.' + classes.bar)
      .data(this.visData, function (d) {
        return d.projectId
      })

    // Delete old elements
    bars.exit().transition()
      .duration(this.transitionTime)
      .attr('y', function (d) {
        let tmp = new Date(d.endDate)
        tmp.setDate(tmp.getDate() - 600)

        return that.yScale(tmp)
      })
      .style('opacity', 0)
      .remove()
    // Add new elements
    bars.enter().append('rect')
      .attr('class', classes.bar)
      .attr('stroke', function (d) {
        return d.color
      })
      .style('fill', function (d) {
        return d.color
      })
      .style('opacity', 0)
      .attr('x', d => that.xScale(d.num) + 'px')
      .attr('width', this.xScale.bandwidth() - 3)
      .attr('y', function (d) {
        let tmp = new Date(d.endDate)
        tmp.setDate(tmp.getDate() - 600)
        return that.yScale(tmp)
      })
      .attr('height', function (d) {
        return that.yScale(d.startDate) - that.yScale(d.endDate)
      })
      .on('click', function (d) {
        // TODO DISPATCH
      })
      .on('mouseover', function (d) {
        d3Select(this).style('cursor', 'pointer')
        d3Select(this).transition()
          .duration(that.tooltipTransitionTime)
          .style('stroke', that.colors.system.active)
          .style('fill', that.colors.system.active)
        that.tooltip.transition()
          .duration(that.tooltipTransitionTime)
          .style('opacity', 0.8)
        // TODO tooltip
        that.tooltip.html('No tooltip')
          .style('color', that.colors.system.active)
          .style('left', (d3Event.pageX) + 'px')
          .style('top', (d3Event.pageY - 32) + 'px')
      })
      .on('mouseout', function (d) {
        d3Select(this).style('cursor', 'default')
        d3Select(this).transition()
          .duration(that.tooltipTransitionTime)
          .style('stroke', d.color)
          .style('fill', d.color)
        that.tooltip.transition()
          .duration(that.tooltipTransitionTime)
          .style('opacity', 0)
      })
      .transition().delay(this.delayTime).duration(this.transitionTime)
      .style('opacity', 1)
      .attr('y', function (d) {
        return that.yScale(d.endDate)
      })

    bars
      .transition().delay(this.delayTime).duration(this.transitionTime)
      .attr('x', d => that.xScale(d.num) + 'px')
      .attr('width', this.xScale.bandwidth() - 3)
      .attr('y', function (d) {
        return that.yScale(d.endDate)
      })
      .attr('height', function (d) {
        return that.yScale(d.startDate) - that.yScale(d.endDate)
      })
      .style('opacity', 1)
  }
}

const mapStateToProps = state => {
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
  const processedData = processData(state.filteredData, graphColors)
  return {
    graph: state.graph,
    data: processedData,
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

export default connect(mapStateToProps)(TimeGraph)
