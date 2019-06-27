import * as actionTypes from '../actions/actionTypes'
import {
  createNewStateFromUrlData,
  fieldsStringToInt,
  topicToField,
  categories
} from '../utility'
import {getProjectsData, getInstitutionsData} from '../../assets/publicData'
import {parse as queryStringParse} from 'query-string'
import axios from "axios";

const institutionsData = getInstitutionsData()
const data = getProjectsData()
const distFields = []
const distTopics = []
const distSponsor = []

Object.keys(data).forEach(dataEntry => {
  data[dataEntry].hauptthema = (data[dataEntry].review_board ? data[dataEntry].review_board : 'Unbekannt')
  data[dataEntry].geldgeber = data[dataEntry].sponsor

  if (data[dataEntry].research_area) {
    data[dataEntry] = {
      ...data[dataEntry],
      forschungsbereich: data[dataEntry].research_area.split(' (')[0],
      forschungsbereichstr: data[dataEntry].research_area.split(' (')[0], // TODO please change API so it does not contain "(# Mitglieder)"
      forschungsbereichNumber: fieldsStringToInt(data[dataEntry].research_area.split(' (')[0])
    }
  } else {
    data[dataEntry] = {
      ...data[dataEntry],
      forschungsbereich: 'Unbekannt',
      forschungsbereichstr: 'Unbekannt', // TODO please change API so it does not contain "(# Mitglieder)"
      forschungsbereichNumber: fieldsStringToInt('Unbekannt')
    }
  }
  
  Object.keys(data[dataEntry]).forEach(dataKey => {
    const val = data[dataEntry][dataKey]
    
    if (dataKey === 'forschungsbereichstr') {
      if (!distFields.some(e => e === val)) distFields.push(val)
    } else if (dataKey === 'hauptthema') {
      if (!distTopics.some(e => e === val)) distTopics.push(val)
    } else if (dataKey === 'geldgeber') {
      if (!distSponsor.some(e => e === val)) distSponsor.push(val)
    }
  })
}
)
const applyFilters = (data, filter) => {
  let filteredData = data
  filter.forEach(f => {
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

const initialState = {
  filter: [
    {
      name: 'Forschungsgebiet',
      filterKey: 'forschungsbereichstr',
      type: 'a',
      distValues: distFields.sort(compare),
      value: distFields
    },
    {
      name: 'Hauptthema',
      filterKey: 'hauptthema',
      type: 'a',
      distValues: distTopics.sort(compare),
      value: distTopics
    },
    {
      name: 'Geldgeber',
      filterKey: 'geldgeber',
      type: 'a',
      distValues: distSponsor.sort(compare),
      value: distSponsor
    }
  ],
  graph: '0',
  data: data,
  filteredData: data,
  institutions: institutionsData,
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
        filteredData: applyFilters(state.data, state.filter)
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

    default:
      return state
  }
}

const updateClusterData = (state, action) => (Object.assign({}, state, {
  clusterData: action.value
}));

const changeFilter = (state, action) => {
  const newFilter = state.filter.slice()
  const actionValue = action.value
  if (state.filter[action.id].value.some(e => e === actionValue)) {
    newFilter[action.id].value = state.filter[action.id].value.filter(key => key !== actionValue)
  } else {
    newFilter[action.id].value.push(actionValue)
  }
  const newState = {
    ...state,
    filter: newFilter,
    filteredData: applyFilters(state.data, newFilter)
  }
  return newState
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
  state.data.forEach(project => {
    if (project.id === action.element.project.id) {
      selectedProjectId = project.id
    }
  })
  if (action.vis === 1) {
    const newState = {
      ...state,
      selectedProject: selectedProjectId
    }
    return newState
  } else {    
    const newState = {
      ...state,
      selectedProject: selectedProjectId
    }
    return newState
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
    filteredData: applyFilters(state.data, dataFromUrl.filter),
    selectedProject: dataFromUrl.selectedProject
  }
}

export default reducer
