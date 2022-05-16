import * as ACTION_TYPES from '../actions/types'

const medicationReducer = (state = {medicationList: [], regimenList: [], regimenLineList: [], errors: {}}, action) => {
  switch (action.type) {
    case ACTION_TYPES.MEDICATION_FETCH:
      return {...state, medicationList:action.payload}
    case ACTION_TYPES.REGIMEN_FETCH:
      return {...state, regimenList:action.payload}
    case ACTION_TYPES.REGIMEN_LINE_FETCH:
      return {...state, regimenLineList:action.payload}
    case ACTION_TYPES.MEDICATION_ERROR:
      return {...state, errors:action.payload}  
    default:
      return state
  }
}

export default medicationReducer
