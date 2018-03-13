import {select as d3Select, event as d3Event} from 'd3-selection'
import {scaleBand as d3ScaleBand, scaleTime as d3ScaleTime} from 'd3-scale'
import {axisRight as d3AxisRight} from 'd3-axis'
import {min as d3Min, max as d3Max} from 'd3-array'
import 'd3-transition'
import classes from './TimeLine.css'

class TimeLine {
  setupTimeGraph (svgId, data, height, width, onProjectClick, type = 'default', config = {}) {
    console.log('VISUALIZATION CHANGE: SETUP TIMELINE')
    this.colors = {
      system: {
        'active': '#f0faf0',
        'inactive': '#989aa1',
        'background': '#434058'
      }
    }
    /*
      Public
      Creates all nessecary data and shows the Visulisation
        svgId - defines the SVG Id (e.g."#svgChart") where the Visulisation should be appended
        data  - the newProjects.json set or a subset of it
        type  - String defining the Visualisation Type
        config- Json with variables defining the Style properties
    */
    this.transitionTime = 800
    // Delays data change to let removed elements fade out and new Elements fade in.
    this.delayTime = 0
    this.tooltipTransitionTime = 200
    /*
      visdata  - Is an array where each entry represents an Object in the Chart. To seperate e.g.
            the FBs, there are 4 empty entries between them.

            num is used to put two or more objects in the same row to Optimize space
            [{num:,color:,startDate:, endDate:,projectId:},...]
    */
    this.onProjectClick = onProjectClick
    this.visData = data
    this.svg = d3Select(svgId)
    this.width = width
    this.height = height
    this.svg.attr('width', width).attr('height', height)
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

  updateTimeGraph (data, height, width) {
    console.log('VISUALIZATION CHANGE: UPDATE TIMELINE')
    /*
      Public
      Updates The Visulisation with the new Data
        data - the newProjects.json set or a subset of it
    */
    this.width = width
    this.height = height
    this.svg.attr('width', width).attr('height', height)
    this.g.attr('transform', 'translate(' + (this.width / 4) + ',' +
      (this.height / 4) + ')')
    this.xScale.range([0, this.width / 2])
    this.yScale.range([this.height / 2, 0])

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
    this.g.select('.yTimeLine').selectAll('.tick').attr('class', classes.tick + ' tick')
    this.g.select('.yTimeLine').selectAll('.domain').attr('class', classes.domain + ' domain')
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
      .attr('width', function () {
        if (that.xScale.bandwidth() - 3 > 0.01) {
          return that.xScale.bandwidth() - 3
        }
        return 0
      })
      .attr('y', function (d) {
        let tmp = new Date(d.endDate)
        tmp.setDate(tmp.getDate() - 600)
        return that.yScale(tmp)
      })
      .attr('height', function (d) {
        return that.yScale(d.startDate) - that.yScale(d.endDate)
      })
      .on('click', function (d) {
        that.onProjectClick(d, 1)
      })
      .on('mouseover', function () {
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
      .attr('width', function () {
        if (that.xScale.bandwidth() - 3 > 0.01) {
          return that.xScale.bandwidth() - 3
        }
        return 0
      })
      .attr('y', function (d) {
        return that.yScale(d.endDate)
      })
      .attr('height', function (d) {
        return that.yScale(d.startDate) - that.yScale(d.endDate)
      })
      .style('opacity', 1)
  }
}

export default TimeLine
