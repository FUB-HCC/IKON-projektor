import React, { Component } from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";
import classes from "./navigation-subpages.module.css";
import { connect } from "react-redux";
import logo from "../../assets/ikon_logo.png";
import { menuBarHeight } from "../../App";
import { changeGraph } from "../../store/actions/actions";

class NavigationSubpages extends Component {
  constructor(props) {
    super(props);
    this.changeGraphHandler = this.changeGraphHandler.bind(this);
    this.state = {
      active: "WISSEN"
    };
  }

  changeGraphHandler(graph) {
    if (graph === "0") {
      this.setState({ active: "WISSEN" });
    }
    if (graph === "1") {
      this.setState({ active: "ZEIT" });
    }
    if (graph === "2") {
      this.setState({ active: "RAUM" });
    }
    this.props.changeGraph(graph);
    this.setState({
      activePopover: -1
    });
  }

  startTour() {
    var tour = introJs();
    tour.setOption("tooltipPosition", "auto");
    tour.setOption("positionPrecedence", ["right", "top", "left", "bottom"]);
    tour.setOption("hidePrev", true);
    tour.setOption("hideNext", true);
    tour.setOption("showStepNumbers", false);
    tour.setOption("overlayOpacity", 0.2);
    tour.setOption("tooltipClass", classes.introTooltip);
    tour.setOption("highlightClass", classes.introHighlightClass);
    tour.start();
  }

  render() {
    return (
      <div className={classes.navbar} style={{ flexBasis: menuBarHeight }}>
        <div className={classes.leftpanel}>
          <ul className={classes.ContainerSub}>
            <li>
              <div
                className={classes.NavigationElement + " " + classes.logo}
                to="/projects"
              >
                <img src={logo} alt={"The logo should be here!"} />
              </div>
            </li>
            <li>
              <div
                className={
                  classes.NavigationElement +
                  " " +
                  (this.state.active === "WISSEN" ? classes.active : "")
                }
                onClick={() => this.changeGraphHandler("0")}
              >
                WISSEN{" "}
                <small className={classes.smallHeadTxt}>
                  Projekte in Clustern
                </small>{" "}
              </div>
            </li>
            <li>
              <div
                className={
                  classes.NavigationElement +
                  " " +
                  (this.state.active === "ZEIT" ? classes.active : "")
                }
                onClick={() => this.changeGraphHandler("1")}
              >
                ZEIT{" "}
                <small className={classes.smallHeadTxt}>
                  Anzahl der Projekte uber Jahre
                </small>{" "}
              </div>
            </li>
            <li>
              <div
                className={
                  classes.NavigationElement +
                  " " +
                  (this.state.active === "RAUM" ? classes.active : "")
                }
                onClick={() => this.changeGraphHandler("2")}
              >
                RAUM
              </div>
            </li>
          </ul>
        </div>
        <div className={classes.rightPanel}>
          <ul>
            <li>
              <div
                className={classes.NavigationRightElement}
                onClick={() => this.startTour()}
              >
                HILFE
              </div>
            </li>
            <li>
              <div className={classes.NavigationRightElement}>MENU</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeGraph: value => dispatch(changeGraph(value))
  };
};
const mapStateToProps = state => {
  let selectedProject;
  state.main.projects.forEach(project => {
    if (project.id === state.main.selectedProject) selectedProject = project;
  });

  return {
    graph: state.main.graph,
    filterAmount: Object.keys(state.main.filters).length,
    selectedProject: state.main.selectedProject,
    selectedDataPoint: selectedProject,
    filter: state.main.filters,
    filteredData: state.main.filteredProjects
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationSubpages);
