import React from "react";
import connect from "react-redux/es/connect/connect";
import YearDetailsPanelView from "./year-details-panel-view";
import {
  setSelectedProject,
  setSelectedKta,
  setSideBarComponent,
  deselectItems
} from "../../store/actions/actions";
import FilterPanel from "../FilterPanel/filter-panel";
import ProjectDetailsPanel from "../ProjectDetailsPanel/project-details-panel";
import KtaDetailsPanel from "../KtaDetailsPanel/kta-details-panel";

const mapStateToProps = state => {
  return {
    year: state.main.selectedYear
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
  },
  showKtaDetails: kta => {
    dispatch(setSelectedKta(kta));
    dispatch(setSideBarComponent(<KtaDetailsPanel />));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearDetailsPanelView);
