import * as ACTION_TYPES from '../actions/types'
// const initialState = {
//     list: []
// }

const formManagerReducer = (state = { formList:[],  form:{}, formEncounter:{}, errors:"", programList:[]}, action) => {
  switch (action.type) {
    case ACTION_TYPES.FORM_FETCH_ALL:
      return {...state, formList:action.payload}

    case ACTION_TYPES.FORM_FETCH_BY_ID:
      return {...state, form:action.payload}

    case ACTION_TYPES.FORM_UPDATE:
      return {...state, form:action.payload}

    case ACTION_TYPES.FORM_SAVE_ENCOUNTER:
      return {...state, formEncounter:action.payload}  
     
    case ACTION_TYPES.FORM_ERROR:
      return {...state, errors:action.payload}  
        
    case ACTION_TYPES.PROGRAM_FETCH_ALL:
      return {...state, programList:action.payload}   
        
    default:
      return state
  }
}

export default formManagerReducer
