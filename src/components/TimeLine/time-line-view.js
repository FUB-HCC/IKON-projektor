import "d3-transition";
import styles from "./time-line-view.module.css";
import React, { Component } from "react";
import SVGWithMargin from "./SVGWithMargin";

// Import the D3 libraries we'll be using for the spark line.
import { extent as d3ArrayExtent } from "d3-array";
import {
  scaleLinear as d3ScaleLinear,
  scaleTime as d3ScaleTime
} from "d3-scale";
import { line as d3Line } from "d3-shape";
// Import the D3 libraries we'll use for the axes.
import { axisBottom as d3AxisBottom, axisLeft as d3AxisLeft } from "d3-axis";
import { select as d3Select } from "d3-selection";
import HoverPopover from "../HoverPopover/HoverPopover";
import arrowHover from "../../assets";
import { getIcon } from "../../util/utility";

class TimeLineView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSplitYears: [],
      forschungsbereiche: [],
      ktasSplitYears: [],
      height: props.height * 0.25,
      width: props.width * 0.95,
      margin: props.margin,
      firstUpdate: true,
      projectsPopoverHidden: true,
      detailModal: false,
      project: {},
      title: "",
      year: "",
      counter: 0,
      index: 0
    };
    this.handleCircleClick = this.handleCircleClick.bind(this);
    this.renderProjectsHover = this.renderProjectsHover.bind(this);
    this.handleCircleMouseLeave = this.handleCircleMouseLeave.bind(this);
    this.handleCircleMouseEnter = this.handleCircleMouseEnter.bind(this);
    this.onProjectClick = this.onProjectClick.bind(this);
    this.closeDetailModal = this.closeDetailModal.bind(this);
    this.zurukhBtnAction = this.zurukhBtnAction.bind(this);

    // this.loadPaths = this.loadPaths.bind(this)
  }
  onProjectClick(project) {
    let selectedProjects = this.state.selectedProjects;
    let current = project.project;
    let title = "";
    let year = "";
    let counter = 0;
    let index = 0;
    if (selectedProjects) {
      title = selectedProjects[0].research_area;
      selectedProjects.forEach(project => {
        counter++;
        year = project.start_date;
        if (current.id === project.id) {
          index = counter;
        }
      });
    }
    this.setState({
      detailModal: true,
      project: project,
      title,
      year,
      counter,
      index
    });
  }

  closeDetailModal() {
    this.setState({ detailModal: false });
  }

  zurukhBtnAction() {
    this.setState({ detailModal: false, projectsPopoverHidden: false });
  }

  updateTimeGraph(data, height, width, margin) {
    if (!this.state.firstUpdate) {
      // workaround for first time scaling
      this.setState({
        height: height * 0.25,
        width: width * 0.95,
        margin: margin
      });
    }

    let forschungsbereiche = this.state.forschungsbereiche;
    Object.keys(data.dataSplitFbYear).forEach(value => {
      if (this.state.forschungsbereiche.indexOf(value) === -1)
        forschungsbereiche = [...forschungsbereiche, value];
    });

    this.setState({
      dataSplitYears: data.dataSplitFbYear,
      ktasSplitYears: data.ktasSplitYears,
      projectsData: data.projects,
      forschungsbereiche: forschungsbereiche,
      firstUpdate: false
    });
  }

  handleCircleClick(evt, circlePoint) {
    let selectedProjects = circlePoint.projects;
    this.setState({
      projectsPopoverHidden: false,
      selectedProjects: selectedProjects,
      detailModal: false
    });
  }

  renderProjectsHover() {
    return (
      this.state.hoveredCircle &&
      this.state.mouseLocation && (
        <HoverPopover
          width={"15em"}
          height={"5em"}
          locationX={this.state.mouseLocation[0]}
          locationY={this.state.mouseLocation[1]}
        >
          <p
            className={styles.popFixer}
            style={{
              position: "absolute",
              backgroundColor: "#333",
              border: "1px solid #4CD8B9",
              margin: "0",
              fontSize: "10px",
              top: "-12em",
              color: "#e9e9e9",
              letterSpacing: "1px",
              borderRadius: "15px",
              overflowY: "visible",
              overflowX: "visible",
              padding: "5px 10px"
            }}
          >
            {/* {`${this.state.hoveredCircle.numberOfActiveProjects} active projects for ${this.state.hoveredCircle.fb} in ${this.state.hoveredCircle.year}`} */}
            <label>
              {`${this.state.hoveredCircle.numberOfActiveProjects} aktive Projekte in ${this.state.hoveredCircle.fb} im Jahr  ${this.state.hoveredCircle.year}`}{" "}
              <span
                style={{
                  position: "absolute",
                  width: "20px",
                  height: "20px",
                  background: arrowHover,
                  backgroundSize: "cover",
                  bottom: "-15px",
                  left: "42%"
                }}
              ></span>
            </label>
          </p>
        </HoverPopover>
      )
    );
  }

  handleCircleMouseEnter(circlePoint, evt) {
    this.setState({
      hoveredCircle: circlePoint,
      mouseLocation: [evt.nativeEvent.clientX, evt.nativeEvent.clientY]
    });
  }

  handleCircleMouseLeave(evt) {
    this.setState({ hoveredCircle: undefined });
  }

  render() {
    let array = [].concat.apply([], Object.values(this.state.dataSplitYears));

    const selectY = datum => datum.numberOfActiveProjects;
    const selectX = datum =>
      new Date(datum.year.toString()).setHours(0, 0, 0, 0);

    // Since this is "time series" visualization, our x axis should have a time scale.
    // Our x domain will be the extent ([min, max]) of x values (Dates) in our data set.
    // Our x range will be from x=0 to x=width.
    const xScale = d3ScaleTime()
      .domain(d3ArrayExtent(array, selectX))
      .range([0, this.state.width]);

    // Our y axis should just have a linear scale.
    // Our y domain will be the extent of y values (numbers) in our data set.
    const yScale = d3ScaleLinear()
      .domain(d3ArrayExtent(array, selectY))
      .range([this.state.height, 0]);

    // Add an axis for our x scale which has half as many ticks as there are rows in the data set.
    const xAxis = d3AxisBottom()
      .scale(xScale)
      .ticks(array.length / 4);

    // Add an axis for our y scale that has 3 ticks
    const yAxis = d3AxisLeft()
      .scale(yScale)
      .ticks(3);

    // These two functions select the scaled x and y values (respectively) of our data.
    const selectScaledX = datum => xScale(selectX(datum));
    const selectScaledY = datum => yScale(selectY(datum));

    // Create a d3Line factory for our scales.
    const sparkLine = d3Line()
      .x(selectScaledX)
      .y(selectScaledY);

    // map our data to scaled points.
    const circlePoints = array.map(datum =>
      Object.assign(
        {
          x: selectScaledX(datum),
          y: selectScaledY(datum),
          color: datum.color,
          icon: getIcon(0),
          fb: datum.fb
        },
        datum
      )
    );
    return (
      <div style={{ marginTop: this.props.height * 0.05 }}>
        <div className={styles.ktasPlot}>
          {Object.keys(this.state.ktasSplitYears).map(targetgroup => {
            if (this.state.ktasSplitYears[targetgroup].length < 3) {
              return "";
            }
            return (
              <div key={targetgroup} className={styles.ktasLine}>
                <span>{targetgroup}</span> <br />
                <svg height={40} width={this.state.width}>
                  {this.state.ktasSplitYears[targetgroup].map(year => {
                    return (
                      <circle
                        key={targetgroup + year.year}
                        cx={
                          xScale(
                            new Date(year.year.toString()).setHours(0, 0, 0, 0)
                          ) + this.state.margin
                        }
                        cy={19}
                        r={Math.max(year.numberOfWtas / 2, 1)}
                        fill="#fff"
                        stroke="#fff"
                      />
                    );
                  })}
                  <line
                    x1="0"
                    y1="40"
                    x2={this.state.width}
                    y2="40"
                    stroke="#717071"
                    fill="none"
                  />
                </svg>
              </div>
            );
          })}
        </div>
        <SVGWithMargin
          className={styles.timelineContainer}
          contentContainerBackgroundRectClassName={
            styles.timelineContentContainerBackgroundRect
          }
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
          <g
            className={styles.yAxis}
            ref={node => d3Select(node).call(yAxis)}
          />

          {Object.values(this.state.dataSplitYears).map((line, i) => {
            if (line.length === 0) {
              return <g />;
            }
            return (
              <g key={line[0].fb} className={styles.line}>
                <path style={{ stroke: line[0].color }} d={sparkLine(line)} />
              </g>
            );
          })}

          {/* a group for our scatter plot, and render a circle at each `circlePoint`. */}
          <g className={styles.scatter}>
            {circlePoints.map(circlePoint => (
              <svg
                width={20}
                height={20}
                x={circlePoint.x - 10}
                y={circlePoint.y - 10}
                viewBox="0 0 100 100"
                fill={circlePoint.color}
                stroke={circlePoint.color}
                style={{
                  fill: circlePoint.color,
                  pointerEvents: "fill"
                }}
                key={`circle-${circlePoint.x},${circlePoint.y},${circlePoint.fb}`}
                onClick={evt => {
                  this.handleCircleClick(evt, circlePoint);
                }}
                onMouseLeave={this.handleCircleMouseLeave}
                onMouseMove={event => {
                  this.handleCircleMouseEnter(circlePoint, event);
                }}
                onMouseEnter={event => {
                  this.handleCircleMouseEnter(circlePoint, event);
                }}
              >
                <path d={circlePoint.icon} />
              </svg>
            ))}
          </g>
        </SVGWithMargin>

        {this.renderProjectsHover()}
      </div>
    );
  }
}

export default TimeLineView;
