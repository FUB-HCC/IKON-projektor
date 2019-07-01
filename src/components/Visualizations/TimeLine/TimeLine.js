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
import arrowHover from '../../../assets'
import MissingData from '../../MissingData/MissingData'

class TimeLine extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dataSplitYears: [],
      forschungsbereiche: [],
      height: props.height * 0.5,
      width: props.width * 0.6,
      margin: props.margin,
      firstUpdate: true,
      projectsPopoverHidden: true,
      detailModal: false,
      project: {},
      title: '',
      year: '',
      counter: 0,
      index: 0,
      minYear: 1996,
      maxYear: 2018,
      visType: 'sketchiness',
      oldState: {}
    }
    this.handleCircleClick = this.handleCircleClick.bind(this)
    this.renderProjectsHover = this.renderProjectsHover.bind(this)
    this.handleCircleMouseLeave = this.handleCircleMouseLeave.bind(this)
    this.handleCircleMouseEnter = this.handleCircleMouseEnter.bind(this)
    this.onProjectClick = this.onProjectClick.bind(this)
    this.closeDetailModal = this.closeDetailModal.bind(this)
    this.zurukhBtnAction = this.zurukhBtnAction.bind(this)

    // this.loadPaths = this.loadPaths.bind(this)
  }

  componentDidUpdate (prevProps, prevState) {
    this.createChart()
  }

  componentDidMount () {

  }

  createChart () {
    const node = this.node

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
  
    // These two functions select the scaled x and y values (respectively) of our data.
    const selectScaledX = datum => xScale(selectX(datum))
    const selectScaledY = datum => yScale(selectY(datum))
  
    // Create a d3Line factory for our scales.
    const sparkLine = d3Line()
      .x(selectScaledX)
      .y(selectScaledY)
      .defined(function (d) { return (d.numberOfActiveProjects !== null) })
  
    // create dataset with missing data input as null
    let dataset = JSON.parse(JSON.stringify(Object.values(this.state.dataSplitYears)))

    dataset.forEach(element => {
      if (element.length > 0) {
        const fb = element[0].fb
        const color = element[0].color
        for (let i = 0; i <= this.state.maxYear - this.state.minYear; i++) {
          if (element.length <= i) {
            element.push({
              'year': this.state.minYear + i,
              'fb': fb,
              'numberOfActiveProjects': null,
              'color': color
            })
          } else if (element[i].year !== this.state.minYear + i) {
            element.splice(i, 0, {
              'year': this.state.minYear + i,
              'fb': fb,
              'numberOfActiveProjects': null,
              'color': color
            })
          }
        }
      }
    })

    // on first creation
    if (d3Select('.lines').empty() && d3Select('.dots').empty()) {
      // creation of the lines
      d3Select(node)
        .append('g')
        .attr('class', 'lines')
      
      d3Select(node)
        .append('g')
        .attr('class', 'dots')

      dataset.forEach(line => {
        const color = (line.length > 0) ? line[0].color : ''

        // the class gets used as an identifier to check if the part has been
        // updated in the current rendering
        d3Select('.lines')
          .append('g')
          .attr('class', styles.line)
          .append('path')
          .datum(line)
          .attr('id', 'c' + color.substring(1, 7))
          .attr('class', 'unchangedPath')
          .style('stroke', 'transparent')
          .attr('d', sparkLine)
          .transition()
          .duration(1250)
          .style('stroke', color)

        d3Select('.dots')
          .append('g')
          .attr('class', styles.line)
          .selectAll('circle')
          .data(line.filter(function (d) { return (d.numberOfActiveProjects !== null) }))
          .enter()
          .append('circle')
          .attr('id', function (d) { return ((d.fb).replace(/\W+/g, '') + d.year) })
          .attr('class', 'unchangedDot')
          .attr('cx', sparkLine.x())
          .attr('cy', sparkLine.y())
          .attr('r', 4)
          .style('fill', 'transparent')
          .transition()
          .duration(1250)
          .style('fill', function (d) { return d.color })
      })

    // in case of an update of the visualization
    } else {
      // line update
      dataset.forEach(line => {
        const color = (line.length > 0) ? line[0].color : ''

        d3Select('.lines')
          .datum(line)
          .select('#c' + color.substring(1, 7))
          .attr('class', 'changedPath')
          .transition()
          .duration(1250)
          .delay(200)
          .attr('d', sparkLine)
          .style('stroke', color)

        d3Select('.dots')
          .selectAll('circle')
          .filter(function (d) { return (d.numberOfActiveProjects !== null) && (d.color === color) })
          .data(line.filter(function (d) { return (d.numberOfActiveProjects !== null) && (d.color === color) }))
          .attr('class', 'changedDot')
          .transition()
          .attr('cx', sparkLine.x())
          .attr('cy', sparkLine.y())
          .delay(200)
          .duration(1250)
          .style('fill', function (d) { return d.color })
      })

      // makes all unchanged lines invisible
      d3Select('.lines')
        .selectAll('.unchangedPath')
        .transition()
        .delay(200)
        .duration(1250)
        .style('stroke', 'transparent')

      d3Select('.lines')
        .selectAll('.changedPath')
        .attr('class', 'unchangedPath')

      // all circles that are not in the new list need to be made invisible
      d3Select('.dots')
        .selectAll('.unchangedDot')
        .transition()
        .delay(200)
        .duration(1250)
        .style('fill', 'transparent')

      d3Select('.dots')
        .selectAll('.changedDot')
        .attr('class', 'unchangedDot')
    }
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

  zurukhBtnAction () {
    this.setState({detailModal: false, projectsPopoverHidden: false})
  }

  updateTimeGraph (data, height, width, margin, minYear, maxYear, visType) {
    if (!this.state.firstUpdate) { // workaround for first time scaling
      this.setState({height: height * 0.5, width: width * 0.6, margin: margin})
    }

    let forschungsbereiche = this.state.forschungsbereiche
    Object.keys(data.dataSplitFbYear).map(value => {
      if (this.state.forschungsbereiche.indexOf(value) === -1) forschungsbereiche = [...forschungsbereiche, value]
    })

    this.setState({dataSplitYears: data.dataSplitFbYear, projectsData: data.projects, forschungsbereiche: forschungsbereiche, firstUpdate: false, minYear: minYear, maxYear: maxYear, visType: visType})
  }

  handleCircleClick (circlePoint) {
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
      <p className={classes.popFixer} style={{
        position: 'absolute',
        backgroundColor: '#333',
        border: '1px solid #4CD8B9',
        margin: '0',
        fontSize: '10px',
        top: '-12em',
        color: '#e9e9e9',
        letterSpacing: '1px',
        borderRadius: '15px',
        overflowY: 'visible',
        overflowX: 'visible',
        padding: '5px 10px'}}>
        {/* {`${this.state.hoveredCircle.numberOfActiveProjects} active projects for ${this.state.hoveredCircle.fb} in ${this.state.hoveredCircle.year}`} */}
        <label>{`${this.state.hoveredCircle.numberOfActiveProjects} Projects in ${this.state.hoveredCircle.year}`} <span style={{
          position: 'absolute', width: '20px', height: '20px', background: arrowHover, backgroundSize: 'cover', bottom: '-15px', left: '42%'}}></span></label>
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

    // create dataset with missing data input as null
    let dataset = JSON.parse(JSON.stringify(Object.values(this.state.dataSplitYears)))

    let missingData = []

    dataset.forEach(element => {
      if (element.length > 0) {
        let missingElements = []
        const fb = element[0].fb
        const color = element[0].color
        for (let i = 0; i <= this.state.maxYear - this.state.minYear; i++) {
          if (element.length <= i) {
            element.push({
              'year': this.state.minYear + i,
              'fb': fb,
              'numberOfActiveProjects': null,
              'color': color
            })
          } else if (element[i].year !== this.state.minYear + i) {
            element.splice(i, 0, {
              'year': this.state.minYear + i,
              'fb': fb,
              'numberOfActiveProjects': null,
              'color': color
            })
          } else {
            if (i !== 0) {
              if (element[i - 1].numberOfActiveProjects == null) {
                missingElements.push({
                  'x': xScale(new Date((this.state.minYear + i).toString())),
                  'y': yScale(element[i].numberOfActiveProjects),
                  'year': element[i].year,
                  'color': color,
                  'state': 'end'})
                missingData.push(missingElements)
                missingElements = []
              }
            }
            if (element.length > i + 1) {
              if (element[i + 1].year !== this.state.minYear + i + 1) {
                missingElements.push({
                  'x': xScale(new Date((this.state.minYear + i).toString())),
                  'y': yScale(element[i].numberOfActiveProjects),
                  'year': element[i].year,
                  'color': color,
                  'state': 'start'})
              }
            }
          } 
        }
        if (missingElements.length !== 0) { missingData.push(missingElements) }
      }
    })
    
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
          <MissingData missingDataPoints={missingData} width={this.state.width} height={this.state.height} visType={this.state.visType}/>

          {/* a transform style prop to our xAxis to translate it to the bottom of the SVG's content. */ }
          <g
            className={styles.xAxis}
            ref={node => d3Select(node).call(xAxis)}
            style={{
              transform: `translateY(${this.state.height}px)`
            }}
          />
          <g className={styles.yAxis} ref={node => d3Select(node).call(yAxis)}/>
          <svg ref={node => (this.node = node)}></svg>

        </SVGWithMargin>
        {this.renderProjectsPopover()}
        {this.renderProjectsHover()}

        {this.state.detailModal &&
          <DetailModal projects={this.state.selectedProjects} index={this.state.index} headline={this.state.title} year={this.state.year} counter={this.state.counter} closeDetailModal={this.closeDetailModal} project={this.state.project} zurukhBtnAction={this.zurukhBtnAction} />
        }
      </div>
    )
  }
}

export default TimeLine
