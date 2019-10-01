import React from "react";
import connect from "react-redux/es/connect/connect";
import ProjectDetailsPanelView from "./project-details-panel-view";
import { setSideBarComponent } from "../../store/actions/actions";
import FilterSelection from "../FilterSelection/filter-selection";

const mapStateToProps = state => {
  return {
    projectData: state.main.projects.find(
      p => p.id === state.main.selectedProject
    )
  };
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => dispatch(setSideBarComponent(<FilterSelection />))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDetailsPanelView);
