import * as actionTypes from '../actions/actionTypes'
import {updateUrl, fieldsIntToString, topicToField} from '../utility'
import {getData} from '../../assets/data'
import {parse as queryStringParse} from 'query-string'

const data = getData()
const distFields = []
const distTopics = []
const distSponsor = []

Object.keys(data).map(dataEntry => {
  data[dataEntry] = {
    ...data[dataEntry],
    forschungsbereichstr: fieldsIntToString(data[dataEntry].forschungsbereich)
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
})
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
    {name: 'Forschungsgebiet', filterKey: 'forschungsbereichstr', type: 'a', distValues: distFields.sort(compare), value: distFields},
    {name: 'Hauptthema', filterKey: 'hauptthema', type: 'a', distValues: distTopics.sort(compare), value: distTopics},
    {name: 'Geldgeber', filterKey: 'geldgeber', type: 'a', distValues: distSponsor.sort(compare), value: distSponsor}
  ],
  graph: '0',
  data: data,
  filteredData: data,
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
  if (action.vis === 1) {
    const newState = {
      ...state,
      selectedProject: state.data[action.element.projectId] ? action.element.projectId : state.selectedProject
    }
    updateUrl(newState)
    return newState
  } else {
    const newState = {
      ...state,
      selectedProject: state.data[action.element.project.id] ? action.element.project.id : state.selectedProject
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
    filteredData: applyFilters(state.data, dataFromUrl.filter),
    selectedProject: dataFromUrl.selectedProject
  }
}

export default reducer
