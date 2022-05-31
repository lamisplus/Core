import * as ACTION_TYPES from '../actions/types'

const initialState = {
  list: [],
  moduleList:[],
  moduleMenuList:[]

}

const bootstrapModuleReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_ALL_BOOTSTRAP_MODULE:
      return { ...state, list: [...action.payload] }
    case ACTION_TYPES.GET_MODULE_MENU:
      return { ...state, moduleMenuList: action.payload}
    default:
      return state
  }
}

const bootstrapModuleBYBacthNumberReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_ALL_BOOTSTRAP_MODULE_BY_BATCH_NUM:
      return { ...state, moduleList: [...action.payload] }

    default:
      return state
  }
}

export default bootstrapModuleReducer


