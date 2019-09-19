import * as actionTypes from "../actions/actionTypes";
import {
  createNewStateFromUrlData,
  fieldsStringToInt,
  topicToField,
  categories,
  fieldsIntToString
} from "../../util/utility";
import { parse as queryStringParse } from "query-string";

const initialState = {
  filters: {
    forschungsgebiet: {
      name: "Forschungsgebiet",
      filterKey: "forschungsbereichstr",
      type: "a",
      uniqueVals: ["1", "2", "3", "4"],
      value: ["1", "2", "3", "4"]
    },
    hauptthema: {
      name: "Hauptthema",
      filterKey: "hauptthema",
      type: "a",
      uniqueVals: [],
      value: []
    },
    geldgeber: {
      name: "Geldgeber",
      filterKey: "geldgeber",
      type: "a",
      uniqueVals: [],
      value: []
    }
  },
  graph: "2",
  projects: [],
  filteredProjects: [],
  institutions: [],
  categories: categories,
  clusterData: undefined,
  selectedProject: undefined
};

// Keep the reducer switch lean by outsourcing the actual code below
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_GRAPH:
      return {
        ...state,
        graph: action.value,
        filteredData: applyFilters(state.projects, state.filters)
      };

    case actionTypes.FILTER_CHANGE:
      return changeFilter(state, action);

    case actionTypes.ACTIVATE_POPOVER:
      return activatePopover(state, action);

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

    default:
      return state;
  }
};

const applyFilters = (data, filter) => {
  let filteredData = data;
  Object.values(filter).forEach(f => {
    let newFilteredData = {};
    filteredData = Object.keys(filteredData).forEach(d => {
      if (f.type === "a") {
        if (f.value.some(value => value === filteredData[d][f.filterKey]))
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

const updateProjectsData = (state, action) => {
  const projectData = action.value;
  const projects = Object.values(projectData).map(project => {
    project.hauptthema = project.review_board
      ? project.review_board
      : "Unbekannt";
    project.geldgeber = project.sponsor;
    if (project.research_area) {
      return {
        ...project,
        forschungsbereich: project.research_area.split(" (")[0],
        forschungsbereichstr: project.research_area.split(" (")[0], // TODO please change API so it does not contain "(# Mitglieder)"
        forschungsbereichNumber: fieldsStringToInt(
          project.research_area.split(" (")[0]
        )
      };
    } else {
      return {
        ...project,
        forschungsbereich: "Unbekannt",
        forschungsbereichstr: "Unbekannt", // TODO please change API so it does not contain "(# Mitglieder)"
        forschungsbereichNumber: fieldsStringToInt("Unbekannt")
      };
    }
  });

  const uniqueFields = [];
  const uniqueTopics = [];
  const uniqueSponsors = [];

  Object.values(projects).forEach(project => {
    Object.keys(project).forEach(property => {
      const value = project[property];
      if (property === "forschungsbereichstr") {
        if (!uniqueFields.some(e => e === value)) uniqueFields.push(value);
      } else if (property === "hauptthema") {
        if (!uniqueTopics.some(e => e === value)) uniqueTopics.push(value);
      } else if (property === "geldgeber") {
        if (!uniqueSponsors.some(e => e === value)) uniqueSponsors.push(value);
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
    }
  };

  return Object.assign({}, state, {
    projects: projects,
    filters: newFilters,
    filteredProjects: applyFilters(projects, newFilters)
  });
};

const changeFilter = (state, action) => {
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

const activatePopover = (state, action) => {
  let selectedProjectId = null;
  state.projects.forEach(project => {
    if (project.id === action.element.project.id) {
      selectedProjectId = project.id;
    }
  });
  return {
    ...state,
    selectedProject: selectedProjectId
  };
};

const deactivatePopover = state => {
  const newState = {
    ...state,
    selectedProject: undefined
  };
  return newState;
};

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
