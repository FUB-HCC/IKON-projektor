import React from "react";
import { connect } from "react-redux";
import { getFieldColor } from "../../util/utility";
import TimeLineView from "./time-line-view";

class TimeLine extends React.Component {
  componentDidMount() {
    this.Graph.updateTimeGraph(
      {
        dataSplitFbYear: this.props.dataSplitFbYear,
        projects: this.props.projects,
        ktasSplitYears: this.props.ktasSplitYears
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
        ktasSplitYears: this.props.ktasSplitYears
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
        onProjectClick={this.props.onProjectClick}
        width={this.props.width}
        height={this.props.height}
        margin={20}
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

const mapStateToProps = state => {
  const processedKtas = processKtas(state.main.ktas);
  const processedData = processData(state.main.filteredProjects, graphColors);
  return {
    dataSplitFbYear: processedData,
    projects: state.main.filteredProjects,
    colors: graphColors,
    ktasSplitYears: processedKtas
  };
};

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
      //color: clusterData.project_data[projectsKey] ? clusterData.cluster_data.cluster_colour[clusterData.project_data[projectsKey].cluster] : getFieldColor(data[projectsKey].forschungsbereichstr)
      if (!yearExists) {
        forschungsbereichData.push({
          year: year,
          fb: data[projectsKey].forschungsbereichstr,
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

const processKtas = (ktas) => {

  if (!ktas || ktas === []) return [];

  let ktasSplitYears = [];
  for (let ktaKey in ktas) {
    let startDate = parseInt(ktas[ktaKey].start_date);
    let endDate = parseInt(ktas[ktaKey].end_date);
    if (isNaN(startDate) || startDate === "") startDate = 1900;
    if (isNaN(endDate) || endDate === "") endDate = startDate;
    if(startDate > 2000){
      for (let targ in ktas[ktaKey].targetgroups){
        let targName = ktas[ktaKey].targetgroups[targ];
        if (!(targName in ktasSplitYears)) {
          ktasSplitYears[targName] = [];
        }

        let year = startDate;
        while (year <= endDate) {
          let yearExists = false;
          for (let yearTgIndex in ktasSplitYears[targName]) {
            // check if year already is existent for the forschungsbereich
            if (ktasSplitYears[targName][yearTgIndex].year === year) {
              yearExists = true;
              ktasSplitYears[targName][yearTgIndex].numberOfWtas =
                ktasSplitYears[targName][yearTgIndex].numberOfWtas + 1;
              ktasSplitYears[targName][yearTgIndex].ktas.push(ktas[ktaKey]);
            }
          }

          if (!yearExists) {
            ktasSplitYears[targName].push({
              year: year,
              numberOfWtas: 1,
              ktas: [ktas[ktaKey]]
            });
          }
          year++;
        }
        ktasSplitYears[targName] = ktasSplitYears[targName].sort((a, b) => a.year - b.year);
      }

    }
  }
  return ktasSplitYears;
}

export default connect(mapStateToProps)(TimeLine);
