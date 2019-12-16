import { connect } from "react-redux";
import React from "react";
import ClusterMapView from "./cluster-map-view";
import _ from "lodash";
import concave from "concaveman";
import {
  setSelectedProject,
  setSelectedCat,
  setSelectedInfra,
  setSideBarComponent,
  deselectItems
} from "../../store/actions/actions";
import ProjectDetailsPanel from "../ProjectDetailsPanel/project-details-panel";
import CatDetailsPanel from "../CatDetailsPanel/cat-details-panel";
import InfraDetailsPanel from "../InfraDetailsPanel/infra-details-panel";
import { getFieldColor } from "../../util/utility";

const mapStateToProps = state => {
  let clusters = [];
  let transformedPoints = [];
  let categories = state.main.filteredCategories;
  let topography = [];
  let typedCollections = state.main.filteredCollections;
  let typedInfrastructures = state.main.filteredInfrastructures;
  if (
    state.main.clusterData &&
    state.main.projects.length > 0 &&
    state.main.ktaMapping.length > 0 &&
    state.main.categories.length > 0
  ) {
    const {
      cluster_data,
      project_data,
      cluster_topography
    } = state.main.clusterData;
    const clusterWords = cluster_data.cluster_words;
    const projects = project_data;
    const minX = _.min(_.map(projects, c => c.embpoint[0]));
    const minY = _.min(_.map(projects, c => c.embpoint[1]));
    topography = cluster_topography;
    categories = state.main.filteredCategories.map(cat => cat);
    transformedPoints = projects.map(p => {
      const cat = _.sample(categories);
      const project = state.main.filteredProjects.find(
        project => p.id === project.id
      );
      const point = {
        ...p,
        location: [p.mappoint[0] - minX, p.mappoint[1] - minY],
        cat: cat.id,
        category: [],
        project: project,
        color: project ? getFieldColor(project.forschungsbereich) : "none"
      };
      if (cat.project_ids.includes(point.id)) {
        cat.connections.push(point);
      }
      return point;
    });

    const clusterIds = _.uniq(_.map(projects, p => p.cluster));
    clusters = _.map(clusterIds, id => ({
      id: id,
      words: clusterWords[id],
      projects: _.filter(transformedPoints, p => p.cluster === id),
      concaveHull: concave(
        transformedPoints.filter(p => p.cluster === id).map(p => p.location),
        1
      )
    }));
    categories.forEach(category => {
      const ktas = state.main.ktaMapping
        .filter(ktaM => ktaM.targetgroup_id === category.id)
        .map(filteredKtaM =>
          state.main.ktas.find(kta => filteredKtaM.kta_id === kta.id)
        );
      category.count = ktas.length;
      category.connections = ktas
        .filter(kta => kta.project_id !== null)
        .map(kta =>
          transformedPoints
            .filter(transPoint => transPoint.project)
            .find(point => point.project.id === kta.project_id)
        )
        .filter(connection => connection);
      category.project_ids = [...new Set(category.connections.map(c => c.id))];
    });

    typedCollections.map(
      collection =>
        (collection.connections = transformedPoints.filter(
          point =>
            point.project && point.project.collections.includes(collection.name)
        ))
    );

    typedInfrastructures.forEach(
      infrastructure =>
        (infrastructure.connections = transformedPoints.filter(
          point =>
            point.project &&
            point.project.infrastructures.includes(infrastructure.name)
        ))
    );
  }
  categories.forEach(category => {
    category.connections.forEach(conn => conn.category.push(category));
  });

  categories = categories.filter(c => c.count > 0);

  let InfrastrukturSorted = typedCollections
    .concat(typedInfrastructures)
    .sort((a, b) => (a.type < b.type ? 1 : -1))
    .filter(inf => !inf.name.includes("Kein"));

  return {
    clusterData: clusters,
    categories: categories,
    topography: topography,
    InfrastrukturSorted: InfrastrukturSorted,
    selectedCat: state.main.selectedCat,
    selectedProject: state.main.selectedProject,
    selectedInfra: state.main.selectedInfra
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showProjectDetails: project => {
      dispatch(deselectItems());
      dispatch(setSelectedProject(project));
      dispatch(setSideBarComponent(<ProjectDetailsPanel />));
    },
    showCatDetails: cat => {
      dispatch(deselectItems());
      dispatch(setSelectedCat(cat));
      dispatch(setSideBarComponent(<CatDetailsPanel />));
    },
    showInfraDetails: infra => {
      dispatch(deselectItems());
      dispatch(setSelectedInfra(infra));
      dispatch(setSideBarComponent(<InfraDetailsPanel />));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClusterMapView);
