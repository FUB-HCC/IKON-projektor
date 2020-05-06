import { connect } from "react-redux";
import ClusterMapView from "./cluster-map-view";
import {
  unClicked,
  labelClicked,
  unHovered,
  labelHovered
} from "../../store/actions/actions";
import { getFieldColor, isTouchMode, applyFilters } from "../../util/utility";

/* project list is divided into clusters */
const computeClusters = (clusterData, projects, labels) => {
  if (
    !clusterData ||
    !projects ||
    projects.length === 0 ||
    !labels ||
    labels.length === 0
  )
    return [];

  const clusterIds = [...new Set(projects.map(p => p.cluster))];
  return clusterIds.map(id => ({
    id: id,
    projects: projects
      .filter(p => p.cluster === id)
      .map(p => ({
        ...p,
        color: getFieldColor(p.forschungsbereich)
      }))
  }));
};
/* helper functions to determine whcih elements in the visualization should b highlighted in the MfN green */
const extractHighlightedFromState = state => {
  let highlighted = {
    projects: [],
    labels: []
  };
  highlighted = addExtractedHighlighted(state.isHovered, highlighted, state);
  highlighted = addExtractedHighlighted(state.isClicked, highlighted, state);
  highlighted = addHighlightedFromLegend(highlighted, state);
  return highlighted;
};

const addHighlightedFromLegend = (highlighted, state) => {
  switch (state.legendHovered) {
    case "labels":
      return {
        ...highlighted,
        labels: highlighted.labels.concat(state.labels.map(l => l.id))
      };
    default:
      return highlighted;
  }
};

const addExtractedHighlighted = (selectedState, highlighted, state) => {
  if (selectedState.project) {
    highlighted = addExtractedHighlightedFromProject(
      selectedState.project,
      highlighted,
      state
    );
  }
  if (selectedState.label) {
    highlighted = addExtractedHighlightedFromLabel(
      selectedState.label,
      highlighted,
      state
    );
  }
  return highlighted;
};

const addExtractedHighlightedFromProject = (projectId, highlighted, state) => {
  const project = getProjectById(projectId, state);
  return {
    ...highlighted,
    labels: highlighted.labels.concat(project.labels),
    projects: highlighted.projects.concat([project.id])
  };
};

const addExtractedHighlightedFromLabel = (labelId, highlighted, state) => {
  const label = getLabelById(labelId, state);
  return {
    ...highlighted,
    projects: highlighted.projects.concat(label.projects.map(con => con.id)),
    labels: highlighted.labels.concat([label.id])
  };
};

const getProjectById = (id, state) =>
  state.projects.find(project => project.id === id);

const getLabelById = (id, state) => state.labels.find(l => l.id === id);

const mapStateToProps = state => {
  const {
    clusterData,
    labels,
    projects,
    filters,
    isDataProcessed,
    highlightedGroup,
    isClicked,
    isHovered,
    projectsMaxSizing
  } = state.main;

  let clusterDataForView = [];
  let labelsForView = [];
  let topography = [];
  let highlightedProjects = [];
  let highlightedLabels = [];
  let projectsForView = [];
  let filteredLabels = [];
  if (isDataProcessed) {
    // filters are applied to all lists and data is prepared for the vis
    projectsForView = applyFilters(projects, filters).map(p => p.id);
    clusterDataForView = computeClusters(clusterData, projects, labels);
    filteredLabels = filters.labels.value;
    labelsForView = labels;
    topography = clusterData;
    const highlighted = extractHighlightedFromState(state.main);
    highlightedProjects = highlighted.projects;
    highlightedLabels = highlighted.labels;
  }

  return {
    clusterData: clusterDataForView,
    topography: topography,
    labels: labelsForView,
    filteredLabels: filteredLabels,
    isAnyClicked: !Object.values(isClicked).every(clickState => !clickState),
    highlightedProjects: highlightedProjects,
    highlightedLabels: highlightedLabels,
    highlightedGroup: highlightedGroup,
    uncertaintyOn: state.main.uncertaintyOn,
    uncertaintyHighlighted: state.main.uncertaintyHighlighted,
    isTouch: isTouchMode(state),
    isProjectHovered: isHovered.project,
    projectsMaxSizing: projectsMaxSizing,
    filteredProjects: projectsForView
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onUnClicked: () => {
      dispatch(unClicked());
    },
    onLabelClicked: label => {
      dispatch(labelClicked(label));
    },
    onUnHovered: () => {
      dispatch(unHovered());
    },
    onLabelHovered: label => {
      dispatch(labelHovered(label));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClusterMapView);
