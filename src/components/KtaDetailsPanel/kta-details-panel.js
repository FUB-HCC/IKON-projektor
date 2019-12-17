import React from "react";
import connect from "react-redux/es/connect/connect";
import KtaDetailsPanelView from "./kta-details-panel-view";
import {
  setSelectedProject,
  setSelectedCat,
  setSideBarComponent
} from "../../store/actions/actions";
import FilterPanel from "../FilterPanel/filter-panel";
import ProjectDetailsPanel from "../ProjectDetailsPanel/project-details-panel";
import CatDetailsPanel from "../CatDetailsPanel/cat-details-panel";

const mapStateToProps = state => {
  console.log(state.main.selectedKta);
  return {
    kta: state.main.ktas.find(kta => kta.id === state.main.selectedKta),
    selectedCat: state.main.selectedCat
  };
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => dispatch(setSideBarComponent(<FilterPanel />)),
  showProjectDetails: project => {
    dispatch(setSelectedProject(project));
    dispatch(setSideBarComponent(<ProjectDetailsPanel />));
  },
  showCatDetails: cat => {
    dispatch(setSelectedCat(cat));
    dispatch(setSideBarComponent(<CatDetailsPanel />));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KtaDetailsPanelView);
