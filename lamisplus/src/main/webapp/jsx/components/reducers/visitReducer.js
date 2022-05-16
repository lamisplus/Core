import * as ACTION_TYPES from '../actions/types'
// const initialState = {
//     list: []
// }

const visitReducer = (state = { visits: [], visit:{}}, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_VISIT:
      return {...state, visit:action.payload}

    case ACTION_TYPES.UPDATE_VISIT_ERROR:
      return {...state, visitError:action.payload}

    default:
      return state
  }
}

export default visitReducer
