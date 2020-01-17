import * as actionTypes from "../actions/actionTypes";
import React from "react";
import {
  createNewStateFromUrlData,
  fieldsStringToInt,
  topicToField,
  fieldsIntToString
} from "../../util/utility";
import { parse as queryStringParse } from "query-string";
import FilterPanel from "../../components/FilterPanel/filter-panel";

const initialState = {
  filters: {
    forschungsgebiet: {
      name: "Forschungsgebiet",
      filterKey: "forschungsbereichstr",
      type: "string",
      uniqueVals: ["1", "2", "3", "4"],
      value: ["1", "2", "3", "4"]
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
      filterKey: "infrastructures",
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
  clusterData: undefined,
  selectedProject: undefined,
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

    case actionTypes.DEACTIVATE_POPOVER:
      return deactivatePopover(state);

    case actionTypes.GET_FILTERS_FROM_URL:
      return urlUpdatesFilters(state);

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

    case actionTypes.SET_SIDE_BAR_COMPONENT:
      return setSideBarComponent(state, action);

    case actionTypes.SET_SELECTED_PROJECT:
      return setSelectedProject(state, action);

    case actionTypes.RESET_SELECTED_PROJECT:
      return resetSelectedProject(state);

    case actionTypes.SET_SELECTED_CAT:
      return setSelectedCat(state, action);

    case actionTypes.SET_SELECTED_INFRA:
      return setSelectedInfra(state, action);

    case actionTypes.SET_SELECTED_KTA:
      return setSelectedKta(state, action);

    case actionTypes.SET_SELECTED_YEAR:
      return setSelectedYear(state, action);

    case actionTypes.DESELECT_ITEMS:
      return deselectItems(state);

    case actionTypes.UPDATE_OLD_PROJECT_DATA:
      return updateOldProjectsData(state, action);

    default:
      return state;
  }
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
        if (
          !filteredData[d][f.filterKey] ||
          filteredData[d][f.filterKey].length === 0
        ) {
          newFilteredData[d] = filteredData[d];
        } else {
          for (const entry of filteredData[d][f.filterKey]) {
            if (f.value.some(value => value === entry))
              newFilteredData[d] = filteredData[d];
          }
        }
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
  let newCategories = categories;
  return newCategories.filter(cat =>
    filter.targetgroups.value.includes(cat.title)
  );
};

const applyInfraFilters = (infras, filter) => {
  let newInfras = infras;
  return newInfras.filter(infra => filter.value.includes(infra.name));
};

const compare = (a, b) => {
  if (topicToField(a) < topicToField(b)) return -1;
  else return 1;
};

const updateClusterData = (state, action) =>
  Object.assign({}, state, {
    clusterData: action.value
  });

const updateInstitutionsData = (state, action) =>
  Object.assign({}, state, {
    institutions: action.value
  });

const updateKtaData = (state, action) => ({
  ...state,
  ktas: action.value.map(kta => ({
    ...kta,
    timeframe: [new Date(kta.start_date), new Date(kta.end_date)]
  })),
  filters: {
    ...state.filters,
    formats: {
      name: "Formate",
      filterKey: "formats",
      type: "array",
      uniqueVals: [
        ...new Set(action.value.map(kta => kta.format).filter(f => f != null))
      ],
      value: [
        ...new Set(action.value.map(kta => kta.format).filter(f => f != null))
      ]
    }
  }
  //
});

const updateTargetGroupsData = (state, action) => ({
  ...state,
  filters: {
    ...state.filters,
    targetgroups: {
      name: "Zielgruppen",
      filterKey: "targetgroups",
      type: "array",
      uniqueVals: action.value.map(t => t.title),
      value: action.value.map(t => t.title)
    }
  },
  categories: action.value.map(category => ({
    ...category,
    connections: [],
    count: 1,
    project_ids: []
  })),
  filteredCategories: action.value.map(category => ({
    ...category,
    connections: [],
    count: 1,
    project_ids: []
  }))
});

const updateCollectionsData = (state, action) => ({
  ...state,
  collections: action.value.map(collection => ({
    ...collection,
    connections: [],
    type: "collection"
  })),
  filteredCollections: action.value.map(collection => ({
    ...collection,
    connections: [],
    type: "collection"
  }))
});

const updateInfrastructureData = (state, action) => ({
  ...state,
  infrastructures: action.value.map(infrastructure => ({
    ...infrastructure,
    connections: [],
    type: "infrastructure"
  })),
  filteredInfrastructures: action.value.map(infrastructure => ({
    ...infrastructure,
    connections: [],
    type: "infrastructure"
  }))
});

const updateKtaMappingData = (state, action) => ({
  ...state,
  ktaMapping: action.value
});

const updateOldProjectsData = (state, action) => {
  const projectData = action.value;

  return { ...state, oldProjects: projectData };
};

const updateProjectsData = (state, action) => {
  const projectData = action.value;
  const projects = Object.values(projectData).map(project => {
    project.hauptthema =
      project.participating_subject_areas &&
      project.participating_subject_areas.split("/")[1]
        ? project.participating_subject_areas.split("/")[1]
        : "Sonstige";
    project.geldgeber = project.sponsor;
    project.timeframe = [
      new Date(project.funding_start_year).getFullYear(),
      new Date(project.funding_end_year).getFullYear()
    ];
    project.collections =
      project.sammlungen && project.sammlungen[0] ? project.sammlungen : [];
    project.infrastructures =
      project.infrastruktur && project.infrastruktur[0]
        ? project.infrastruktur
        : [];
    if (
      project.participating_subject_areas &&
      project.participating_subject_areas.split("/")[0]
    ) {
      return {
        ...project,
        forschungsbereich: project.participating_subject_areas.split("/")[0],
        forschungsbereichstr: project.participating_subject_areas.split("/")[0], // TODO please change API so it does not contain "(# Mitglieder)"
        forschungsbereichNumber: fieldsStringToInt(
          project.participating_subject_areas.split("/")[0]
        )
      };
    } else {
      return {
        ...project,
        forschungsbereich: "Sonstige",
        forschungsbereichstr: "Sonstige", // TODO please change API so it does not contain "(# Mitglieder)"
        forschungsbereichNumber: fieldsStringToInt("Sonstige")
      };
    }
  });

  const uniqueFields = [];
  const uniqueTopics = [];
  const uniqueSponsors = [];
  const uniqueInfrastructures = [];
  const uniqueCollections = [];
  const maxDateRange = [5000, 0];

  Object.values(projects).forEach(project => {
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
    ...state.filters,
    forschungsgebiet: {
      ...state.filters.forschungsgebiet,
      uniqueVals: uniqueFields.sort(compare),
      value: uniqueFields
    },
    hauptthema: {
      ...state.filters.hauptthema,
      uniqueVals: uniqueTopics.sort(compare),
      value: uniqueTopics
    },
    geldgeber: {
      ...state.filters.geldgeber,
      uniqueVals: uniqueSponsors.sort(compare),
      value: uniqueSponsors
    },
    time: {
      ...state.filters.time,
      uniqueVals: maxDateRange,
      value: maxDateRange
    },
    collections: {
      ...state.filters.collections,
      uniqueVals: uniqueCollections.sort((a, b) => a.localeCompare(b)),
      value: uniqueCollections
    },
    infrastructures: {
      ...state.filters.infrastructures,
      uniqueVals: uniqueInfrastructures.sort((a, b) => a.localeCompare(b)),
      value: uniqueInfrastructures
    }
  };

  return Object.assign({}, state, {
    projects: projects,
    filters: newFilters,
    filteredProjects: applyFilters(projects, newFilters)
  });
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
  }
  return {
    ...state,
    filteredCategories: applyCategoryFilters(state.categories, newFilter),
    filteredCollections: applyInfraFilters(
      state.collections,
      newFilter.collections
    ),
    filteredInfrastructures: applyInfraFilters(
      state.infrastructures,
      newFilter.infrastructures
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

const setSelectedProject = (state, action) => ({
  ...state,
  selectedProject: action.value
});

const setSelectedCat = (state, action) => ({
  ...state,
  selectedCat: action.value
});

const setSelectedKta = (state, action) => ({
  ...state,
  selectedKta: action.value
});

const setSelectedYear = (state, action) => ({
  ...state,
  selectedYear: action.value
});

const setSelectedInfra = (state, action) => ({
  ...state,
  selectedInfra: action.value
});
const deselectItems = state => ({
  ...state,
  selectedProject: null,
  selectedInfra: null,
  selectedCat: null,
  selectedKta: null
});
const resetSelectedProject = state => ({ ...state, setSelectedProject: null });

const deactivatePopover = state => {
  const newState = {
    ...state,
    selectedProject: undefined
  };
  return newState;
};

const setSideBarComponent = (state, action) => ({
  ...state,
  sideBarComponent: action.value
});

// urlUpdatesState: Don't call this function. Only used upon initial loading
const urlUpdatesFilters = state => {
  const urlData = queryStringParse(window.location.search);
  const dataFromUrl = createNewStateFromUrlData(state, urlData);
  return {
    ...state,
    filter: dataFromUrl.filter,
    graph: dataFromUrl.graph,
    filteredProjects: applyFilters(state.projects, dataFromUrl.filter),
    selectedProject: dataFromUrl.selectedProject
  };
};

export default reducer;
