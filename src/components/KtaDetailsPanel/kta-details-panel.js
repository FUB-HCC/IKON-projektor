import connect from "react-redux/es/connect/connect";
import KtaDetailsPanelView from "./kta-details-panel-view";
import {
  unClicked,
  projectClicked,
  catClicked
} from "../../store/actions/actions";

const findCategoriesForKta = state => {
  const { isClicked, categories, ktaMapping } = state.main;
  return categories.filter(cat =>
    ktaMapping.find(
      map => map.kta_id === isClicked.kta && map.targetgroup_id === cat.id
    )
  );
};

const mapStateToProps = state => {
  const { isDataProcessed, isClicked, ktas } = state.main;
  if (isDataProcessed) {
    return {
      kta: ktas.find(kta => kta.id === isClicked.kta),
      categories: findCategoriesForKta(state)
    };
  } else {
    return {};
  }
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => {
    dispatch(unClicked());
  },
  showProjectDetails: project => {
    dispatch(projectClicked(project));
  },
  showCatDetails: cat => {
    dispatch(catClicked(cat));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KtaDetailsPanelView);
