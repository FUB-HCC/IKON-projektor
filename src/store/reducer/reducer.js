import * as actionTypes from "../actions/actionTypes";
import React from "react";
import { topicToField, continents } from "../../util/utility";
import {
  processProjectsData,
  processLabels,
  processInstitutions,
  linkLabelsToProjectsData
} from "./data-transforms";
import FilterPanel from "../../components/FilterPanel/filter-panel";
import ProjectDetailsPanel from "../../components/ProjectDetailsPanel/project-details-panel";
import YearDetailsPanel from "../../components/YearDetailsPanel/year-details-panel";
import LabelDetailsPanel from "../../components/LabelDetailsPanel/label-details-panel";
import InstDetailsPanel from "../../components/InstDetailsPanel/inst-details-panel";

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
    labels: {
      name: "labels",
      filterKey: "labels",
      type: "array",
      uniqueVals: [],
      value: null
    },
    labelToggle: {
      name: "labelToggle",
      filterKey: "labelToggle",
      type: "array",
      uniqueVals: [6],
      value: [6]
    }
  },
  graph: "0",
  projects: [],
  institutions: [],
  continents: [],
  formats: [],
  isHovered: {
    project: null,
    label: null,
    year: null
  },
  isClicked: {
    project: null,
    label: null,
    year: null,
    inst: null
  },
  projectsMaxSizing: [0, 0],
  legendHovered: "none",
  uncertaintyOn: false,
  uncertaintyHighlighted: false,
  clusterData: undefined,
  isDataLoaded: false,
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

    case actionTypes.PROCESS_DATA_IF_READY:
      return processDataWhenReady(state);

    case actionTypes.PROJECT_HOVERED:
      return projectHovered(state, action);

    case actionTypes.LABEL_HOVERED:
      return labelHovered(state, action);

    case actionTypes.YEAR_HOVERED:
      return yearHovered(state, action);

    case actionTypes.UNHOVERED:
      return unHovered(state);

    case actionTypes.PROJECT_CLICKED:
      return projectClicked(state, action);

    case actionTypes.LABEL_CLICKED:
      return labelClicked(state, action);

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
  } else if (action.id === "labelToggle") {
    newFilter.labels.value = newFilter.labelToggle.value.includes(6)
      ? []
      : state.labels.map(l => l.id);
    newFilter.labelToggle.value = newFilter.labelToggle.value.includes(6)
      ? []
      : [6];
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

const compare = (a, b) => {
  if (topicToField(a) < topicToField(b)) return -1;
  else return 1;
};

const updateData = (state, action) => ({
  ...state,
  projects: action.value.projects,
  labels: action.value.targetgroups,
  institutions: action.value.institutions,
  continents: continents,
  clusterData: action.value.cluster_topography,
  isDataLoaded: true
});

const processDataWhenReady = state =>
  state.isDataLoaded ? processAllData(state) : state;

/* The received data is transformed in the beginning (e.g. sorted, some attributes slightly changed), the filters get their initial filling too */
const processAllData = state => {
  const processedProjects = processProjectsData(state);
  const processedLabels = processLabels(processedProjects, state);
  const processedInstState = processInstitutions(state);

  var unflattened = [];
  while (state.clusterData.length > 0)
    unflattened.push(state.clusterData.splice(0, 200));
  const processedClusterData = unflattened.reverse().flat();

  const newState = {
    projects: linkLabelsToProjectsData(processedProjects, processedLabels),
    labels: processedLabels,
    clusterData: processedClusterData,
    institutions: processedInstState.institutions,
    continents: processedInstState.continents,
    projectsMaxSizing: [
      Math.max(...processedProjects.map(p => p.mappoint[0])),
      Math.max(...processedProjects.map(p => p.mappoint[1]))
    ]
  };
  const uniqueFields = [];
  const uniqueTopics = [];
  const uniqueLabels = newState.labels.map(t => t.id);
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
    labels: {
      ...state.filters.labels,
      uniqueVals: uniqueLabels,
      value: state.filters.labels.value
        ? state.filters.labels.value
        : uniqueLabels
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
    label: null,
    kta: null,
    year: null
  }
});

const labelHovered = (state, action) => ({
  ...state,
  isHovered: {
    project: null,
    infra: null,
    label: action.value,
    kta: null,
    year: null
  }
});

const yearHovered = (state, action) => ({
  ...state,
  isHovered: {
    project: null,
    infra: null,
    label: null,
    kta: null,
    year: action.value
  }
});

const unHovered = state => ({
  ...state,
  isHovered: {
    project: null,
    infra: null,
    label: null,
    kta: null,
    year: null
  }
});

const projectClicked = (state, action) => ({
  ...state,
  isClicked: {
    project: action.value,
    infra: null,
    label: null,
    kta: null,
    year: null,
    inst: null,
    samples: null
  },
  sideBarComponent: <ProjectDetailsPanel />
});

const labelClicked = (state, action) => ({
  ...state,
  isClicked: {
    project: null,
    infra: null,
    label: action.value,
    kta: null,
    year: null,
    inst: null,
    samples: null
  },
  sideBarComponent: <LabelDetailsPanel />
});

const yearClicked = (state, action) => ({
  ...state,
  isClicked: {
    project: null,
    infra: null,
    label: null,
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
    label: null,
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
    label: null,
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

export default reducer;
