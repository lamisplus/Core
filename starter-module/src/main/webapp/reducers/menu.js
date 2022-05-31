import * as ACTION_TYPES from '../actions/types'

const initialState = {
  list: [],
  permissions: [],
  submenuList:[]
}

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.MENU_FETCH_ALL:
      return { ...state, list: [...action.payload] }
    case ACTION_TYPES.FETCH_PERMISSIONS:
      return { ...state, permissions: [...action.payload] }
    case ACTION_TYPES.FETCH_ALL_SUB_MENU:
      return { ...state, submenuList: action.payload}
    default:
      return state
  }
}

export default menuReducer


