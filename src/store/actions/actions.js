import * as actionTypes from './actionTypes'

// action emitters to keep the containers clean

export const updateFilter = (filterKey, filterValue) => {
  return {
    type: actionTypes.UPDATE_FILTER,
    key: filterKey,
    value: filterValue
  }
}
