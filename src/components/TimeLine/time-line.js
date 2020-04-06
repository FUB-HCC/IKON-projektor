import React from "react";
import { connect } from "react-redux";
import {
  isTouchMode,
  applyFilters,
  applyMissingFilters
} from "../../util/utility";
import TimeLineView from "./time-line-view";
import { yearClicked } from "../../store/actions/actions";

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
  let projectsForView = applyFilters(state.main.projects, state.main.filters);
  let missingProjectsForView = applyMissingFilters(
    state.main.missingprojects,
    state.main.filters
  );
  let categoriesForView = state.main.filters.highlevelFilter.value.includes(6)
    ? state.main.targetgroups.filter(tg =>
        state.main.filters.targetgroups.value.includes(tg.id)
      )
    : state.main.formats.filter(format =>
        state.main.filters.formats.value.includes(format.id)
      );
  const processedKtas = processKtas(state.main.ktas, categoriesForView);
  const processedData = processData(projectsForView, missingProjectsForView);
  return {
    dataSplitFbYear: processedData,
    projects: projectsForView,
    colors: graphColors,
    ktasYearBuckets: processedKtas,
    areKtaRendered: !isTouchMode(state),
    isTouchMode: isTouchMode(state)
  };
};
// TODO move to datatransforms?
const processData = (data, missingData) => {
  /*
   Private
   Transforms the data in to a format which can be easily used for the Visulisation.

     inData - the newProjects.json set or a subset of it

     Returns the visData.

 */

  if (!data || data === [] || !missingData) return [];

  let keys = [...new Set(data.map(b => b.forschungsbereich))].concat(
    "Unveröffentlicht"
  );
  let map = [],
    years = [];
  data = data.concat(missingData);
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

const processKtas = (ktas, categories) => {
  if (!ktas || ktas.length === 0) return [];
  let ktasYearBuckets = [];
  for (let ktaKey in ktas) {
    let ktaCategories = []
      .concat(ktas[ktaKey].Zielgruppe)
      .concat(ktas[ktaKey].Format.map(format => format.name));
    let startDate =
      ktas[ktaKey].timeframe[0].getFullYear() > 1970
        ? ktas[ktaKey].timeframe[0].getFullYear()
        : ktas[ktaKey].timeframe[1].getFullYear();
    let endDate = ktas[ktaKey].timeframe[1]
      ? ktas[ktaKey].timeframe[1].getFullYear()
      : startDate;
    if (startDate > 2000 && ktaCategories.length > 0) {
      for (let category in ktaCategories) {
        let categoryName = ktaCategories[category];
        if (categories.some(t => t.name === categoryName)) {
          if (!(categoryName in ktasYearBuckets)) {
            ktasYearBuckets[categoryName] = [];
          }

          let year = startDate;
          while (year <= endDate) {
            let yearExists = false;
            for (let yearTgIndex in ktasYearBuckets[categoryName]) {
              // check if year already is existent for the forschungsbereich
              if (ktasYearBuckets[categoryName][yearTgIndex].year === year) {
                yearExists = true;
                ktasYearBuckets[categoryName][yearTgIndex].numberOfWtas =
                  ktasYearBuckets[categoryName][yearTgIndex].numberOfWtas + 1;
                ktasYearBuckets[categoryName][yearTgIndex].ktas.push(
                  ktas[ktaKey]
                );
              }
            }

            if (!yearExists) {
              ktasYearBuckets[categoryName].push({
                year: year,
                numberOfWtas: 1,
                ktas: [ktas[ktaKey]]
              });
            }
            year++;
          }
          ktasYearBuckets[categoryName] = ktasYearBuckets[categoryName].sort(
            (a, b) => a.year - b.year
          );
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
