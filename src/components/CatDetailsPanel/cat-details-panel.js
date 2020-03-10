import connect from "react-redux/es/connect/connect";
import CatDetailsPanelView from "./cat-details-panel-view";
import {
  unClicked,
  projectClicked,
  ktaClicked,
  showViaWikiRequested
} from "../../store/actions/actions";

const findKtasForTagetgroup = state => {
  return state.main.ktas.filter(kta =>
    state.main.ktaMapping.find(
      map =>
        map.kta_id === kta.id && map.targetgroup_id === state.main.isClicked.cat
    )
  );
};

const mapStateToProps = state => {
  if (state.main.isDataProcessed) {
    return {
      catData: state.main.categories.find(
        c => c.id === state.main.isClicked.cat
      ),
      ktas: findKtasForTagetgroup(state)
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
  showKtaDetails: kta => {
    dispatch(ktaClicked(kta));
  },
  openViaWiki: url => {
    dispatch(showViaWikiRequested(url));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatDetailsPanelView);
