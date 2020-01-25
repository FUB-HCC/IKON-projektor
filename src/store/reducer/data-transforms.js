import { fieldsStringToInt } from "../../util/utility";
import _ from "lodash";

export const processProjectsData = state => {
  const projectData = state.projects;
  return Object.values(projectData).map(project => {
    project.hauptthema =
      project.participating_subject_areas &&
      project.participating_subject_areas.split("/")[1]
        ? project.participating_subject_areas.split("/")[1]
        : "Sonstige";
    project.geldgeber = project.sponsor;
    project.timeframe = [
      new Date(project.funding_start_year).getFullYear(),
      new Date(project.funding_end_year).getFullYear()
    ];
    project.collections =
      project.sammlungen && project.sammlungen[0] ? project.sammlungen : [];
    project.infrastructures =
      project.infrastruktur && project.infrastruktur[0]
        ? project.infrastruktur
        : [];
    if (
      project.participating_subject_areas &&
      project.participating_subject_areas.split("/")[0]
    ) {
      return {
        ...project,
        forschungsbereich: project.participating_subject_areas.split("/")[0],
        forschungsbereichstr: project.participating_subject_areas.split("/")[0], // TODO please change API so it does not contain "(# Mitglieder)"
        forschungsbereichNumber: fieldsStringToInt(
          project.participating_subject_areas.split("/")[0]
        )
      };
    } else {
      return {
        ...project,
        forschungsbereich: "Sonstige",
        forschungsbereichstr: "Sonstige", // TODO please change API so it does not contain "(# Mitglieder)"
        forschungsbereichNumber: fieldsStringToInt("Sonstige")
      };
    }
  });
};

export const processClusterData = state => ({
  ...state.clusterData,
  transformedPoints: transformPoints(state)
});

const transformPoints = state => {
  const project_data = state.clusterData.project_data;
  const minX = _.min(project_data.map(c => c.mappoint[0]));
  const minY = _.min(project_data.map(c => c.mappoint[1]));
  return project_data.map(p => {
    const cat = _.sample(state.categories); // TODO: Why are we randomly assigning categories ??
    const project = processProjectsData(state).find(
      project => p.id === project.id
    );
    return {
      ...p,
      location: [-1 * p.mappoint[0] - 0.76 * minX, p.mappoint[1] - minY], // TODO: Why the heck -0.76 * minX ????
      cat: cat.id,
      category: [],
      project: project
    };
  });
};

export const processCategories = state => {
  const ktaMapping = state.ktaMapping;
  const ktas = processFormats(state);
  const clusterData = processClusterData(state);
  return state.categories.map(category => {
    const filteredKtas = ktaMapping
      .filter(ktaM => ktaM.targetgroup_id === category.id)
      .map(filteredKtaM => ktas.find(kta => filteredKtaM.kta_id === kta.id));
    const connections = filteredKtas
      .filter(kta => kta.project_id !== null)
      .map(kta =>
        clusterData.transformedPoints.find(
          point => point.project.id === kta.project_id
        )
      )
      .filter(connection => connection);
    return {
      ...category,
      connections: connections,
      count: filteredKtas.length,
      project_ids: [...new Set(connections.map(c => c.id))]
    };
  });
};

export const processInfrastructures = state =>
  state.infrastructures.map(infrastructure => ({
    ...infrastructure,
    connections: [],
    type: "infrastructure"
  }));

export const processCollections = state =>
  state.collections.map(collection => ({
    ...collection,
    connections: [],
    type: "collection"
  }));

export const processFormats = state =>
  state.ktas.map(kta => ({
    ...kta,
    timeframe: [new Date(kta.start_date), new Date(kta.end_date)]
  }));
