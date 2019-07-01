import * as actionTypes from './actionTypes'

// action emitters to keep the containers clean

export const changeGraph = (value) => {
  return {
    type: actionTypes.CHANGE_GRAPH,
    value: value
  }
}

export const filterChange = (filterId, value) => {
  // console.log('filterId', filterId)
  // console.log('value', value)
  return {
    type: actionTypes.FILTER_CHANGE,
    id: filterId,
    value: value
  }
}

export const toggleAllFilters = (key, filters) => {
  return {
    type: actionTypes.TOGGLE_FILTERS,
    key: key,
    filters: filters
  }
}

export const activatePopover = (datapoint, vis) => {
  return {
    type: actionTypes.ACTIVATE_POPOVER,
    element: datapoint,
    vis: vis
  }
}

export const deactivatePopover = () => {
  return {
    type: actionTypes.DEACTIVATE_POPOVER
  }
}

export const yearChange = (value) => {
  return {
    type: actionTypes.CHANGE_YEARS,
    value: value
  }
}

export const visTypeChange = (value) => {
  return {
    type: actionTypes.CHANGE_VISTYPE,
    value: value
  }
}

export const viewTypeChange = (value) => {
  return {
    type: actionTypes.CHANGE_VIEWTYPE,
    value: value
  }
}
