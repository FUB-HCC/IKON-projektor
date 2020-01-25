import React from "react";
import connect from "react-redux/es/connect/connect";
import KtaDetailsPanelView from "./kta-details-panel-view";
import {
  setSelectedProject,
  setSelectedCat,
  setSideBarComponent,
  deselectItems
} from "../../store/actions/actions";
import FilterPanel from "../FilterPanel/filter-panel";
import ProjectDetailsPanel from "../ProjectDetailsPanel/project-details-panel";
import CatDetailsPanel from "../CatDetailsPanel/cat-details-panel";

const findCategoriesForKta = state => {
  return state.main.categories.filter(cat =>
    state.main.ktaMapping.find(
      map =>
        map.kta_id === state.main.selectedKta && map.targetgroup_id === cat.id
    )
  );
};

const mapStateToProps = state => {
  if (state.main.isDataProcessed) {
    return {
      kta: state.main.ktas.find(kta => kta.id === state.main.selectedKta),
      categories: findCategoriesForKta(state)
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
  },
  showCatDetails: cat => {
    dispatch(deselectItems());
    dispatch(setSelectedCat(cat));
    dispatch(setSideBarComponent(<CatDetailsPanel />));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KtaDetailsPanelView);
