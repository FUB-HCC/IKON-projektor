import * as actionTypes from '../actions/actionTypes'
import {
  createNewStateFromUrlData,
  fieldsStringToInt,
  topicToField,
  categories
} from '../utility'
import {parse as queryStringParse} from 'query-string'

const initialState = {
  filters: {
    forschungsgebiet: {
      name: 'Forschungsgebiet',
      filterKey: 'forschungsbereichstr',
      type: 'a',
      uniqueVals: ['1','2','3','4'],
      value: ['1','2','3','4']
    },
    hauptthema: {
      name: 'Hauptthema',
      filterKey: 'hauptthema',
      type: 'a',
      uniqueVals: [],
      value: []
    },
    geldgeber: {
      name: 'Geldgeber',
      filterKey: 'geldgeber',
      type: 'a',
      uniqueVals: [],
      value: []
    }
  },
  graph: '0',
  projects: [],
  filteredProjects: [],
  institutions: [],
  categories: categories,
  clusterData: undefined,
  selectedProject: undefined
}

// Keep the reducer switch lean by outsourcing the actual code below
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_GRAPH:
      return {
        ...state,
        graph: action.value,
        filteredData: applyFilters(state.projects, state.filters)
      }

    case actionTypes.FILTER_CHANGE:
      return changeFilter(state, action)

    case actionTypes.TOGGLE_FILTERS:
      return toggleFilters(state, action)

    case actionTypes.ACTIVATE_POPOVER:
      return activatePopover(state, action)

    case actionTypes.DEACTIVATE_POPOVER:
      return deactivatePopover(state)

    case actionTypes.GET_FILTERS_FROM_URL:
      return urlUpdatesFilters(state)

    case actionTypes.UPDATE_CLUSTER_DATA:
      return updateClusterData(state, action)

    case actionTypes.UPDATE_INSTITUTIONS_DATA:
      return updateInstitutionsData(state, action)

    case actionTypes.UPDATE_PROJECTS_DATA:
      return updateProjectsData(state, action)

    default:
      return state
  }
}

const applyFilters = (data, filter) => {
  let filteredData = data
  Object.values(filter).forEach(f => {
    let newFilteredData = {}
    filteredData = Object.keys(filteredData).forEach(d => {
      if (f.type === 'a') {
        if (f.value.some(value => value === filteredData[d][f.filterKey])) newFilteredData[d] = filteredData[d]
      } else {
        if (filteredData[d][f.filterKey].includes(f.value)) newFilteredData[d] = filteredData[d]
      }
    })
    filteredData = newFilteredData
  })
  return filteredData
}
const compare = (a, b) => {
  if (topicToField(a) < topicToField(b)) return -1
  else return 1
}

const updateClusterData = (state, action) => (Object.assign({}, state, {
  clusterData: action.value
}));

const updateInstitutionsData = (state, action) => (Object.assign({}, state, {
  institutions: action.value
}));

const updateProjectsData = (state, action) => {
  const projectData = action.value
  const projects = Object.values(projectData).map(project => {
    project.hauptthema = project.review_board ? project.review_board : 'Unbekannt'
    project.geldgeber = project.sponsor
    if (project.research_area) {
      return {
        ...project,
        forschungsbereich: project.research_area.split(' (')[0],
        forschungsbereichstr: project.research_area.split(' (')[0], // TODO please change API so it does not contain "(# Mitglieder)"
        forschungsbereichNumber: fieldsStringToInt(project.research_area.split(' (')[0])
      }
    } else {
      return {
        ...project,
        forschungsbereich: 'Unbekannt',
        forschungsbereichstr: 'Unbekannt', // TODO please change API so it does not contain "(# Mitglieder)"
        forschungsbereichNumber: fieldsStringToInt('Unbekannt')
      }
    }
  })

  const uniqueFields = []
  const uniqueTopics = []
  const uniqueSponsors = []

  Object.values(projectData).forEach(project => {
    Object.keys(project).forEach(property => {
      const value = project[property]
      if (property === 'forschungsbereichstr') {
        if (!uniqueFields.some(e => e === value)) uniqueFields.push(value)
      } else if (property === 'hauptthema') {
        if (!uniqueTopics.some(e => e === value)) uniqueTopics.push(value)
      } else if (property === 'geldgeber') {
        if (!uniqueSponsors.some(e => e === value)) uniqueSponsors.push(value)
      }
    })
  })

  return Object.assign({}, state, {
    projects: projects,
    filters: {
      ...state.filters,
      forschungsgebiet: {
        ...state.filters.forschungsgebiet,
        uniqueVals: uniqueFields.sort(compare)
      },
      hauptthema: {
        ...state.filters.hauptthema,
        uniqueVals: uniqueTopics.sort(compare)
      },
      geldgeber: {
        ...state.filters.geldgeber,
        uniqueVals: uniqueSponsors.sort(compare)
      }
    }
  })
}

const changeFilter = (state, action) => {
  const newFilter = state.filters.slice()
  const actionValue = action.value
  if (state.filters[action.id].value.some(e => e === actionValue)) {
    newFilter[action.id].value = state.filters[action.id].value.filter(key => key !== actionValue)
  } else {
    newFilter[action.id].value.push(actionValue)
  }
  return  {
    ...state,
    filters: newFilter,
    filteredProjects: applyFilters(state.projects, newFilter)
  }
}

const toggleFilters = (state, action) => state
//   const newFilter = state.filter.map(fil => {
//     if (fil.key === action.key) fil.value = action.filters
//     return fil
//   })
//   const newFilteredData = applyFilters(state.data, newFilter)
//   const newState = {
//     ...state,
//     filter: newFilter,
//     filteredData: newFilteredData
//   }
//   updateUrl(newState)
//   return newState
// }

const activatePopover = (state, action) => {  
  let selectedProjectId = null
  state.projects.forEach(project => {
    if (project.id === action.element.project.id) {
      selectedProjectId = project.id
    }
  })
  return {
    ...state,
    selectedProject: selectedProjectId
  }
}

const deactivatePopover = (state) => {
  const newState = {
    ...state,
    selectedProject: undefined
  }
  return newState
}

// urlUpdatesState: Don't call this function. Only used upon initial loading
const urlUpdatesFilters = (state) => {
  const urlData = queryStringParse(window.location.search)
  const dataFromUrl = createNewStateFromUrlData(state, urlData)
  return {
    ...state,
    filter: dataFromUrl.filter,
    graph: dataFromUrl.graph,
    filteredProjects: applyFilters(state.projects, dataFromUrl.filter),
    selectedProject: dataFromUrl.selectedProject
  }
}

export default reducer
