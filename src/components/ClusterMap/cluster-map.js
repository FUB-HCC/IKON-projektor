import { connect } from "react-redux";
import ClusterMapView from "./cluster-map-view";
import {
  unClicked,
  catClicked,
  infraClicked,
  unHovered,
  catHovered,
  infraHovered
} from "../../store/actions/actions";
import { getFieldColor, isTouchMode, applyFilters } from "../../util/utility";

/* project list is divided into clusters */
const computeClusters = (clusterData, projects, categories) => {
  if (
    !clusterData ||
    !projects ||
    projects.length === 0 ||
    !categories ||
    categories.length === 0
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
    cats: [],
    infras: []
  };
  highlighted = addExtractedHighlighted(state.isHovered, highlighted, state);
  highlighted = addExtractedHighlighted(state.isClicked, highlighted, state);
  highlighted = addHighlightedFromLegend(highlighted, state);
  return highlighted;
};

const addHighlightedFromLegend = (highlighted, state) => {
  switch (state.legendHovered) {
    case "ktas":
      return {
        ...highlighted,
        cats: highlighted.cats
          .concat(state.targetgroups.map(cat => cat.id))
          .concat(state.formats.map(cat => cat.id))
      };
    case "collections":
      return {
        ...highlighted,
        infras: highlighted.infras.concat(state.collections.map(col => col.id))
      };
    case "infrastructures":
      return {
        ...highlighted,
        infras: highlighted.infras.concat(
          state.infrastructures.map(inf => inf.id)
        )
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
  if (selectedState.infra) {
    highlighted = addExtractedHighlightedFromInfra(
      selectedState.infra,
      highlighted,
      state
    );
  }
  if (selectedState.cat) {
    highlighted = addExtractedHighlightedFromCat(
      selectedState.cat,
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
    infras: highlighted.infras
      .concat(project.Sammlungsbezug.map(col => col.id))
      .concat(project.Forschungsinfrastruktur.map(inf => inf.id)),
    cats: highlighted.cats.concat(project.targetgroups).concat(project.formats),
    projects: highlighted.projects.concat([project.id])
  };
};

const addExtractedHighlightedFromInfra = (InfraId, highlighted, state) => {
  const infra = getInfraById(InfraId, state);
  return {
    ...highlighted,
    projects: highlighted.projects.concat(infra.projects.map(p => p.id)),
    infras: highlighted.infras.concat([infra.id])
  };
};

const addExtractedHighlightedFromCat = (catId, highlighted, state) => {
  const cat = getCatById(catId, state);
  return {
    ...highlighted,
    projects: highlighted.projects.concat(cat.projects.map(con => con.id)),
    cats: highlighted.cats.concat([cat.id])
  };
};

const getProjectById = (id, state) =>
  state.projects.find(project => project.id === id);

const getInfraById = (id, state) =>
  state.infrastructures.concat(state.collections).find(inf => inf.id === id);

const getCatById = (id, state) =>
  state.targetgroups.find(cat => cat.id === id)
    ? state.targetgroups.find(cat => cat.id === id)
    : state.formats.find(cat => cat.id === id);

const mapStateToProps = state => {
  const {
    clusterData,
    targetgroups,
    formats,
    projects,
    collections,
    infrastructures,
    filters,
    isDataProcessed,
    highlightedGroup,
    isClicked,
    isHovered,
    projectsMaxSizing
  } = state.main;

  let clusterDataForView = [];
  let labels = [];
  let topography = [];
  let highlightedProjects = [];
  let highlightedCats = [];
  let highlightedInfra = [];
  let projectsForView = [];
  let filteredLabels = [];
  if (isDataProcessed) {
    // filters are applied to all lists and data is prepared for the vis
    projectsForView = applyFilters(projects, filters).map(p => p.id);
    clusterDataForView = computeClusters(clusterData, projects, targetgroups);
    filteredLabels = filters.highlevelFilter.value.includes(6)
      ? filters.targetgroups.value
          .concat(filters.collections.value)
          .concat(filters.infrastructures.value)
      : filters.formats.value
          .concat(filters.collections.value)
          .concat(filters.infrastructures.value);
    labels = filters.highlevelFilter.value.includes(6)
      ? targetgroups.concat(collections).concat(infrastructures)
      : formats.concat(collections).concat(infrastructures);
    topography = clusterData;
    const highlighted = extractHighlightedFromState(state.main);
    highlightedProjects = highlighted.projects;
    highlightedInfra = highlighted.infras;
    highlightedCats = highlighted.cats;
  }

  return {
    clusterData: clusterDataForView,
    topography: topography,
    labels: labels,
    filteredLabels: filteredLabels,
    isAnyClicked: !Object.values(isClicked).every(clickState => !clickState),
    highlightedProjects: highlightedProjects,
    highlightedCats: highlightedCats,
    highlightedInfra: highlightedInfra,
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
    onCatClicked: cat => {
      dispatch(catClicked(cat));
    },
    onInfraClicked: infra => {
      dispatch(infraClicked(infra));
    },
    onUnHovered: () => {
      dispatch(unHovered());
    },
    onCatHovered: cat => {
      dispatch(catHovered(cat));
    },
    onInfraHovered: infra => {
      dispatch(infraHovered(infra));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClusterMapView);
