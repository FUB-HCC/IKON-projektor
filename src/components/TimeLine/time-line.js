import React from "react";
import { connect } from "react-redux";
import { isTouchMode } from "../../util/utility";
import TimeLineView from "./time-line-view";
import { yearClicked } from "../../store/actions/actions";
import missingProjects from "../../assets/missingProjects.json";

class TimeLine extends React.Component {
  componentDidMount() {
    this.Graph.updateTimeGraph(
      {
        dataSplitFbYear: this.props.dataSplitFbYear,
        projects: this.props.projects,
        ktasYearBuckets: this.props.ktasYearBuckets
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
        projects: this.props.projects,
        ktasYearBuckets: this.props.ktasYearBuckets
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
        areKtaRendered={this.props.areKtaRendered}
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
  const processedKtas = processKtas(
    state.main.ktas,
    state.main.filteredCategories
  );
  const processedData = processData(state.main.filteredProjects);
  return {
    dataSplitFbYear: processedData,
    projects: state.main.filteredProjects,
    colors: graphColors,
    ktasYearBuckets: processedKtas,
    areKtaRendered: !isTouchMode(state),
    isTouchMode: isTouchMode(state)
  };
};
// TODO move to datatransforms?
const processData = data => {
  /*
   Private
   Transforms the data in to a format which can be easily used for the Visulisation.

     inData - the newProjects.json set or a subset of it

     Returns the visData.

 */

  if (!data || data === []) return [];

  let keys = [...new Set(data.map(b => b.forschungsbereich))].concat(
    "Unveröffentlicht"
  );
  let map = [],
    years = [];
  data = data.concat(missingProjects);
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
      fb: project.forschungsbereichstr
    };
  });
  let startYear = Math.min(...data.map(p => p.timeframe[0]).flat());
  let endYear = Math.max(...data.map(p => p.timeframe[1]).flat());
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

const processKtas = (ktas, filteredTargetgroups) => {
  if (!ktas || ktas === []) return [];

  let ktasYearBuckets = [];
  for (let ktaKey in ktas) {
    let startDate = parseInt(ktas[ktaKey].start_date);
    let endDate = parseInt(ktas[ktaKey].end_date);
    if (isNaN(startDate) || startDate === "") startDate = 1900;
    if (isNaN(endDate) || endDate === "") endDate = startDate;
    if (startDate > 2000 && ktas[ktaKey].targetgroups[0]) {
      for (let targetgroup in ktas[ktaKey].targetgroups) {
        let targetgroupName = ktas[ktaKey].targetgroups[targetgroup];
        if (filteredTargetgroups.some(t => t.title === targetgroupName)) {
          if (!(targetgroupName in ktasYearBuckets)) {
            ktasYearBuckets[targetgroupName] = [];
          }

          let year = startDate;
          while (year <= endDate) {
            let yearExists = false;
            for (let yearTgIndex in ktasYearBuckets[targetgroupName]) {
              // check if year already is existent for the forschungsbereich
              if (ktasYearBuckets[targetgroupName][yearTgIndex].year === year) {
                yearExists = true;
                ktasYearBuckets[targetgroupName][yearTgIndex].numberOfWtas =
                  ktasYearBuckets[targetgroupName][yearTgIndex].numberOfWtas +
                  1;
                ktasYearBuckets[targetgroupName][yearTgIndex].ktas.push(
                  ktas[ktaKey]
                );
              }
            }

            if (!yearExists) {
              ktasYearBuckets[targetgroupName].push({
                year: year,
                numberOfWtas: 1,
                ktas: [ktas[ktaKey]]
              });
            }
            year++;
          }
          ktasYearBuckets[targetgroupName] = ktasYearBuckets[
            targetgroupName
          ].sort((a, b) => a.year - b.year);
        }
      }
    }
  }
  return ktasYearBuckets;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeLine);
