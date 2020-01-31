import { connect } from "react-redux";
import React from "react";
import ClusterMapView from "./cluster-map-view";
import concave from "concaveman";
import {
  setSelectedProject,
  setSelectedCat,
  setSelectedInfra,
  setSideBarComponent,
  deselectItems,
  setHighlightState
} from "../../store/actions/actions";
import ProjectDetailsPanel from "../ProjectDetailsPanel/project-details-panel";
import CatDetailsPanel from "../CatDetailsPanel/cat-details-panel";
import InfraDetailsPanel from "../InfraDetailsPanel/infra-details-panel";
import { getFieldColor } from "../../util/utility";

const computeClusters = (clusterData, filteredProjects, categories) => {
  if (!clusterData || categories.length === 0) return [];
  const { cluster_data, project_data, transformedPoints } = clusterData;
  const clusterWords = cluster_data.cluster_words;
  const clusterIds = [...new Set(project_data.map(p => p.cluster))];
  return clusterIds.map(id => ({
    id: id,
    words: clusterWords[id],
    projects: transformedPoints
      .filter(p => p.cluster === id)
      .map(p => ({
        ...p,
        color: filteredProjects.find(project => project.id === p.id)
          ? getFieldColor(p.project.forschungsbereich)
          : "none"
      })),
    concaveHull: concave(
      transformedPoints.filter(p => p.cluster === id).map(p => p.location),
      1
    )
  }));
};

const computeInfrastructureSorted = (
  collections,
  clusterData,
  infrastructures,
  filters
) => {
  if (!clusterData) return [];
  return collections
    .concat(infrastructures)
    .sort((a, b) => (a.type < b.type ? 1 : -1))
    .filter(
      inf =>
        !inf.name.includes("Kein") &&
        (filters.collections.value.includes(inf.name) ||
          filters.infrastructures.value.includes(inf.name))
    );
};

const mapStateToProps = state => {
  const {
    clusterData,
    categories,
    filteredProjects,
    collections,
    infrastructures,
    filters,
    isDataProcessed,
    selectedProject,
    selectedCat,
    selectedInfra,
    highlightedGroup
  } = state.main;

  let clusterDataForView = [];
  let categoriesForView = [];
  let topography = [];
  let InfrastrukturSorted = [];
  if (isDataProcessed) {
    clusterDataForView = computeClusters(
      clusterData,
      filteredProjects,
      categories
    );
    categoriesForView = categories.filter(
      c => c.count > 0 && filters.targetgroups.value.includes(c.title)
    );
    topography = clusterData.cluster_topography;
    InfrastrukturSorted = computeInfrastructureSorted(
      collections,
      clusterData,
      infrastructures,
      filters
    );
  }

  return {
    clusterData: clusterDataForView,
    categories: categoriesForView,
    topography: topography,
    InfrastrukturSorted: InfrastrukturSorted,
    selectedCat: selectedCat,
    selectedProject: selectedProject,
    selectedInfra: selectedInfra,
    highlightedGroup: highlightedGroup
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
    },
    setHighlightState: value => dispatch(setHighlightState(value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClusterMapView);
