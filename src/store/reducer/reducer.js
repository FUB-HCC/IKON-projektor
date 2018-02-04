import * as actionTypes from '../actions/actionTypes'
import {updateUrl} from '../utility'
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
    {name: 'topic', key: 'hauptthema', type: 'a', value: ['Perspektiven auf Natur - PAN', 'Biodiversitäts- und Geoinformatik', 'Sammlungsentwicklung', 'Biodiversitätsentdeckung', 'Evolutionäre Morphologie']},
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
      const newState = {
        ...state,
        graph: action.value,
        filteredData: applyFilters(state.data, state.filter)
      }
      updateUrl(state.filter, state.graph)
      return newState
    default: return urlUpdatesFilters(state)
  }
}

// urlUpdatesState: Don't call this function. Only used upon initial loading
const urlUpdatesFilters = (state) => {
  const urlData = queryStringParse(location.search)
  const dataFromUrl = updateUrl(state.filter, state.graph, urlData)
  return {
    ...state,
    filter: dataFromUrl.filter,
    graph: dataFromUrl.graph,
    filteredData: applyFilters(state.data, state.filter)
  }
}

export default reducer
