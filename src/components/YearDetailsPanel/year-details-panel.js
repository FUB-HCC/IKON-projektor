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
  const year = state.main.selectedYear.split("|")[0];
  const title = state.main.selectedYear.split("|")[1];
  return {
    year: year,
    title: title,
    projects: state.main.projects.filter(
      p =>
        p.forschungsbereich === title &&
        p.timeframe[0] <= year &&
        year <= p.timeframe[1]
    ),
    ktas: state.main.ktas.filter(
      kta =>
        kta.targetgroups.includes(title) &&
        kta.timeframe[0].getFullYear() <= year &&
        year <= kta.timeframe[1].getFullYear()
    )
  };
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
  },
  showKtaDetails: kta => {
    dispatch(deselectItems());
    dispatch(setSelectedKta(kta));
    dispatch(setSideBarComponent(<KtaDetailsPanel />));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(YearDetailsPanelView);
