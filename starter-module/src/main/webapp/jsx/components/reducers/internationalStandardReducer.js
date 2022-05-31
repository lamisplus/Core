import * as ACTION_TYPES from '../actions/types'

const initialState = {
  icdList: [],
}

const internationalStandardReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.ICD_STANDARDS_FETCH_ALL:
      return { ...state, icdList: [...action.payload] }

    default:
      return state
  }
}

export default internationalStandardReducer


