import 'd3-transition'
import React, {Component} from 'react'
import SVGWithMargin from './SVGWithMargin'
import styles from './TimeLine.css'

// Import the D3 libraries we'll be using for the spark line.
import { extent as d3ArrayExtent } from 'd3-array'
import {
  scaleLinear as d3ScaleLinear,
  scaleTime as d3ScaleTime
} from 'd3-scale'
import { line as d3Line } from 'd3-shape'
// Import the D3 libraries we'll use for the axes.
import {
  axisBottom as d3AxisBottom,
  axisLeft as d3AxisLeft
} from 'd3-axis'
import { select as d3Select } from 'd3-selection'

const sampleData = [
  { 'day': '2017-04-18', 'productPerceivedQuality': '2.8' },
  { 'day': '2017-04-19', 'productPerceivedQuality': '2.9' },
  { 'day': '2017-04-20', 'productPerceivedQuality': '2.7' },
  { 'day': '2017-04-21', 'productPerceivedQuality': '4.3' },
  { 'day': '2017-04-22', 'productPerceivedQuality': '4.6' },
  { 'day': '2017-04-23', 'productPerceivedQuality': '5' },
  { 'day': '2017-04-24', 'productPerceivedQuality': '5.2' },
  { 'day': '2017-04-25', 'productPerceivedQuality': '5.1' },
  { 'day': '2017-04-26', 'productPerceivedQuality': '4.8' },
  { 'day': '2017-04-27', 'productPerceivedQuality': '4.9' },
  { 'day': '2017-04-28', 'productPerceivedQuality': '5.1' },
  { 'day': '2017-04-29', 'productPerceivedQuality': '5.3' },
  { 'day': '2017-04-30', 'productPerceivedQuality': '5.6' },
  { 'day': '2017-05-01', 'productPerceivedQuality': '6.2' }
]

class TimeLine extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: sampleData,
      height: props.height * 0.5,
      width: props.width * 0.5,
      margin: props.margin
    }
    // this.loadPaths = this.loadPaths.bind(this)
  }

  updateTimeGraph (data, height, width, margin) {
    console.log(data)
    this.setState({height: height * 0.5, width: width * 0.50, margin: margin})
  }

  render () {
    const selectY = datum => datum.productPerceivedQuality
    const selectX = datum => new Date(datum.day).setHours(0, 0, 0, 0)

    // Since this is "time series" visualization, our x axis should have a time scale.
    // Our x domain will be the extent ([min, max]) of x values (Dates) in our data set.
    // Our x range will be from x=0 to x=width.
    const xScale = d3ScaleTime()
      .domain(d3ArrayExtent(this.state.data, selectX))
      .range([0, this.state.width])

    // Our y axis should just have a linear scale.
    // Our y domain will be the extent of y values (numbers) in our data set.
    const yScale = d3ScaleLinear()
      .domain(d3ArrayExtent(this.state.data, selectY))
      .range([this.state.height, 0])

    // Add an axis for our x scale which has half as many ticks as there are rows in the data set.
    const xAxis = d3AxisBottom()
      .scale(xScale)
      .ticks(this.state.data.length / 2)
    // Add an axis for our y scale that has 3 ticks (FIXME: we should probably make number of ticks per axis a prop).
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

      // Create a line path of for our data.
    const linePath = sparkLine(this.state.data)

    // map our data to scaled points.
    const circlePoints = this.state.data.map(datum => ({
      x: selectScaledX(datum),
      y: selectScaledY(datum)
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
        <g className={styles.yAxis} ref={node => d3Select(node).call(yAxis)} />

        <g className={styles.line}>
          <path d={linePath} />
        </g>

        {/* a group for our scatter plot, and render a circle at each `circlePoint`. */}
        <g className={styles.scatter}>
          {circlePoints.map(circlePoint => (
            <circle
              cx={circlePoint.x}
              cy={circlePoint.y}
              key={`${circlePoint.x},${circlePoint.y}`}
              r={4}
            />
          ))}
        </g>
      </SVGWithMargin>
    )
  }
}

export default TimeLine
