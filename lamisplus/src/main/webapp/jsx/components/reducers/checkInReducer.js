import * as ACTION_TYPES from '../actions/types'
// const initialState = {
//     list: []
// }

const checkInReducer = (state = {checkIn:{}}, action) => {
  switch (action.type) {
    case ACTION_TYPES.CHECKIN_FETCH_ALL:
      return [...state, action.payload]

    case ACTION_TYPES.CHECKIN_CREATE:
      return [{...state, checkIn: action.payload}]

    case ACTION_TYPES.CHECKIN_UPDATE:
      return [...state, action.payload]

    case ACTION_TYPES.CHECKIN_DELETE:
      return [...state, action.payload]

    default:
      return state
  }
}

export default checkInReducer
