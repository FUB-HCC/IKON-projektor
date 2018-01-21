import * as actionTypes from './actionTypes'

// action emitters to keep the containers clean

export const urlUpdatesState = () => {
  return {
    type: actionTypes.URL_UPDATES_STATE
  }
}
