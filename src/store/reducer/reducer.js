import * as actionTypes from '../actions/actionTypes'
import {updateFilter} from '../utility'
import {getData} from '../../assets/data'
// import { updateState } from '../utility'  ONLY UPDATE STATE WITH THIS FUNCTION usage: updateObject(state, newObjToMergeWithState)

const queryString = require('query-string') // queryString import
const data = getData()

const initialState = {
  filter: {
    graph: '0',
    field: '', // Forschungsbereiche (String)
    topic: '' // Topics (String)
  },
  data: data
}

// Keep the reducer switch lean by outsourcing the actual code below

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_FILTER:
      return {
        ...state,
        filter: updateFilter(state.filter, {[action.key]: action.value})
      }
    default: return urlUpdatesFilters(state)
  }
}

// urlUpdatesState: Don't call this function. Only used upon initial loading
const urlUpdatesFilters = (state) => {
  const parsedObj = queryString.parse(location.search)
  return {
    ...state,
    filter: updateFilter(state.filter, parsedObj)
  }
}

export default reducer
