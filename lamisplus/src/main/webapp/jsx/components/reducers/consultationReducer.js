import * as ACTION_TYPES from '../actions/types'

const consultationReducer = (state = {newConsultation: {}}, action) => {
  switch (action.type) {
     case ACTION_TYPES.CONSULTATION_CREATE:
      return {...state, newConsultation:action.payload}
    default:
      return state
  }
}

export default consultationReducer;