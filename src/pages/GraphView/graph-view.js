import React from "react";
import { connect } from "react-redux";
import ClusterMap from "../../components/ClusterMap/cluster-map";
import GeoMap from "../../components/GeoMap/geo-map-view";
import TimeGraph from "../../components/TimeLine/time-line";
import classes from "./graph-view.module.css";
import {
  fetchClusterData,
  fetchInstitutionsData,
  fetchProjectsData,
  fetchKTAData,
  fetchKTAMappingData,
  fetchTargetGroupsData,
  fetchCollectionsData,
  fetchInfrastructureData
} from "../../store/actions/actions";
import { appMargin, menuBarHeight } from "../../App";

class GraphView extends React.Component {
  constructor(props) {
    super(props);
    this.margins = { top: 10, left: 10, bottom: 10, right: 10 };
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      height: window.innerHeight - menuBarHeight - appMargin * 2,
      width:
        (window.innerWidth -
          appMargin * 2 -
          this.margins.left -
          this.margins.right) *
        0.75
    });
    window.addEventListener("resize", this.resize.bind(this));
    this.resize();
    this.props.fetchClusterData();
    this.props.fetchProjectsData();
    this.props.fetchInstitutionsData();
    this.props.fetchKtaData();
    this.props.fetchKtaMappingData();
    this.props.fetchTargetGroupsData();
    this.props.fetchCollectionsData();
    this.props.fetchInfrastructureData();
  }

  resize() {
    this.setState({
      height:
        window.innerHeight -
        menuBarHeight -
        appMargin * 2 -
        this.margins.top -
        this.margins.bottom,
      width:
        (window.innerWidth -
          appMargin * 2 -
          this.margins.left -
          this.margins.right) *
        0.7
    });
  }

  render() {
    const geoMapProps = {
      width: this.state.width,
      height: this.state.height,
      institutions: this.props.institutions,
      projects: this.props.filteredProjects
    };

    const Graph = (
      <>
        <TimeGraph
          id="step2"
          height={this.state.height * 0.2 * 3}
          width={this.state.width}
        />
        <ClusterMap
          id="step1"
          height={this.state.height * 0.8}
          width={this.state.width}
        />
      </>
    );

    return <div className={classes.OuterDiv}>{Graph}</div>;
  }
}

const mapStateToProps = state => {
  return {
    filteredProjects: state.main.filteredProjects,
    institutions: state.main.institutions
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchClusterData: () => dispatch(fetchClusterData()),
    fetchProjectsData: () => dispatch(fetchProjectsData()),
    fetchInstitutionsData: () => dispatch(fetchInstitutionsData()),
    fetchKtaData: () => dispatch(fetchKTAData()),
    fetchKtaMappingData: () => dispatch(fetchKTAMappingData()),
    fetchTargetGroupsData: () => dispatch(fetchTargetGroupsData()),
    fetchCollectionsData: () => dispatch(fetchCollectionsData()),
    fetchInfrastructureData: () => dispatch(fetchInfrastructureData())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GraphView);
