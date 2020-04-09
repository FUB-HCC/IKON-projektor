import React from "react";
import { connect, batch } from "react-redux";
import ClusterMap from "../../components/ClusterMap/cluster-map";
import GeoMap from "../../components/GeoMap/geo-map";
import TimeGraph from "../../components/TimeLine/time-line";
import classes from "./graph-view.module.css";
import { fetchData, fetchSampleList } from "../../store/actions/actions";
import { appMargin, menuBarHeight } from "../../App";
import { sideBarWidth } from "../../App";

/* wrapper for visualization when in browser mode. Depending on state different visualizations are rendered */
class GraphView extends React.Component {
  constructor(props) {
    super(props);
    this.margins = { top: 10, left: 10, bottom: 10, right: 30 };
    this.state = {
      activePopover: this.props.selectedProject ? 1 : -1
    };
    this.changeModalHandler = this.changeModalHandler.bind(this);
    this.changeGraphHandler = this.changeGraphHandler.bind(this);
    this.projectClickHandler = this.projectClickHandler.bind(this);
  }

  componentDidMount() {
    this.setState({
      height: window.innerHeight - menuBarHeight - appMargin * 2,
      width:
        window.innerWidth -
        appMargin * 2 -
        this.margins.left -
        this.margins.right -
        sideBarWidth
    });
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    batch(() => {
      this.props.fetchData();
      this.props.fetchSampleList();
    });
  }

  resize() {
    this.setState({
      height:
        window.innerHeight -
        menuBarHeight -
        appMargin * 4 -
        this.margins.top -
        this.margins.bottom,
      width:
        window.innerWidth -
        appMargin * 2 -
        this.margins.left -
        this.margins.right -
        sideBarWidth
    });
  }

  changeModalHandler(filter) {
    const newState = filter === this.state.activePopover ? -1 : filter;
    this.setState({
      activePopover: newState
    });
    if (newState === -1) {
      this.props.deactivatePopover();
    }
  }

  projectClickHandler(project, vis) {
    this.props.activatePopover(project, vis);
    this.changeModalHandler(1);
  }

  changeGraphHandler(graph) {
    this.props.changeGraph(graph);
    this.setState({
      activePopover: -1
    });
  }

  render() {
    let Graph = <ClusterMap />; // render conditional according to state. Petridish rendered as default
    switch (this.props.graph) {
      case "0":
        Graph = (
          <ClusterMap
            id="step1"
            height={this.state.height}
            width={this.state.width}
          />
        );
        break;
      case "1":
        Graph = (
          <TimeGraph
            id="step2"
            height={this.state.height}
            width={this.state.width}
          />
        );
        break;
      case "2":
        Graph = (
          <GeoMap
            id="step3"
            height={this.state.height}
            width={this.state.width}
          />
        );
        break;
      default:
        break;
    }

    return <div className={classes.OuterDiv}>{Graph}</div>;
  }
}

const mapStateToProps = state => {
  return {
    graph: state.main.graph
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchData: () => dispatch(fetchData()),
    fetchSampleList: () => dispatch(fetchSampleList())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphView);
