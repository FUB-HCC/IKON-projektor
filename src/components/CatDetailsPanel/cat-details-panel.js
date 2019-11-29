import React from "react";
import connect from "react-redux/es/connect/connect";
import CatDetailsPanelView from "./cat-details-panel-view";
import { setSelectedProject,
  setSideBarComponent } from "../../store/actions/actions";
import FilterPanel from "../FilterPanel/filter-panel";
import ProjectDetailsPanel from "../ProjectDetailsPanel/project-details-panel";
const mapStateToProps = state => {
  return {
    catData: state.main.categories.find(
      c => c.id === state.main.selectedCat
    ),
    ktas: state.main.ktas
  };
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => dispatch(setSideBarComponent(<FilterPanel />)),
  showProjectDetails: project => {
    dispatch(setSelectedProject(project));
    dispatch(setSideBarComponent(<ProjectDetailsPanel />));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatDetailsPanelView);
