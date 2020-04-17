import connect from "react-redux/es/connect/connect";
import CatDetailsPanelView from "./cat-details-panel-view";
import {
  unClicked,
  projectClicked,
  ktaClicked,
  showViaWikiRequested
} from "../../store/actions/actions";

const mapStateToProps = state => {
  if (state.main.isDataProcessed) {
    return {
      catData: state.main.targetgroups.find(
        c => c.id === state.main.isClicked.cat
      )
        ? state.main.targetgroups.find(c => c.id === state.main.isClicked.cat)
        : state.main.formats.find(c => c.id === state.main.isClicked.cat),
      type: state.main.targetgroups.find(c => c.id === state.main.isClicked.cat)
        ? "Zielgruppe"
        : "Format"
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
