import * as actionTypes from '../actions/actionTypes'
import {updateUrl, fieldsStringToInt} from '../utility'
import {getData} from '../../assets/data'
import {parse as queryStringParse} from 'query-string'

const data = getData()

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
    {name: 'field', key: 'forschungsbereich', type: 'a', value: ['1', '2', '3', '4']},
    {name: 'topic', key: 'hauptthema', type: 'a', value: ['Wissenschaftsdatenmanagement', 'Biodiversitäts- und Geoinformatik', 'Perspektiven auf Natur - PAN', 'Historische Arbeitsstelle', 'Sammlungsentwicklung', 'Wissenschaft in der Gesellschaft', 'Bildung und Vermittlung', 'Evolutionäre Morphologie', 'Ausstellung und Wissenstransfer', 'Mikroevolution', 'Impakt- und Meteoritenforschung', 'Diversitätsdynamik', 'Biodiversitätsentdeckung', 'IT- Forschungsinfrastrukturen', 'Kompetenzzentrum Sammlung']},
    {name: 'sponsor', key: 'geldgeber', type: 's', value: ''}
  ],
  graph: '0',
  data: data,
  filteredData: data
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
      updateUrl(newState.filter, newState.graph)
      return newState

    case actionTypes.FILTER_CHANGE:
      // console.log('STATE CHANGE: ', action.type, action)
      return changeFilter(state, action)

    default:
      // console.log('STATE CHANGE: DEFAULT')
      return urlUpdatesFilters(state)
  }
}

const changeFilter = (state, action) => {
  let newFilter = state.filter.slice()
  if (action.form === 's') newFilter[action.id].value = action.value
  else {
    let actionValue
    action.id === 0 ? actionValue = fieldsStringToInt(action.value) : actionValue = action.value
    if (state.filter[action.id].value.some(e => e === actionValue)) {
      newFilter[action.id].value = state.filter[action.id].value.filter(key => key !== actionValue)
    } else {
      newFilter[action.id].value.push(actionValue)
    }
  }
  const filteredData = applyFilters(state.data, newFilter)
  updateUrl(newFilter, state.graph)
  return {
    ...state,
    filter: newFilter,
    filteredData: filteredData
  }
}

// urlUpdatesState: Don't call this function. Only used upon initial loading
const urlUpdatesFilters = (state) => {
  const urlData = queryStringParse(location.search)
  const dataFromUrl = updateUrl(state.filter, state.graph, urlData)
  console.log(dataFromUrl)
  return {
    ...state,
    filter: dataFromUrl.filter,
    graph: dataFromUrl.graph,
    filteredData: applyFilters(state.data, dataFromUrl.filter)
  }
}

export default reducer
