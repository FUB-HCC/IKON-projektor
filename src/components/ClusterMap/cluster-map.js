import { connect } from "react-redux";
import ClusterMapView from "./cluster-map-view";
import concave from "concaveman";
import {
  setHighlightState,
  unClicked,
  catClicked,
  infraClicked,
  unHovered,
  catHovered,
  infraHovered
} from "../../store/actions/actions";
import { getFieldColor } from "../../util/utility";

const computeClusters = (clusterData, filteredProjects, categories) => {
  if (!clusterData || categories.length === 0) return [];
  const { cluster_data, project_data, transformedPoints } = clusterData;
  const clusterWords = cluster_data.cluster_words;
  const clusterIds = [...new Set(project_data.map(p => p.cluster))];
  return clusterIds.map(id => ({
    id: id,
    words: clusterWords[id],
    projects: transformedPoints
      .filter(p => p.cluster === id)
      .map(p => ({
        ...p,
        color: filteredProjects.find(project => project.id === p.id)
          ? getFieldColor(p.project.forschungsbereich)
          : "none"
      })),
    concaveHull: concave(
      transformedPoints.filter(p => p.cluster === id).map(p => p.location),
      1
    )
  }));
};

const computeInfrastructureSorted = (
  collections,
  clusterData,
  infrastructures,
  filters
) => {
  if (!clusterData) return [];
  return collections
    .concat(infrastructures)
    .sort((a, b) => (a.type < b.type ? 1 : -1))
    .filter(inf => !inf.name.includes("Kein"));
};

const extractHiglightedFromState = state => {
  let highlighted = {
    projects: [],
    cats: [],
    infras: []
  };
  highlighted = addExtractedHighlighted(state.isHovered, highlighted, state);
  highlighted = addExtractedHighlighted(state.isClicked, highlighted, state);
  return highlighted;
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
  const infra = getInfraByName(InfraId, state);
  return {
    ...highlighted,
    projects: highlighted.projects.concat(infra.connections.map(con => con.id)),
    infras: highlighted.infras.concat([infra.name])
  };
};

const addExtractedHighlightedFromCat = (catId, highlighted, state) => {
  const cat = getCatById(catId, state);
  return {
    ...highlighted,
    projects: highlighted.projects.concat(cat.connections.map(con => con.id)),
    cats: highlighted.cats.concat([cat.id])
  };
};

const getProjectById = (id, state) =>
  state.projects.find(project => project.id === id);

const getInfraByName = (name, state) =>
  state.infrastructures
    .concat(state.collections)
    .find(inf => inf.name === name);

const getCatById = (id, state) => state.categories.find(cat => cat.id === id);

const mapStateToProps = state => {
  const {
    clusterData,
    filteredCategories,
    categories,
    filteredProjects,
    filteredCollections,
    filteredInfrastructures,
    filters,
    isDataProcessed,
    highlightedGroup,
    isClicked
  } = state.main;

  let clusterDataForView = [];
  let categoriesForView = [];
  let topography = [];
  let InfrastrukturSorted = [];
  let highlightedProjects = [];
  let highlightedCats = [];
  let highlightedInfra = [];
  if (isDataProcessed) {
    clusterDataForView = computeClusters(
      clusterData,
      filteredProjects,
      categories
    );
    categoriesForView = filteredCategories.filter(
      c => c.count > 0 && filters.targetgroups.value.includes(c.title)
    );
    topography = clusterData.cluster_topography;
    InfrastrukturSorted = computeInfrastructureSorted(
      filteredCollections,
      clusterData,
      filteredInfrastructures,
      filters
    );
    const highlighted = extractHiglightedFromState(state.main);
    highlightedProjects = highlighted.projects;
    highlightedInfra = highlighted.infras;
    highlightedCats = highlighted.cats;
  }

  return {
    clusterData: clusterDataForView,
    categories: categoriesForView,
    topography: topography,
    InfrastrukturSorted: InfrastrukturSorted,

    isAnyClicked: !Object.values(isClicked).every(clickState => !clickState),
    highlightedProjects: highlightedProjects,
    highlightedCats: highlightedCats,
    highlightedInfra: highlightedInfra,
    highlightedGroup: highlightedGroup
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
    },
    setHighlightState: value => dispatch(setHighlightState(value))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ClusterMapView);
