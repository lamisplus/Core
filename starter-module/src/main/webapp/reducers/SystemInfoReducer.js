import * as ACTION_TYPES from '../actions/types'

const initialState = {
  list: [],
  settings: []

}

const SystemInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_ENV:
      return { ...state, list: action.payload }
    
    case ACTION_TYPES.FETCH_MATRICS:
      return { ...state, list:action.payload }
    case ACTION_TYPES.FETCH_LOGGER:
      return { ...state, list:action.payload}
    case ACTION_TYPES.FETCH_HEALTH:
   
         return { ...state, list:action.payload};
    case ACTION_TYPES.FETCH_ALL_SYSTEM_SETTINGS:
         return { ...state, settings:action.payload};
      
    default:
      return state
  }
}

export default SystemInfoReducer