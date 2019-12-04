import React from "react";
import connect from "react-redux/es/connect/connect";
import ProjectDetailsPanelView from "./project-details-panel-view";
import {
  setSideBarComponent,
  setSelectedInfra,
  setSelectedKta,
  setSelectedCat
} from "../../store/actions/actions";
import FilterPanel from "../FilterPanel/filter-panel";
import CatDetailsPanel from "../CatDetailsPanel/cat-details-panel";
import KtaDetailsPanel from "../KtaDetailsPanel/kta-details-panel";
import InfraDetailsPanel from "../InfraDetailsPanel/infra-details-panel";

const findKtasForProject = state => {
  return state.main.ktas.filter(
    kta => kta.project_id === state.main.selectedProject
  );
};

const mapStateToProps = state => {
  return {
    projectData: state.main.projects.find(
      p => p.id === state.main.selectedProject
    ),
    ktas: findKtasForProject(state)
  };
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => dispatch(setSideBarComponent(<FilterPanel />)),
  showInfraDetails: infra => {
    dispatch(setSelectedInfra(infra));
    dispatch(setSideBarComponent(<InfraDetailsPanel />));
  },
  showKtaDetails: kta => {
    dispatch(setSelectedKta(kta));
    dispatch(setSideBarComponent(<KtaDetailsPanel />));
  },
  showCatDetails: cat => {
    dispatch(setSelectedCat(cat));
    dispatch(setSideBarComponent(<CatDetailsPanel />));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDetailsPanelView);
