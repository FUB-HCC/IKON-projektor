import * as actionTypes from '../actions/actionTypes'
import {updateUrl, fieldsStringToInt, fieldsIntToString} from '../utility'
import {getData} from '../../assets/data'
import {parse as queryStringParse} from 'query-string'

const initData = getData()
const data = Object.keys(initData).map(d => (
  {...initData[d],
    forschungsbereich: fieldsIntToString(initData[d].forschungsbereich)
  }))

const applyFilters = (data, filter) => {
  let filteredData = data
  filter.forEach(f => {
    let newFilteredData = {}
    filteredData = Object.keys(filteredData).forEach(d => {
      if (f.type === 'a') {
        if (f.value.some(value => value === filteredData[d][f.key])) newFilteredData[d] = filteredData[d]
      } else {
        if (filteredData[d][f.key].includes(f.value)) newFilteredData[d] = filteredData[d]
      }
    })
    filteredData = newFilteredData
  })
  return filteredData
}

const initialState = {
  filter: [
    {name: 'field', key: 'forschungsbereich', type: 'a', value: ['Evolution und Geoprozesse', 'Sammlungsentwicklung und Biodiversitätsentdeckung', 'Digitale Welt und Informationswissenschaft', 'Wissenskommunikation und Wissensforschung']},
    {name: 'topic', key: 'hauptthema', type: 'a', value: ['Wissenschaftsdatenmanagement', 'Biodiversitäts- und Geoinformatik', 'Perspektiven auf Natur - PAN', 'Historische Arbeitsstelle', 'Sammlungsentwicklung', 'Wissenschaft in der Gesellschaft', 'Bildung und Vermittlung', 'Evolutionäre Morphologie', 'Ausstellung und Wissenstransfer', 'Mikroevolution', 'Impakt- und Meteoritenforschung', 'Diversitätsdynamik', 'Biodiversitätsentdeckung', 'IT- Forschungsinfrastrukturen', 'Kompetenzzentrum Sammlung']},
    {name: 'sponsor', key: 'geldgeber', type: 's', value: ''}
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

    default:
      // console.log('STATE CHANGE: DEFAULT')
      return urlUpdatesFilters(state)
  }
}

const changeFilter = (state, action) => {
  let newFilter = state.filter.slice()
  if (action.form === 's') newFilter[action.id].value = action.value
  else {
    const actionValue = action.value
    if (state.filter[action.id].value.some(e => e === actionValue)) {
      newFilter[action.id].value = state.filter[action.id].value.filter(key => key !== actionValue)
    } else {
      newFilter[action.id].value.push(actionValue)
    }
  }
  const filteredData = applyFilters(state.data, newFilter)
  const newState = {
    ...state,
    filter: newFilter,
    filteredData: filteredData
  }
  updateUrl(newState)
  return newState
}

const toggleFilters = (state, action) => {
  const badCode = action.filters.map(fil => ['Evolution und Geoprozesse', 'Sammlungsentwicklung und Biodiversitätsentdeckung', 'Digitale Welt und Informationswissenschaft', 'Wissenskommunikation und Wissensforschung'].some(e => e === fil) ? fieldsStringToInt(fil) : fil)
  const newFilter = state.filter.map(fil => {
    if (fil.key === action.key) fil.value = badCode
    return fil
  })
  const newFilteredData = applyFilters(state.data, newFilter)
  const newState = {
    ...state,
    filter: newFilter,
    filteredData: newFilteredData
  }
  updateUrl(newState)
  return newState
}

const activatePopover = (state, action) => {
  const newState = {
    ...state,
    selectedProject: data[action.element.projectId] ? action.element.projectId : state.selectedProject
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
