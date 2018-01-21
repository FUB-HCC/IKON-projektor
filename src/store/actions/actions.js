import * as actionTypes from './actionTypes'

// action emitters to keep the containers clean

export const stateUpdatesUrl = () => {
  return {
    type: actionTypes.STATE_UPDATES_URL
  }
}
