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

const computeClusters = (clusterData, projects, targetgroups) => {
  if (
    !clusterData ||
    !projects ||
    projects.length === 0 ||
    !targetgroups ||
    targetgroups.length === 0
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
        cats: highlighted.cats.concat(state.targetgroups.map(cat => cat.id))
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
      .concat(project.collections)
      .concat(project.infrastructures),
    cats: highlighted.cats.concat(project.cats),
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

const getCatById = (id, state) => state.targetgroups.find(cat => cat.id === id);

const mapStateToProps = state => {
  const {
    clusterData,
    targetgroups,
    projects,
    collections,
    infrastructures,
    filters,
    isDataProcessed,
    highlightedGroup,
    isClicked
  } = state.main;

  let clusterDataForView = [];
  let targetgroupsForView = [];
  let collectionsForView = [];
  let infrastructuresForView = [];
  let topography = [];
  let highlightedProjects = [];
  let highlightedCats = [];
  let highlightedInfra = [];
  if (isDataProcessed) {
    let projectsForView = applyFilters(projects, filters);
    clusterDataForView = computeClusters(
      clusterData,
      projectsForView,
      targetgroups
    );
    targetgroupsForView = targetgroups
      .filter(tg => filters.targetgroups.value.includes(tg.id))
      .sort((a, b) => (a.name < b.name ? 1 : -1));

    collectionsForView = collections.filter(col =>
      filters.collections.value.includes(col.id)
    );
    infrastructuresForView = infrastructures.filter(inf =>
      filters.infrastructures.value.includes(inf.id)
    );
    topography = clusterData;
    const highlighted = extractHighlightedFromState(state.main);
    highlightedProjects = highlighted.projects;
    highlightedInfra = highlighted.infras;
    highlightedCats = highlighted.cats;
  }

  return {
    clusterData: clusterDataForView,
    targetgroups: targetgroupsForView,
    topography: topography,
    collections: collectionsForView,
    infrastructures: infrastructuresForView,
    isAnyClicked: !Object.values(isClicked).every(clickState => !clickState),
    highlightedProjects: highlightedProjects,
    highlightedCats: highlightedCats,
    highlightedInfra: highlightedInfra,
    highlightedGroup: highlightedGroup,
    uncertaintyOn: state.main.uncertaintyOn,
    uncertaintyHighlighted: state.main.uncertaintyHighlighted,
    isTouch: isTouchMode(state)
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
