import connect from "react-redux/es/connect/connect";
import InfraDetailsPanelView from "./infra-details-panel-view";
import {
  unClicked,
  projectClicked,
  showViaWikiRequested
} from "../../store/actions/actions";

const filterProjectsByInfra = (infrastructure, projects) =>
  projects.filter(
    project =>
      project.infrastructures.includes(infrastructure.name) ||
      project.collections.includes(infrastructure.name)
  );

const mapStateToProps = state => {
  const {
    isDataProcessed,
    isClicked,
    collections,
    infrastructures,
    projects
  } = state.main;
  if (isDataProcessed && isClicked.infra) {
    const selectedInfrastructure =
      collections.find(c => c.name === isClicked.infra) ||
      infrastructures.find(i => i.name === isClicked.infra);
    return {
      infraData: selectedInfrastructure,
      connectedProjects: filterProjectsByInfra(selectedInfrastructure, projects)
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
