import * as ACTION_TYPES from '../actions/types'

const initialState = {
  list: [], permissions: []
}

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.MENU_FETCH_ALL:
      return { ...state, list: [...action.payload] }
    case ACTION_TYPES.FETCH_PERMISSIONS:
      return { ...state, permissions: [...action.payload] }
    default:
      return state
  }
}

export default menuReducer


