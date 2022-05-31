import * as ACTION_TYPES from '../actions/types'
// const initialState = {
//     list: []
// }

const encounterReducer = (state = { encounters: [], cencounter: {}, encounter: {}}, action) => {
  switch (action.type) {
    case ACTION_TYPES.ENCOUNTER_FETCH_ALL:
      return {...state, encounters:action.payload}

    case ACTION_TYPES.ENCOUNTER_CREATE:
      return {...state, createEncounter:action.payload}

    case ACTION_TYPES.ENCOUNTER_UPDATE:
      return [...state, action.payload]

    case ACTION_TYPES.ENCOUNTER_DELETE:
      return [...state, action.payload]
      
    case ACTION_TYPES.ENCOUNTER_FETCH_BY_ID:
      return {...state, encounter:action.payload}
  
    default:
      return state
  }
}

export default encounterReducer
