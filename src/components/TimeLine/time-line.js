import React from "react";
import { connect } from "react-redux";
import { isTouchMode, applyFilters } from "../../util/utility";
import TimeLineView from "./time-line-view";
import { yearClicked } from "../../store/actions/actions";

class TimeLine extends React.Component {
  componentDidMount() {
    this.Graph.updateTimeGraph(
      {
        dataSplitFbYear: this.props.dataSplitFbYear,
        projects: this.props.projects
      },
      this.props.width,
      this.props.height,
      20
    );
  }

  componentDidUpdate() {
    this.Graph.updateTimeGraph(
      {
        dataSplitFbYear: this.props.dataSplitFbYear,
        projects: this.props.projects
      },
      this.props.height,
      this.props.width,
      20
    );
  }

  render() {
    return (
      <TimeLineView
        ref={node => {
          this.Graph = node;
        }}
        showYearDetails={this.props.showYearDetails}
        onProjectClick={this.props.onProjectClick}
        width={this.props.width}
        height={this.props.height}
        margin={20}
        isTouchMode={this.props.isTouchMode}
      />
    );
  }
}

const graphColors = {
  system: {
    active: "#f0faf0",
    inactive: "#989aa1",
    background: "#434058"
  }
};

const mapDispatchToProps = dispatch => {
  return {
    showYearDetails: year => {
      dispatch(yearClicked(year));
    }
  };
};

const mapStateToProps = state => {
  let projectsForView = applyFilters(state.main.projects, state.main.filters);
  const processedData = processData(projectsForView);
  return {
    dataSplitFbYear: processedData,
    projects: projectsForView,
    colors: graphColors,
    isTouchMode: isTouchMode(state)
  };
};

const processData = data => {
  /*
   Private
   Transforms the data in to a format which can be easily used for the visualization.
   published and unpublished research projects are binned into years
 */

  if (!data || data === []) return [];

  let keys = [1, 2, 3, 4, 5];
  let map = [],
    years = [];
  let projects = data.map(project => {
    let startDate = project.timeframe[0];
    let endDate = project.timeframe[1];
    let years = [];
    while (startDate <= endDate) {
      years.push(startDate++);
    }
    return {
      id: project.id,
      years: years,
      fb: project.forschungsbereich
    };
  });
  let startYear = 2006;
  let endYear = 2026;
  for (let year = startYear; year <= endYear; year++) {
    let submap = {};
    submap.year = year;
    submap.projects = projects
      .filter(p => p.years.includes(year))
      .map(p => p.id);
    keys.map(key => (submap[key] = 0));
    map.push(submap);
    years.push(year);
  }
  projects.forEach(function(project) {
    let fbereich = project.fb;
    project.years.forEach(function(year) {
      map[`${year - startYear}`][`${fbereich}`]++;
    });
  });
  let result = {
    areaChartData: map,
    areaChartKeys: keys,
    years: years
  };
  return result;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeLine);
