import * as ACTION_TYPES from '../actions/types'

const initialState = {
  list: [],

}

const generalUsersDashboardModuleReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_ALL_REGISTERED_PATIENTS:
      return { ...state, list: [...action.payload] }

    default:
      return state
  }
}

export default generalUsersDashboardModuleReducer