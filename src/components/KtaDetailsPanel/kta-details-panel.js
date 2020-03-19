import connect from "react-redux/es/connect/connect";
import KtaDetailsPanelView from "./kta-details-panel-view";
import {
  unClicked,
  projectClicked,
  catClicked,
  showViaWikiRequested
} from "../../store/actions/actions";

const mapStateToProps = state => {
  const { isDataProcessed, isClicked, ktas, targetgroups } = state.main;
  if (isDataProcessed) {
    const kta = ktas.find(kta => kta.id === isClicked.kta);
    return {
      kta: kta,
      targetgroups: targetgroups.filter(tg => kta.Zielgruppe.includes(tg.name))
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
  },
  openViaWiki: url => {
    dispatch(showViaWikiRequested(url));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KtaDetailsPanelView);
