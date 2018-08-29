import 'd3-transition'
import styles from './TimeLine.css'
import React, {Component} from 'react'
import SVGWithMargin from './SVGWithMargin'

// Import the D3 libraries we'll be using for the spark line.
import {extent as d3ArrayExtent} from 'd3-array'
import {
  scaleLinear as d3ScaleLinear,
  scaleTime as d3ScaleTime
} from 'd3-scale'
import {line as d3Line} from 'd3-shape'
// Import the D3 libraries we'll use for the axes.
import {
  axisBottom as d3AxisBottom,
  axisLeft as d3AxisLeft
} from 'd3-axis'
import {select as d3Select} from 'd3-selection'

class TimeLine extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSplitYears: [],
      forschungsbereiche: [],
      height: props.height * 0.5,
      width: props.width * 0.5,
      margin: props.margin,
      firstUpdate: true
    }
    // this.loadPaths = this.loadPaths.bind(this)
  }

  updateTimeGraph (data, height, width, margin) {
    if (!this.state.firstUpdate) { // workaround for first time scaling
      this.setState({height: height * 0.5, width: width * 0.50, margin: margin})
    }

    let forschungsbereiche = this.state.forschungsbereiche
    Object.keys(data.dataSplitFbYear).map(value => {
      if (this.state.forschungsbereiche.indexOf(value) === -1) forschungsbereiche = [...forschungsbereiche, value]
    })

    this.setState({dataSplitYears: data.dataSplitFbYear, projectsData: data.projects, forschungsbereiche: forschungsbereiche, firstUpdate: false})
  }

  render () {
    let array = [].concat.apply([], Object.values(this.state.dataSplitYears))

    const selectY = datum => datum.numberOfActiveProjects
    const selectX = datum => new Date(datum.year.toString()).setHours(0, 0, 0, 0)

    // Since this is "time series" visualization, our x axis should have a time scale.
    // Our x domain will be the extent ([min, max]) of x values (Dates) in our data set.
    // Our x range will be from x=0 to x=width.
    const xScale = d3ScaleTime()
      .domain(d3ArrayExtent(array, selectX))
      .range([0, this.state.width])

    // Our y axis should just have a linear scale.
    // Our y domain will be the extent of y values (numbers) in our data set.
    const yScale = d3ScaleLinear()
      .domain(d3ArrayExtent(array, selectY))
      .range([this.state.height, 0])

    // Add an axis for our x scale which has half as many ticks as there are rows in the data set.
    const xAxis = d3AxisBottom()
      .scale(xScale)
      .ticks(array.length / 4)

    // Add an axis for our y scale that has 3 ticks
    const yAxis = d3AxisLeft()
      .scale(yScale)
      .ticks(3)

    // These two functions select the scaled x and y values (respectively) of our data.
    const selectScaledX = datum => xScale(selectX(datum))
    const selectScaledY = datum => yScale(selectY(datum))

    // Create a d3Line factory for our scales.
    const sparkLine = d3Line()
      .x(selectScaledX)
      .y(selectScaledY)

    // map our data to scaled points.
    const circlePoints = array.map(datum => ({
      x: selectScaledX(datum),
      y: selectScaledY(datum),
      color: datum.color
    }))

    return (
      <SVGWithMargin
        className={styles.timelineContainer}
        contentContainerBackgroundRectClassName={styles.timelineContentContainerBackgroundRect}
        contentContainerGroupClassName={styles.timelineContentContainer}
        height={this.state.height}
        margin={this.state.margin}
        width={this.state.width}
      >

        {/* a transform style prop to our xAxis to translate it to the bottom of the SVG's content. */}
        <g
          className={styles.xAxis}
          ref={node => d3Select(node).call(xAxis)}
          style={{
            transform: `translateY(${this.state.height}px)`
          }}
        />
        <g className={styles.yAxis} ref={node => d3Select(node).call(yAxis)}/>

        {Object.values(this.state.dataSplitYears).map((line) => {
          return (<g key={line} className={styles.line}><path style={{stroke: line[0].color}} d={sparkLine(line)}/></g>)
        })}

        {/* a group for our scatter plot, and render a circle at each `circlePoint`. */}
        <g className={styles.scatter}>
          {circlePoints.map(circlePoint => (
            <circle
              cx={circlePoint.x}
              cy={circlePoint.y}
              style={{
                fill: circlePoint.color
              }}
              key={`${Math.random()}${circlePoint.x},${circlePoint.y}`}
              r={4}
            />
          ))}
        </g>
      </SVGWithMargin>
    )
  }
}

export default TimeLine
