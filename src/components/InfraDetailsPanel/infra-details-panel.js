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

const mapStateToProps = state => {
  return {
    infraData:
      state.main.collections.find(c => c.name === state.main.selectedInfra) ||
      state.main.infrastructures.find(i => i.name === state.main.selectedInfra)
  };
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => {
    dispatch(setSideBarComponent(<FilterPanel />));
    dispatch(deselectItems());
  },
  showProjectDetails: project => {
    dispatch(setSelectedProject(project));
    dispatch(setSideBarComponent(<ProjectDetailsPanel />));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfraDetailsPanelView);
