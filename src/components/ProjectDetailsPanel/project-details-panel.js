import connect from "react-redux/es/connect/connect";
import ProjectDetailsPanelView from "./project-details-panel-view";
import {
  unClicked,
  infraClicked,
  ktaClicked,
  catClicked,
  showViaWikiRequested
} from "../../store/actions/actions";

const findKtasForProject = state => {
  const { isClicked, ktas } = state.main;
  return ktas.filter(
    kta =>
      kta.Drittmittelprojekt[0] &&
      kta.Drittmittelprojekt[0].id === isClicked.project
  );
};

const mapStateToProps = state => {
  const { isDataProcessed, isClicked, projects } = state.main;
  if (isDataProcessed) {
    console.log(projects.find(p => p.id === isClicked.project));
    return {
      projectData: projects.find(p => p.id === isClicked.project),
      ktas: findKtasForProject(state)
    };
  } else {
    return {};
  }
};

const mapDispatchToProps = dispatch => ({
  returnToFilterView: () => {
    dispatch(unClicked());
  },
  showInfraDetails: infra => {
    dispatch(infraClicked(infra));
  },
  showKtaDetails: kta => {
    dispatch(ktaClicked(kta));
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
)(ProjectDetailsPanelView);
