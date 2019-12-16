import React from "react";
import connect from "react-redux/es/connect/connect";
import CatDetailsPanelView from "./cat-details-panel-view";
import {
  setSelectedProject,
  setSelectedKta,
  setSideBarComponent,
  deselectItems
} from "../../store/actions/actions";
import FilterPanel from "../FilterPanel/filter-panel";
import ProjectDetailsPanel from "../ProjectDetailsPanel/project-details-panel";
import KtaDetailsPanel from "../KtaDetailsPanel/kta-details-panel";

const findKtasForTagetgroup = state => {
  return state.main.ktas.filter(kta =>
    state.main.ktaMapping.find(
      map =>
        map.kta_id === kta.id && map.targetgroup_id === state.main.selectedCat
    )
  );
};

const mapStateToProps = state => {
  return {
    catData: state.main.categories.find(c => c.id === state.main.selectedCat),
    ktas: findKtasForTagetgroup(state)
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
)(CatDetailsPanelView);
