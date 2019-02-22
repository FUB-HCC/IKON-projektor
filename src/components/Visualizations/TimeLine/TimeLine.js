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
import Modal from '../../Modal/Modal'
import DetailModal from '../../Modal/DetailModal'
import classes from '../AreaChart/AreaChart.css'
import HoverPopover from '../../HoverPopover/HoverPopover'

class TimeLine extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSplitYears: [],
      forschungsbereiche: [],
      height: props.height * 0.5,
      width: props.width * 0.5,
      margin: props.margin,
      firstUpdate: true,
      projectsPopoverHidden: true,
      detailModal: false,
      project: {},
      title: '',
      year: '',
      counter: 0,
      index: 0
    }
    this.handleCircleClick = this.handleCircleClick.bind(this)
    this.renderProjectsHover = this.renderProjectsHover.bind(this)
    this.handleCircleMouseLeave = this.handleCircleMouseLeave.bind(this)
    this.handleCircleMouseEnter = this.handleCircleMouseEnter.bind(this)
    this.onProjectClick = this.onProjectClick.bind(this)
    this.closeDetailModal = this.closeDetailModal.bind(this)

    // this.loadPaths = this.loadPaths.bind(this)
  }
  onProjectClick (project) {
    let selectedProjects = this.state.selectedProjects
    let current = project.project
    let title = ''
    let year = ''
    let counter = 0
    let index = 0
    if (selectedProjects) {
      title = selectedProjects[0].research_area  
      selectedProjects.map((project, i) => {
        counter++
        year = project.start_date   
        if (current.id === project.id) {
          index = counter
        }  
      })
    }    
    this.setState({detailModal: true, project: project, title, year, counter, index})
  }
  closeDetailModal () {
    this.setState({detailModal: false})
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

  handleCircleClick (evt, circlePoint) {
    let selectedProjects = circlePoint.projects    
    this.setState({projectsPopoverHidden: false, selectedProjects: selectedProjects, detailModal: false})
  }

  renderProjectsPopover () {
    let selectedProjects = this.state.selectedProjects
    let title = ''
    let year = ''
    let counter = 0
    if (selectedProjects) {
      title = selectedProjects[0].research_area  
      selectedProjects.map((project, i) => {
        counter++
        year = project.start_date     
      })
    }
    
    return !this.state.projectsPopoverHidden && <Modal year={year} counter={counter} headline={title} className={classes.projectModal} onCloseClick={() => {
      this.setState({projectsPopoverHidden: true})
    }} hidden={this.state.projectsPopoverHidden} width={this.state.width * 0.56} height={this.state.height * 0.75}>

      <ol className={classes.projects_list} style={{
        // height: (this.state.height * 0.65) + 'px'
      }}>
        {selectedProjects.map((project, i) => {
          return <li onClick={event => {
            this.setState({projectsPopoverHidden: true})            
            this.onProjectClick({project: project}, 2)
          }} key={`project-list-link-${project.id}-${i}`}
          className={classes.projects_list_item}>{`${project.title} (${project.id})`}</li>
        })}
      </ol>

    </Modal>
  }

  renderProjectsHover () {
    return (this.state.hoveredCircle && this.state.mouseLocation) && <HoverPopover width={'15em'} height={'5em'} locationX={this.state.mouseLocation[0]}
      locationY={this.state.mouseLocation[1]}>
      <p style={{
        position: 'absolute',
        backgroundColor: '#717071',
        margin: '0',
        top: '0em',
        color: '#e9e9e9',
        overflowY: 'scroll',
        overflowX: 'hidden',
        padding: '5px'}}>
        {`${this.state.hoveredCircle.numberOfActiveProjects} active projects for ${this.state.hoveredCircle.fb} in ${this.state.hoveredCircle.year}`}
      </p>
    </HoverPopover>
  }

  handleCircleMouseEnter (circlePoint, evt) {
    this.setState({hoveredCircle: circlePoint, mouseLocation: [evt.nativeEvent.clientX, evt.nativeEvent.clientY]})
  }

  handleCircleMouseLeave (evt) {
    this.setState({hoveredCircle: undefined})
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
    const circlePoints = array.map(datum => (Object.assign({
      x: selectScaledX(datum),
      y: selectScaledY(datum),
      color: datum.color}, datum)))
    
    return (
      <div>
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

          {Object.values(this.state.dataSplitYears).map((line, i) => {            
            return (<g key={line} className={styles.line}><path style={{stroke: line[i].color}} d={sparkLine(line)}/></g>)
          })}

          {/* a group for our scatter plot, and render a circle at each `circlePoint`. */}
          <g className={styles.scatter}>
            {circlePoints.map(circlePoint => (
              <circle
                cx={circlePoint.x}
                cy={circlePoint.y}
                style={{
                  fill: circlePoint.color,
                  pointerEvents: 'fill'
                }}
                key={`circle-${circlePoint.x},${circlePoint.y},${circlePoint.color}`}
                onClick={(evt) => { this.handleCircleClick(evt, circlePoint) }}
                onMouseLeave={this.handleCircleMouseLeave}
                onMouseMove={(event) => {
                  this.handleCircleMouseEnter(circlePoint, event)
                }}
                onMouseEnter={(event) => {
                  this.handleCircleMouseEnter(circlePoint, event)
                }}
                r={4}
              />
            ))}
          </g>
        </SVGWithMargin>
        {this.renderProjectsPopover()}
        {this.renderProjectsHover()}

        {this.state.detailModal &&
          <DetailModal projects={this.state.selectedProjects} index={this.state.index} headline={this.state.title} year={this.state.year} counter={this.state.counter} closeDetailModal={this.closeDetailModal} project={this.state.project}/>
        }
      </div>
    )
  }
}

export default TimeLine
