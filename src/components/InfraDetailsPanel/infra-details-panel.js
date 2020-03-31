import connect from "react-redux/es/connect/connect";
import InfraDetailsPanelView from "./infra-details-panel-view";
import {
  unClicked,
  projectClicked,
  showViaWikiRequested
} from "../../store/actions/actions";

const mapStateToProps = state => {
  const {
    isDataProcessed,
    isClicked,
    collections,
    infrastructures
  } = state.main;
  if (isDataProcessed && isClicked.infra) {
    let type = "Sammlung";
    let selectedInfrastructure = collections.find(
      c => c.id === isClicked.infra
    );
    if (!selectedInfrastructure) {
      selectedInfrastructure = infrastructures.find(
        i => i.id === isClicked.infra
      );
      type = "Labor";
    }

    return {
      infraData: selectedInfrastructure,
      type: type
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
  openViaWiki: url => {
    dispatch(showViaWikiRequested(url));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfraDetailsPanelView);
