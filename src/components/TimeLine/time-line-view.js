import React, { Component } from "react";
import "d3-transition";
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

import styles from "./time-line-view.module.css";
import SVGWithMargin from "./SVGWithMargin";
import HoverPopover from "../HoverPopover/HoverPopover";
import TargetgroupBuckets from "./TargetgroupBuckets";
import InteractionHandler from "../../util/interaction-handler";

export default class TimeLineView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSplitYears: [],
      forschungsbereiche: [],
      ktasYearBuckets: [],
      height: props.height,
      width: props.width - 15,
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
        height: height,
        width: width - 15,
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
      ktasYearBuckets: data.ktasYearBuckets,
      projectsData: data.projects,
      forschungsbereiche: forschungsbereiche,
      firstUpdate: false
    });
  }

  handleCircleClick(evt, circlePoint) {
    this.props.showYearDetails(
      circlePoint.year + "|" + circlePoint.forschungsbereich
    );
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
          height="20px"
          locationX={this.state.mouseLocation[0]}
          locationY={this.state.mouseLocation[1]}
        >
          <p
            className={styles.popFixer}
            style={{
              position: "absolute",
              backgroundColor: "#1c1d1f",
              margin: "0",
              fontSize: "10px",
              color: "#afca0b",
              fontWeight: "500",
              letterSpacing: "1px",
              overflow: "hidden",
              padding: "5px 10px"
            }}
          >
            <label>
              {this.state.hoveredCircle.forschungsbereich
                ? `${this.state.hoveredCircle.year}: ${this.state.hoveredCircle.numberOfActiveProjects} aktive Projekte in ${this.state.hoveredCircle.forschungsbereich}`
                : `${this.state.hoveredCircle.year}: ${this.state.hoveredCircle.count} Wissenstransferaktivitäten mit der Zielgruppe ${this.state.hoveredCircle.targetgroup}`}
            </label>
          </p>
        </HoverPopover>
      )
    );
  }

  highlightGridLine() {
    return (
      this.state.hoveredCircle &&
      !this.state.hoveredCircle.forschungsbereich &&
      this.state.mouseLocation && (
        <svg
          key="highlightedGridline"
          style={{
            height: this.props.height,
            width: this.props.width,
            position: "absolute",
            zIndex: -95
          }}
        >
          <line
            x1={this.state.hoveredCircle.x + "px"}
            y1="0%"
            x2={this.state.hoveredCircle.x + "px"}
            y2="100%"
            stroke="#afca0b"
          />
        </svg>
      )
    );
  }
  renderGridline(lines) {
    return (
      <svg
        key="gridline"
        style={{
          height: this.props.height,
          width: this.props.width,
          position: "absolute",
          zIndex: -99
        }}
      >
        {lines.map((line, i) => (
          <line
            x1={line + this.state.margin + "px"}
            y1="0%"
            x2={line + this.state.margin + "px"}
            y2="100%"
            stroke="rgba(65,64,65,0.6)"
            fill="none"
            key={i}
          />
        ))}
      </svg>
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
    const { areKtaRendered, isTouchMode } = this.props;
    const stackedAreaHeight = this.state.height * 0.4;
    const targetgroupsHeight = this.state.height * 0.5;
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
      .range([stackedAreaHeight, 0]);

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

    //all years with wta in targetgroup in one array
    const ktasYears = [].concat.apply(
      [],
      Object.values(this.state.ktasYearBuckets)
    );

    //getting all distinct years that have targetgroup Bucket
    const lines = [
      ...new Set(
        ktasYears.map(line =>
          xScale(new Date(line.year.toString()).setHours(0, 0, 0, 0))
        )
      )
    ];
    // map our data to scaled points.
    const circlePoints = array.map(datum =>
      Object.assign(
        {
          x: selectScaledX(datum),
          y: selectScaledY(datum),
          color: datum.color,
          forschungsbereich: datum.forschungsbereich
        },
        datum
      )
    );
    return (
      <div
        data-intro="In der Ansicht <b>ZEIT</b> wird eine weitere integrative Perspektive auf die Verläufe von Wissenstransferaktivitäten und Drittmittelprojekten über die Jahre dargestellt. Hierdurch können zum Beispiel Trends gefunden werden, welche in der Planung von Wissentransfer berücksichtigt werden könnten."
        data-step="1"
        style={{ height: "auto", marginLeft: this.state.margin * 0.8 }}
      >
        <div
          data-intro="Durch diese Ansicht auf <b>Wissenstransferaktivitäten</b> und <b>Drittmittelprojekte</b> wird ermöglicht, beide Elemente des Museums für Naturkunde integrativ und längerfristig zu betrachten."
          data-step="4"
        >
          {areKtaRendered && (
            <>
              {this.renderGridline(lines)}
              {this.highlightGridLine()}

              <div
                data-intro="Im oberen Teil dieser Ansicht werden Wissenstransferaktivitäten gruppiert nach <b>Zielgruppen</b> angezeigt. Die Größe der Kreise deutet die Menge an Aktivitäten mit einer bestimmten Zielgruppe in einem Jahr an. Hierdurch werden längerfristige Perspektiven auf Wissenstransfer ermöglicht."
                data-step="2"
                className={styles.ktaBucketsWrapper}
                style={{ height: targetgroupsHeight }}
              >
                <span className={styles.plotTitle}>
                  Wissenstransferaktivitäten <br />
                  <br />
                </span>
                <TargetgroupBuckets
                  ktasYearBuckets={this.state.ktasYearBuckets}
                  height={this.state.height * 0.03}
                  width={this.state.width}
                  showYearDetails={this.props.showYearDetails}
                  fullHeight={this.state.height}
                  xScale={year =>
                    xScale(new Date(year.toString()).setHours(0, 0, 0, 0)) +
                    this.state.margin
                  }
                  handleCircleMouseEnter={this.handleCircleMouseEnter}
                  handleCircleMouseLeave={this.handleCircleMouseLeave}
                />
              </div>
            </>
          )}

          <SVGWithMargin
            data-intro="Im unteren Teil werden die Anzahl und Laufzeiten von <b>Drittmittelprojekten</b> basierend auf aktuellen Informationen aus dem <a style='color: #afca0b;' href='https://via.museumfuernaturkunde.berlin/wiki/' target='_blank' rel='noopener noreferrer'>VIA-Wiki</a> und gruppiert nach <b>Forschungsgebieten</b> angezeigt. Um die Interpretation von Trend-Entwicklungen zu unterstützen, werden außerdem in grauer Schattierung bisher noch nicht integrierte Daten zu Drittmittelprojekten dargestellt."
            data-step="3"
            className={styles.timelineContainer}
            contentContainerBackgroundRectClassName={
              styles.timelineContentContainerBackgroundRect
            }
            contentContainerGroupClassName={styles.timelineContentContainer}
            height={stackedAreaHeight}
            margin={this.state.margin}
            width={this.state.width}
          >
            {areKtaRendered && (
              <text
                fill="#717071"
                x={-this.state.margin}
                y="10"
                fontSize="130%"
              >
                Forschungsprojekte
              </text>
            )}
            {/* a transform style prop to our xAxis to translate it to the bottom of the SVG's content. */}
            <g
              className={styles.xAxis}
              ref={node => d3Select(node).call(xAxis)}
              style={{
                transform: `translateY(${stackedAreaHeight}px)`
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
                <g key={line[0].forschungsbereich} className={styles.line}>
                  <path style={{ stroke: line[0].color }} d={sparkLine(line)} />
                </g>
              );
            })}

            {/* a group for our scatter plot, and render a circle at each `circlePoint`. */}
            <g className={styles.scatter}>
              {circlePoints.map(circlePoint => (
                <InteractionHandler
                  isInTouchMode={isTouchMode}
                  onMouseOver={event => {
                    this.handleCircleMouseEnter(circlePoint, event);
                  }}
                  onMouseLeave={this.handleCircleMouseLeave}
                  onClick={evt => {
                    this.handleCircleClick(evt, circlePoint);
                  }}
                  longPressThreshold={300}
                >
                  <circle
                    r="5"
                    cx={circlePoint.x}
                    cy={circlePoint.y}
                    fill={circlePoint.color}
                    stroke={circlePoint.color}
                    style={{
                      fill: circlePoint.color,
                      pointerEvents: "fill"
                    }}
                    key={`circle-${circlePoint.x},${circlePoint.y},${circlePoint.forschungsbereich}`}
                  />
                </InteractionHandler>
              ))}
            </g>
          </SVGWithMargin>
          {this.renderProjectsHover()}
          {!areKtaRendered && (
            <div
              className={styles.subScriptLargeScreen}
              style={{
                marginLeft: this.state.margin,
                marginBottom: this.state.margin / 2
              }}
            >
              Anzahl Projekte je Forschungsgebiet pro Jahr
            </div>
          )}
        </div>
      </div>
    );
  }
}
