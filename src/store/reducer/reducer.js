import * as actionTypes from "../actions/actionTypes";
import React from "react";
import { topicToField, fieldsIntToString } from "../../util/utility";
import {
  processProjectsData,
  processClusterData,
  processCategories,
  processCollections,
  processInfrastructures,
  processFormats,
  linkCatsToProjectsData
} from "./data-transforms";
import FilterPanel from "../../components/FilterPanel/filter-panel";
import ProjectDetailsPanel from "../../components/ProjectDetailsPanel/project-details-panel";
import YearDetailsPanel from "../../components/YearDetailsPanel/year-details-panel";
import KtaDetailsPanel from "../../components/KtaDetailsPanel/kta-details-panel";
import CatDetailsPanel from "../../components/CatDetailsPanel/cat-details-panel";
import InfraDetailsPanel from "../../components/InfraDetailsPanel/infra-details-panel";

export const initialState = {
  filters: {
    forschungsgebiet: {
      name: "Forschungsgebiet",
      filterKey: "forschungsbereichstr",
      type: "string",
      uniqueVals: [],
      value: []
    },
    hauptthema: {
      name: "Hauptthema",
      filterKey: "hauptthema",
      type: "string",
      uniqueVals: [],
      value: []
    },
    geldgeber: {
      name: "Geldgeber",
      filterKey: "geldgeber",
      type: "string",
      uniqueVals: [],
      value: []
    },
    time: {
      name: "Zeitraum",
      filterKey: "timeframe",
      type: "timeframe",
      uniqueVals: [],
      value: []
    },
    collections: {
      name: "Sammlungen",
      filterKey: "collections",
      type: "array",
      uniqueVals: [],
      value: []
    },
    infrastructures: {
      name: "Laborgeräte",
      filterKey: "infrastructure",
      type: "array",
      uniqueVals: [],
      value: []
    },
    targetgroups: {
      name: "Zielgruppen",
      filterKey: "targetgroups",
      type: "array",
      uniqueVals: [],
      value: []
    },
    formats: {
      name: "Formate",
      filterKey: "formats",
      type: "array",
      uniqueVals: [],
      value: []
    },
    highlevelFilter: {
      name: "highlevelFilter",
      filterKey: "highlevelFilter",
      type: "array",
      uniqueVals: [],
      value: []
    }
  },
  graph: "0",
  projects: [],
  filteredProjects: [],
  filteredCategories: [],
  filteredCollections: [],
  filteredInfrastructures: [],
  institutions: [],
  ktas: [],
  ktaMapping: [],
  categories: [],
  infrastructures: [],
  collections: [],
  isHovered: {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: null
  },
  isClicked: {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: null
  },
  clusterData: undefined,
  highlightedGroup: null,
  isDataLoaded: {
    projects: false,
    institutions: false,
    cluster: false,
    ktas: false,
    targetgroups: false,
    ktaMapping: false,
    collections: false,
    infrastructures: false
  },
  isDataProcessed: false,
  sideBarComponent: <FilterPanel />
};

// Keep the reducer switch lean by outsourcing the actual code below
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_GRAPH:
      return {
        ...state,
        graph: action.value,
        filteredProjects: applyFilters(state.projects, state.filters)
      };

    case actionTypes.CHECKBOX_FILTER_CHANGE:
      return changeCheckboxFilter(state, action);

    case actionTypes.TIMERANGE_FILTER_CHANGE:
      return changeTimeRangeFilter(state, action);

    case actionTypes.UPDATE_CLUSTER_DATA:
      return updateClusterData(state, action);

    case actionTypes.UPDATE_INSTITUTIONS_DATA:
      return updateInstitutionsData(state, action);

    case actionTypes.UPDATE_PROJECTS_DATA:
      return updateProjectsData(state, action);

    case actionTypes.UPDATE_KTA_DATA:
      return updateKtaData(state, action);

    case actionTypes.UPDATE_TARGETGROUPS_DATA:
      return updateTargetGroupsData(state, action);

    case actionTypes.UPDATE_COLLECTIONS_DATA:
      return updateCollectionsData(state, action);

    case actionTypes.UPDATE_INFRASTRUCTURE_DATA:
      return updateInfrastructureData(state, action);

    case actionTypes.UPDATE_KTA_MAPPING_DATA:
      return updateKtaMappingData(state, action);

    case actionTypes.PROCESS_DATA_IF_READY:
      return processDataWhenReady(state);

    case actionTypes.PROJECT_HOVERED:
      return projectHovered(state, action);

    case actionTypes.CAT_HOVERED:
      return catHovered(state, action);

    case actionTypes.INFRA_HOVERED:
      return infraHovered(state, action);

    case actionTypes.KTA_HOVERED:
      return ktaHovered(state, action);

    case actionTypes.YEAR_HOVERED:
      return yearHovered(state, action);

    case actionTypes.UNHOVERED:
      return unHovered(state);

    case actionTypes.PROJECT_CLICKED:
      return projectClicked(state, action);

    case actionTypes.CAT_CLICKED:
      return catClicked(state, action);

    case actionTypes.INFRA_CLICKED:
      return infraClicked(state, action);

    case actionTypes.KTA_CLICKED:
      return ktaClicked(state, action);

    case actionTypes.YEAR_CLICKED:
      return yearClicked(state, action);

    case actionTypes.UNCLICKED:
      return unClicked(state);

    case actionTypes.SET_HIGHLIGHT_STATE:
      return setHighlightState(state, action);

    default:
      return state;
  }
};

const changeCheckboxFilter = (state, action) => {
  const newFilter = state.filters;
  if (state.filters[action.id].value.some(e => e === action.value)) {
    newFilter[action.id].value = state.filters[action.id].value.filter(
      key => key !== action.value
    );
  } else {
    newFilter[action.id].value.push(action.value);
  }
  if (action.id === "forschungsgebiet") {
    newFilter.hauptthema.value = toggleAllFiltersOfField(
      newFilter,
      action.value
    );
  } else if (action.id === "highlevelFilter") {
    if (action.value === "Zielgruppen") {
      newFilter.targetgroups.value = toggleAllOfSubset(
        newFilter.targetgroups,
        newFilter.highlevelFilter,
        action.value
      );
    } else if (action.value === "Formate") {
      newFilter.formats.value = toggleAllOfSubset(
        newFilter.formats,
        newFilter.highlevelFilter,
        action.value
      );
    } else if (action.value === "Sammlungen") {
      newFilter.collections.value = toggleAllOfSubset(
        newFilter.collections,
        newFilter.highlevelFilter,
        action.value
      );
    } else if (action.value === "Laborgeräte") {
      newFilter.infrastructures.value = toggleAllOfSubset(
        newFilter.infrastructures,
        newFilter.highlevelFilter,
        action.value
      );
    }
  }
  return {
    ...state,
    filteredCategories: applyCategoryFilters(state.categories, newFilter),
    filteredCollections: applyInfraFilters(state.collections, newFilter),
    filteredInfrastructures: applyInfraFilters(
      state.infrastructures,
      newFilter
    ),
    filters: newFilter,
    filteredProjects: applyFilters(state.projects, newFilter)
  };
};

const changeTimeRangeFilter = (state, action) => {
  const newFilter = {
    ...state.filters,
    time: {
      ...state.filters.time,
      value: action.value
    }
  };
  return {
    ...state,
    filters: newFilter,
    filteredProjects: applyFilters(state.projects, newFilter)
  };
};

const toggleAllFiltersOfField = (filters, fieldValue) => {
  const subjectsOfField = filters.hauptthema.uniqueVals.filter(
    val => fieldsIntToString(topicToField(val)) === fieldValue
  );
  let newValue = filters.hauptthema.value.filter(
    val => !subjectsOfField.includes(val)
  );
  if (filters.forschungsgebiet.value.includes(fieldValue)) {
    newValue = newValue.concat(subjectsOfField);
  }
  return newValue;
};

const toggleAllOfSubset = (subsetFilter, highlevelFilter, actionValue) => {
  const toggle = highlevelFilter.value.includes(actionValue);
  let newValue = toggle ? subsetFilter.uniqueVals : [];
  return newValue;
};

const applyFilters = (data, filter) => {
  let filteredData = data;
  Object.values(filter).forEach(f => {
    let newFilteredData = {};
    filteredData = Object.keys(filteredData).forEach(d => {
      if (f.type === "string") {
        if (f.value.some(value => value === filteredData[d][f.filterKey]))
          newFilteredData[d] = filteredData[d];
      } else if (f.type === "timeframe") {
        if (
          f.value[0] <= filteredData[d][f.filterKey][0] &&
          f.value[1] >= filteredData[d][f.filterKey][1]
        ) {
          newFilteredData[d] = filteredData[d];
        }
      } else if (f.type === "array") {
        newFilteredData[d] = filteredData[d];
      } else {
        if (filteredData[d][f.filterKey].includes(f.value))
          newFilteredData[d] = filteredData[d];
      }
    });
    filteredData = newFilteredData;
  });
  return Object.values(filteredData);
};

const applyCategoryFilters = (categories, filter) => {
  let newCategories = categories.map(cat => ({
    ...cat,
    connections: cat.connections.filter(con =>
      filter.hauptthema.value.includes(con.project.hauptthema)
    )
  }));
  return newCategories.filter(cat =>
    filter.targetgroups.value.includes(cat.title)
  );
};

const applyInfraFilters = (infras, filter) => {
  let newInfras = infras.map(inf => ({
    ...inf,
    connections: inf.connections.filter(con =>
      filter.hauptthema.value.includes(con.project.hauptthema)
    )
  }));
  let specialFilter = filter.infrastructures;
  if (infras[0].type === "collection") {
    specialFilter = filter.collections;
  }
  return newInfras.filter(infra => specialFilter.value.includes(infra.name));
};

const compare = (a, b) => {
  if (topicToField(a) < topicToField(b)) return -1;
  else return 1;
};

const updateClusterData = (state, action) => ({
  ...state,
  clusterData: action.value,
  isDataLoaded: {
    ...state.isDataLoaded,
    cluster: true
  }
});

const updateInstitutionsData = (state, action) => ({
  ...state,
  institutions: action.value,
  isDataLoaded: {
    ...state.isDataLoaded,
    institutions: true
  }
});

const updateKtaData = (state, action) => ({
  ...state,
  ktas: action.value,
  isDataLoaded: {
    ...state.isDataLoaded,
    ktas: true
  }
});

const updateTargetGroupsData = (state, action) => ({
  ...state,
  categories: action.value,
  isDataLoaded: {
    ...state.isDataLoaded,
    targetgroups: true
  }
});

const updateCollectionsData = (state, action) => ({
  ...state,
  collections: action.value,
  isDataLoaded: {
    ...state.isDataLoaded,
    collections: true
  }
});

const updateInfrastructureData = (state, action) => ({
  ...state,
  infrastructures: action.value,
  isDataLoaded: {
    ...state.isDataLoaded,
    infrastructures: true
  }
});

const updateKtaMappingData = (state, action) => ({
  ...state,
  ktaMapping: action.value,
  isDataLoaded: {
    ...state.isDataLoaded,
    ktaMapping: true
  }
});

const updateProjectsData = (state, action) => ({
  ...state,
  projects: action.value,
  isDataLoaded: {
    ...state.isDataLoaded,
    projects: true
  }
});

export const isAllDataLoaded = state =>
  Object.values(state.isDataLoaded).every(loaded => loaded);

const processDataWhenReady = state =>
  isAllDataLoaded(state) ? processAllData(state) : state;

const processAllData = state => {
  const preprocessedClusterData = processClusterData(state);
  const processedInfrastructures = processInfrastructures(
    state,
    preprocessedClusterData
  );
  const processedCollections = processCollections(
    state,
    preprocessedClusterData
  );
  const processedCategories = processCategories(state, preprocessedClusterData);
  const processedProjects = processProjectsData(state);
  const newState = {
    projects: linkCatsToProjectsData(processedCategories, processedProjects),
    ktas: processFormats(state),
    categories: processedCategories,
    infrastructures: processedInfrastructures,
    collections: processedCollections,
    clusterData: preprocessedClusterData
  };

  const uniqueFields = [];
  const uniqueTopics = [];
  const uniqueSponsors = [];
  const uniqueInfrastructures = [];
  const uniqueCollections = [];
  const maxDateRange = [5000, 0];

  Object.values(newState.projects).forEach(project => {
    Object.keys(project).forEach(property => {
      const value = project[property];
      if (property === "forschungsbereichstr") {
        if (!uniqueFields.some(e => e === value)) uniqueFields.push(value);
      } else if (property === "hauptthema") {
        if (!uniqueTopics.some(e => e === value)) uniqueTopics.push(value);
      } else if (property === "geldgeber") {
        if (!uniqueSponsors.some(e => e === value)) uniqueSponsors.push(value);
      } else if (property === "timeframe") {
        maxDateRange[0] =
          maxDateRange[0] < value[0] ? maxDateRange[0] : value[0];
        maxDateRange[1] =
          maxDateRange[1] > value[1] ? maxDateRange[1] : value[1];
      } else if (property === "collections") {
        for (const sammlung of Object.values(value))
          if (!uniqueCollections.some(e => e === sammlung))
            uniqueCollections.push(sammlung);
      } else if (property === "infrastructures") {
        for (const infrastruktur of Object.values(value))
          if (!uniqueInfrastructures.some(e => e === infrastruktur))
            uniqueInfrastructures.push(infrastruktur);
      }
    });
  });

  const newFilters = {
    forschungsgebiet: {
      ...state.filters.forschungsgebiet,
      uniqueVals: uniqueFields.sort(compare),
      value:
        state.filters.forschungsgebiet.value.length > 0
          ? state.filters.forschungsgebiet.value
          : uniqueFields
    },
    hauptthema: {
      ...state.filters.hauptthema,
      uniqueVals: uniqueTopics.sort(compare),
      value:
        state.filters.hauptthema.value.length > 0
          ? state.filters.hauptthema.value
          : uniqueTopics
    },
    geldgeber: {
      ...state.filters.geldgeber,
      uniqueVals: uniqueSponsors.sort(compare),
      value:
        state.filters.geldgeber.value.length > 0
          ? state.filters.geldgeber.value
          : uniqueSponsors
    },
    time: {
      ...state.filters.time,
      uniqueVals: maxDateRange,
      value:
        state.filters.time.value.length > 0
          ? state.filters.time.value
          : maxDateRange
    },
    collections: {
      ...state.filters.collections,
      uniqueVals: uniqueCollections.sort((a, b) => a.localeCompare(b)),
      value:
        state.filters.collections.value.length > 0
          ? state.filters.collections.value
          : uniqueCollections
    },
    formats: {
      ...state.filters.formats,
      uniqueVals: [
        ...new Set(newState.ktas.map(kta => kta.format).filter(f => f != null))
      ],
      value:
        state.filters.formats.value.length > 0
          ? state.filters.formats.value
          : [
              ...new Set(
                newState.ktas.map(kta => kta.format).filter(f => f != null)
              )
            ]
    },
    infrastructures: {
      ...state.filters.infrastructures,
      uniqueVals: uniqueInfrastructures.sort((a, b) => a.localeCompare(b)),
      value:
        state.filters.infrastructures.value.length > 0
          ? state.filters.infrastructures.value
          : uniqueInfrastructures
    },
    targetgroups: {
      ...state.filters.targetgroups,
      uniqueVals: newState.categories.map(t => t.title),
      value:
        state.filters.targetgroups.value.length > 0
          ? state.filters.targetgroups.value
          : newState.categories.map(t => t.title)
    },
    highlevelFilter: {
      ...state.filters.highlevelFilter,
      uniqueVals: ["Zielgruppen", "Formate", "Laborgeräte", "Sammlungen"],
      value:
        state.filters.highlevelFilter.value.length > 0
          ? state.filters.highlevelFilter.value
          : ["Zielgruppen", "Formate", "Laborgeräte", "Sammlungen"]
    }
  };

  return {
    ...state,
    ...newState,
    filters: newFilters,
    filteredProjects: applyFilters(newState.projects, newFilters),
    filteredCategories: applyCategoryFilters(newState.categories, newFilters),
    filteredCollections: applyInfraFilters(newState.collections, newFilters),
    filteredInfrastructures: applyInfraFilters(
      newState.infrastructures,
      newFilters
    ),
    isDataProcessed: true
  };
};

const projectHovered = (state, action) => ({
  ...state,
  isHovered: {
    project: action.value,
    infra: null,
    cat: null,
    kta: null,
    year: null
  }
});

const catHovered = (state, action) => ({
  ...state,
  isHovered: {
    project: null,
    infra: null,
    cat: action.value,
    kta: null,
    year: null
  }
});

const infraHovered = (state, action) => ({
  ...state,
  isHovered: {
    project: null,
    infra: action.value,
    cat: null,
    kta: null,
    year: null
  }
});

const ktaHovered = (state, action) => ({
  ...state,
  isHovered: {
    project: null,
    infra: null,
    cat: null,
    kta: action.value,
    year: null
  }
});

const yearHovered = (state, action) => ({
  ...state,
  isHovered: {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: action.value
  }
});

const unHovered = state => ({
  ...state,
  isHovered: {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: null
  }
});

const projectClicked = (state, action) => ({
  ...state,
  isClicked: {
    project: action.value,
    infra: null,
    cat: null,
    kta: null,
    year: null
  },
  sideBarComponent: <ProjectDetailsPanel />
});

const catClicked = (state, action) => ({
  ...state,
  isClicked: {
    project: null,
    infra: null,
    cat: action.value,
    kta: null,
    year: null
  },
  sideBarComponent: <CatDetailsPanel />
});

const infraClicked = (state, action) => ({
  ...state,
  isClicked: {
    project: null,
    infra: action.value,
    cat: null,
    kta: null,
    year: null
  },
  sideBarComponent: <InfraDetailsPanel />
});

const ktaClicked = (state, action) => ({
  ...state,
  isClicked: {
    project: null,
    infra: null,
    cat: null,
    kta: action.value,
    year: null
  },
  sideBarComponent: <KtaDetailsPanel />
});

const yearClicked = (state, action) => ({
  ...state,
  isClicked: {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: action.value
  },
  sideBarComponent: <YearDetailsPanel />
});

const unClicked = state => ({
  ...state,
  isClicked: {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: null
  },
  sideBarComponent: <FilterPanel />
});

const setHighlightState = (state, action) => ({
  ...state,
  highlightedGroup: action.value
});

export default reducer;
