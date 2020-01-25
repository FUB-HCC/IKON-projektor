import React from "react";
import connect from "react-redux/es/connect/connect";
import InfraDetailsPanelView from "./infra-details-panel-view";
import {
  setSelectedProject,
  setSideBarComponent,
  deselectItems
} from "../../store/actions/actions";
import FilterPanel from "../FilterPanel/filter-panel";
import ProjectDetailsPanel from "../ProjectDetailsPanel/project-details-panel";

const filterProjectsByInfra = (infrastructure, projects) =>
  projects.filter(
    project =>
      project.infrastructures.includes(infrastructure.name) ||
      project.collections.includes(infrastructure.name)
  );

const mapStateToProps = state => {
  if (state.main.isDataProcessed && state.main.selectedInfra) {
    const selectedInfrastructure =
      state.main.collections.find(c => c.name === state.main.selectedInfra) ||
      state.main.infrastructures.find(i => i.name === state.main.selectedInfra);
    return {
      infraData: selectedInfrastructure,
      connectedProjects: filterProjectsByInfra(
        selectedInfrastructure,
        state.main.projects
      )
    };
  } else {
    return {};
  }
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => {
    dispatch(setSideBarComponent(<FilterPanel />));
    dispatch(deselectItems());
  },
  showProjectDetails: project => {
    dispatch(deselectItems());
    dispatch(setSelectedProject(project));
    dispatch(setSideBarComponent(<ProjectDetailsPanel />));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfraDetailsPanelView);
