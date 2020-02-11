import connect from "react-redux/es/connect/connect";
import ProjectDetailsPanelView from "./project-details-panel-view";
import {
  unClicked,
  infraClicked,
  ktaClicked,
  catClicked
} from "../../store/actions/actions";

const findKtasForProject = state => {
  const { isClicked, ktas } = state.main;
  return ktas.filter(kta => kta.project_id === isClicked.project);
};

const mapStateToProps = state => {
  const { isDataProcessed, isClicked, projects } = state.main;
  if (isDataProcessed) {
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectDetailsPanelView);
