import * as actionTypes from "../actions/actionTypes";
import React from "react";
import { topicToField, continents } from "../../util/utility";
import {
  processProjectsData,
  processTargetgroups,
  processFormats,
  processCollections,
  processInfrastructures,
  processKtas,
  processMissingProjects,
  processInstitutions,
  linkCatsToProjectsData
} from "./data-transforms";
import FilterPanel from "../../components/FilterPanel/filter-panel";
import ProjectDetailsPanel from "../../components/ProjectDetailsPanel/project-details-panel";
import YearDetailsPanel from "../../components/YearDetailsPanel/year-details-panel";
import KtaDetailsPanel from "../../components/KtaDetailsPanel/kta-details-panel";
import CatDetailsPanel from "../../components/CatDetailsPanel/cat-details-panel";
import InfraDetailsPanel from "../../components/InfraDetailsPanel/infra-details-panel";
import InstDetailsPanel from "../../components/InstDetailsPanel/inst-details-panel";
import SampleStatesList from "../../components/SampleStatesList/sample-states-list";

export const initialState = {
  filters: {
    forschungsgebiet: {
      name: "Forschungsgebiet",
      filterKey: "forschungsbereich",
      type: "string",
      uniqueVals: [],
      value: null
    },
    hauptthema: {
      name: "Hauptthema",
      filterKey: "hauptthema",
      type: "string",
      uniqueVals: [],
      value: null
    },
    time: {
      name: "Zeitraum",
      filterKey: "timeframe",
      type: "timeframe",
      uniqueVals: [],
      value: null
    },
    collections: {
      name: "Sammlungen",
      filterKey: "collections",
      type: "array",
      uniqueVals: [],
      value: null
    },
    infrastructures: {
      name: "Laborgeräte",
      filterKey: "infrastructure",
      type: "array",
      uniqueVals: [],
      value: null
    },
    targetgroups: {
      name: "Zielgruppen",
      filterKey: "targetgroups",
      type: "array",
      uniqueVals: [],
      value: null
    },
    formats: {
      name: "Formate",
      filterKey: "formats",
      type: "array",
      uniqueVals: [],
      value: null
    },
    highlevelFilter: {
      name: "highlevelFilter",
      filterKey: "highlevelFilter",
      type: "array",
      uniqueVals: [6, 7, 8, 9],
      value: [6, 8, 9]
    }
  },
  graph: "0",
  projects: [],
  institutions: [],
  continents: [],
  ktas: [],
  targetgroups: [],
  infrastructures: [],
  collections: [],
  missingprojects: [],
  formats: [],
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
    year: null,
    inst: null,
    samples: null
  },
  projectsMaxSizing: [0, 0],
  legendHovered: "none",
  uncertaintyOn: false,
  uncertaintyHighlighted: false,
  clusterData: undefined,
  isDataLoaded: { data: false, samples: false },
  isDataProcessed: false,
  sideBarComponent: <FilterPanel />
};

// Keep the reducer switch lean by outsourcing the actual code below
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_GRAPH:
      return {
        ...state,
        graph: action.value
      };

    case actionTypes.CHECKBOX_FILTER_CHANGE:
      return changeCheckboxFilter(state, action);

    case actionTypes.TIMERANGE_FILTER_CHANGE:
      return changeTimeRangeFilter(state, action);

    case actionTypes.UPDATE_DATA:
      return updateData(state, action);

    case actionTypes.UPDATE_SAMPLE_LIST:
      return updateSampleList(state, action);

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

    case actionTypes.INST_CLICKED:
      return instClicked(state, action);

    case actionTypes.UNCLICKED:
      return unClicked(state);

    case actionTypes.SHOW_UNCERTAINTY:
      return showUncertainty(state, action);

    case actionTypes.HIGHLIGHT_UNCERTAINTY:
      return highlightUncertainty(state, action);

    case actionTypes.LEGEND_HOVERED:
      return legendHovered(state, action);

    case actionTypes.PAGE_RESET:
      return resetPage(state);

    case actionTypes.SHOW_VIA_WIKI_REQUESTED:
      return showViaWikiRequested(state, action);

    case actionTypes.SHOW_SAMPLE_LIST:
      return showSampleList(state);

    case actionTypes.SAMPLE_CLICKED:
      return sampleClicked(state, action);

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
    if (action.value === 6) {
      newFilter.targetgroups.value = toggleAllOfSubset(
        newFilter.targetgroups,
        newFilter.highlevelFilter,
        action.value
      );
    } else if (action.value === 7) {
      newFilter.formats.value = toggleAllOfSubset(
        newFilter.formats,
        newFilter.highlevelFilter,
        action.value
      );
    } else if (action.value === 8) {
      newFilter.collections.value = toggleAllOfSubset(
        newFilter.collections,
        newFilter.highlevelFilter,
        action.value
      );
    } else if (action.value === 9) {
      newFilter.infrastructures.value = toggleAllOfSubset(
        newFilter.infrastructures,
        newFilter.highlevelFilter,
        action.value
      );
    }
  }
  return {
    ...state,
    filters: newFilter
  };
};

const changeTimeRangeFilter = (state, action) => {
  return {
    ...state,
    filters: {
      ...state.filters,
      time: {
        ...state.filters.time,
        value: action.value
      }
    }
  };
};

const toggleAllFiltersOfField = (filters, fieldValue) => {
  const subjectsOfField = filters.hauptthema.uniqueVals.filter(
    val => topicToField(val) === fieldValue
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

const compare = (a, b) => {
  if (topicToField(a) < topicToField(b)) return -1;
  else return 1;
};

const updateData = (state, action) => ({
  ...state,
  projects: action.value.projects,
  ktas: action.value.ktas,
  infrastructures: action.value.infrastructure,
  collections: action.value.collections,
  targetgroups: action.value.targetgroups,
  institutions: action.value.institutions,
  continents: continents,
  missingprojects: action.value.missingprojects,
  formats: action.value.formats.filter(format => format.ktas.length > 1),
  clusterData: action.value.cluster_topography,
  isDataLoaded: { ...state.isDataLoaded, data: true }
});

const updateSampleList = (state, action) => ({
  ...state,
  sampleList: action.value,
  isDataLoaded: { ...state.isDataLoaded, samples: true }
});

export const isAllDataLoaded = state =>
  Object.values(state.isDataLoaded).every(loaded => loaded);

const processDataWhenReady = state =>
  isAllDataLoaded(state) ? processAllData(state) : state;

/* The received data is transformed in the beginning (e.g. sorted, some attributes slightly changed), the filters get their initial filling too */
const processAllData = state => {
  const processedProjects = processProjectsData(state);
  const processedKtas = processKtas(state.ktas);
  const processedTargetgroups = processTargetgroups(processedProjects, state);
  const processedFormats = processFormats(processedProjects, state);
  const processedInfrastructures = processInfrastructures(
    processedProjects,
    state
  );
  const processedCollections = processCollections(processedProjects, state);
  const processedMissingProjects = processMissingProjects(state);
  const processedInstState = processInstitutions(state);
  const newState = {
    projects: linkCatsToProjectsData(
      processedProjects,
      processedTargetgroups,
      processedFormats
    ),
    ktas: processedKtas,
    targetgroups: processedTargetgroups,
    infrastructures: processedInfrastructures,
    collections: processedCollections,
    clusterData: state.clusterData,
    missingprojects: processedMissingProjects,
    institutions: processedInstState.institutions,
    continents: processedInstState.continents,
    projectsMaxSizing: [
      Math.max(...processedProjects.map(p => p.mappoint[0])),
      Math.max(...processedProjects.map(p => p.mappoint[1]))
    ],
    formats: processedFormats
  };
  const uniqueFields = [];
  const uniqueTopics = [];
  const uniqueInfrastructures = newState.infrastructures.map(inf => inf.id);
  const uniqueCollections = newState.collections.map(col => col.id);
  const uniqueTargetgroups = newState.targetgroups
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(t => t.id);
  const uniqueFormats = newState.formats
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(format => format.id);
  const maxDateRange = [5000, 0];

  Object.values(newState.projects).forEach(project => {
    Object.keys(project).forEach(property => {
      const value = project[property];
      if (property === "forschungsbereich") {
        if (!uniqueFields.some(e => e === value)) uniqueFields.push(value);
      } else if (property === "hauptthema") {
        if (!uniqueTopics.some(e => e === value)) uniqueTopics.push(value);
      } else if (property === "timeframe") {
        maxDateRange[0] =
          maxDateRange[0] < value[0] ? maxDateRange[0] : value[0];
        maxDateRange[1] =
          maxDateRange[1] > value[1] ? maxDateRange[1] : value[1];
      }
    });
  });

  const newFilters = {
    ...state.filters,
    forschungsgebiet: {
      ...state.filters.forschungsgebiet,
      uniqueVals: uniqueFields,
      value: state.filters.forschungsgebiet.value
        ? state.filters.forschungsgebiet.value
        : uniqueFields
    },
    hauptthema: {
      ...state.filters.hauptthema,
      uniqueVals: uniqueTopics.sort(compare),
      value: state.filters.hauptthema.value
        ? state.filters.hauptthema.value
        : uniqueTopics
    },
    time: {
      ...state.filters.time,
      uniqueVals: maxDateRange,
      value: state.filters.time.value ? state.filters.time.value : maxDateRange
    },
    collections: {
      ...state.filters.collections,
      uniqueVals: uniqueCollections,
      value: state.filters.collections.value
        ? state.filters.collections.value
        : uniqueCollections
    },
    infrastructures: {
      ...state.filters.infrastructures,
      uniqueVals: uniqueInfrastructures,
      value: state.filters.infrastructures.value
        ? state.filters.infrastructures.value
        : uniqueInfrastructures
    },
    formats: {
      ...state.filters.formats,
      uniqueVals: uniqueFormats,
      value: state.filters.formats.value ? state.filters.formats.value : []
    },
    targetgroups: {
      ...state.filters.targetgroups,
      uniqueVals: uniqueTargetgroups,
      value: state.filters.targetgroups.value
        ? state.filters.targetgroups.value
        : uniqueTargetgroups
    }
  };

  return {
    ...state,
    ...newState,
    filters: newFilters,
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
    year: null,
    inst: null,
    samples: null
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
    year: null,
    inst: null,
    samples: null
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
    year: null,
    inst: null,
    samples: null
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
    year: null,
    inst: null,
    samples: null
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
    year: action.value,
    inst: null,
    samples: null
  },
  sideBarComponent: <YearDetailsPanel />
});

const instClicked = (state, action) => ({
  ...state,
  isClicked: {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: null,
    inst: action.value,
    samples: null
  },
  sideBarComponent: <InstDetailsPanel />
});

const unClicked = state => ({
  ...state,
  isClicked: {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: null,
    samples: null
  },
  sideBarComponent: <FilterPanel />
});

const legendHovered = (state, action) => ({
  ...state,
  legendHovered: action.value
});

const showUncertainty = (state, action) => ({
  ...state,
  uncertaintyOn: action.value
});

const highlightUncertainty = (state, action) => ({
  ...state,
  uncertaintyHighlighted: action.value
});

const resetPage = state => {
  if (state.user) {
    window.open(window.location.pathname + "?uid=" + state.user, "_self");
  } else {
    window.open(window.location.pathname, "_self");
  }
};

const showViaWikiRequested = (state, action) => {
  window.open(action.value, "_blank");
  return state;
};

const sampleClicked = (state, action) => {
  if (state.user) {
    window.open("?uid=" + state.user + "&" + action.value, "_self");
  } else {
    window.open(action.value, "_self");
  }
};

const showSampleList = state => ({
  ...state,
  isClicked: {
    project: null,
    infra: null,
    cat: null,
    kta: null,
    year: null,
    samples: 1
  },
  sideBarComponent: <SampleStatesList />
});

export default reducer;
