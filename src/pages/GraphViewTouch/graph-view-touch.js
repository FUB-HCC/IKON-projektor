import React from "react";
import { connect, batch } from "react-redux";
import ClusterMap from "../../components/ClusterMap/cluster-map";
import TimeGraph from "../../components/TimeLine/time-line";
import classes from "./graph-view-touch.module.css";
import { fetchData, fetchSampleList } from "../../store/actions/actions";
import { appMargin, menuBarHeight } from "../../App";
import { sideBarWidth } from "../../App";

class GraphViewTouch extends React.Component {
  constructor(props) {
    super(props);
    this.margins = { top: 10, left: 10, bottom: 10, right: 30 };
    this.state = {};
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
    document.getElementById("tutorialButton").click();
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

  render() {
    const Graph = (
      <>
        <TimeGraph
          height={this.state.height ? this.state.height * 0.5 : 500}
          width={this.state.width ? this.state.width : 1000}
          id="timelineView"
          data-intro="test"
          data-step="8"
        />
        <ClusterMap height={this.state.height * 0.8} width={this.state.width} />
      </>
    );

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
)(GraphViewTouch);
