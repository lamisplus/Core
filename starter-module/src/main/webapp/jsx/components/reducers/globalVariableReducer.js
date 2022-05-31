import * as ACTION_TYPES from '../actions/types'

const initialState = {
  list: [],
}

const globalVariableReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.GLOBAL_VARIABLE_FETCH_ALL:
      return { ...state, list: [...action.payload] }

    default:
      return state
  }
}

export default globalVariableReducer


