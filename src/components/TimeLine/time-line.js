import React from "react";
import { connect } from "react-redux";
import { getFieldColor } from "../../util/utility";
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
  const processedData = processData(state.main.filteredProjects, graphColors);
  return {
    dataSplitFbYear: processedData,
    projects: state.main.filteredProjects,
    colors: graphColors,
    ktasYearBuckets: processedKtas,
    areKtaRendered: true
  };
};

//TODO: make conditional

const processData = (data, colors) => {
  /*
   Private
   Transforms the data in to a format which can be easily used for the Visulisation.

     inData - the newProjects.json set or a subset of it

     Returns the visData.

 */

  if (!data || data === []) return [[], [], [], []];

  let dataSplitYears = [];
  for (let projectsKey in data) {
    if (!(data[projectsKey].forschungsbereichstr in dataSplitYears)) {
      dataSplitYears[data[projectsKey].forschungsbereichstr] = [];
    }

    let startDate = parseInt(data[projectsKey].funding_start_year);
    let endDate = parseInt(data[projectsKey].funding_end_year);
    if (isNaN(endDate) || endDate === "") endDate = new Date().getFullYear();

    let forschungsbereichData =
      dataSplitYears[data[projectsKey].forschungsbereichstr];

    let year = startDate;
    while (year <= endDate) {
      let yearExists = false;
      for (let yearFbIndex in forschungsbereichData) {
        // check if year already is existent for the forschungsbereich
        if (forschungsbereichData[yearFbIndex].year === year) {
          yearExists = true;
          forschungsbereichData[yearFbIndex].numberOfActiveProjects =
            forschungsbereichData[yearFbIndex].numberOfActiveProjects + 1;
          forschungsbereichData[yearFbIndex].projects.push(data[projectsKey]);
        }
      }
      if (!yearExists) {
        forschungsbereichData.push({
          year: year,
          forschungsbereich: data[projectsKey].forschungsbereichstr,
          numberOfActiveProjects: 1,
          projects: [data[projectsKey]],
          color: getFieldColor(data[projectsKey].forschungsbereichstr)
        });
      }
      year++;
    }
    dataSplitYears[
      data[projectsKey].forschungsbereichstr
    ] = forschungsbereichData.sort((a, b) => a.year - b.year);
  }

  return dataSplitYears;
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
