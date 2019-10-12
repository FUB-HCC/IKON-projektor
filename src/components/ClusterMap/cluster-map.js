import { connect } from "react-redux";
import React from "react";
import ClusterMapView from "./cluster-map-view";
import _ from "lodash";
import concave from "concaveman";
import {
  setSelectedProject,
  setSideBarComponent
} from "../../store/actions/actions";
import ProjectDetailsPanel from "../ProjectDetailsPanel/project-details-panel";
import { getFieldColor } from "../../util/utility";

const mapStateToProps = state => {
  let clusters = [];
  let transformedPoints = [];
  let categories = state.main.categories;
  if (
    state.main.clusterData &&
    state.main.projects.length > 0 &&
    state.main.ktaMapping.length > 0
  ) {
    const { cluster_data, project_data } = state.main.clusterData;
    const clusterWords = cluster_data.cluster_words;
    const colors = cluster_data.cluster_colour;
    const projects = project_data;
    const minX = _.min(_.map(projects, c => c.embpoint[0]));
    const minY = _.min(_.map(projects, c => c.embpoint[1]));

    categories = state.main.categories.map(cat => cat);
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
      color: colors[id],
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
    });
  }
  categories.forEach(category => {
    category.connections.forEach(conn => conn.category.push(category));
  });

  return {
    clusterData: clusters,
    categories: categories
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showProjectDetails: project => {
      dispatch(setSelectedProject(project));
      dispatch(setSideBarComponent(<ProjectDetailsPanel />));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClusterMapView);
