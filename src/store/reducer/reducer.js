import * as actionTypes from '../actions/actionTypes'
import {updateUrl, fieldsStringToInt, topicToField} from '../utility'
import {getProjectsData, getInstitutionsData} from '../../assets/publicData'
import {parse as queryStringParse} from 'query-string'

const institutionsData = getInstitutionsData()
const data = getProjectsData()
const distFields = []
const distTopics = []
const distSponsor = []

Object.keys(data).map(dataEntry => {
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

  Object.keys(data[dataEntry]).map(dataKey => {
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
  selectedProject: undefined
}

// Keep the reducer switch lean by outsourcing the actual code below

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_GRAPH:
      // console.log('STATE CHANGE: ', action.type, action)
      const newState = {
        ...state,
        graph: action.value,
        filteredData: applyFilters(state.data, state.filter)
      }
      updateUrl(newState)
      return newState

    case actionTypes.FILTER_CHANGE:
      // console.log('STATE CHANGE: ', action.type, action)
      return changeFilter(state, action)

    case actionTypes.TOGGLE_FILTERS:
      return toggleFilters(state, action)

    case actionTypes.ACTIVATE_POPOVER:
      console.log('STATE CHANGE: ', action.type, action)
      return activatePopover(state, action)

    case actionTypes.DEACTIVATE_POPOVER:
      console.log('STATE CHANGE: ', action.type, action)
      return deactivatePopover(state)

    default:
      // console.log('STATE CHANGE: DEFAULT')
      return urlUpdatesFilters(state)
  }
}

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
  updateUrl(newState)
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
    updateUrl(newState)
    return newState
  } else {
    const newState = {
      ...state,
      selectedProject: selectedProjectId
    }
    updateUrl(newState)
    return newState
  }
}

const deactivatePopover = (state) => {
  const newState = {
    ...state,
    selectedProject: undefined
  }
  updateUrl(newState)
  return newState
}

// urlUpdatesState: Don't call this function. Only used upon initial loading
const urlUpdatesFilters = (state) => {
  const urlData = queryStringParse(location.search)
  const dataFromUrl = updateUrl(state, urlData)
  return {
    ...state,
    filter: dataFromUrl.filter,
    graph: dataFromUrl.graph,
    filteredData: applyFilters(state.data, dataFromUrl.filter)
    // selectedProject: dataFromUrl.selectedProject // TODO
  }
}

export default reducer
