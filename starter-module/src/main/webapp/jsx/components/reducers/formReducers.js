import * as FORMTYPES from '../actions/types'

const initialState = {
    form: {},
    status: 0,
};


const formReducer = (state = {  services:  [], formList:[], form:{}}, action) => {
    switch(action.type){
        case FORMTYPES.FORMTYPES_FETCH_ALL:
            return {...state, form:action.payload}

        case FORMTYPES.FORMTYPES_FETCH_ALL_FORMS:
            return {...state, formList:action.payload}

        case FORMTYPES.FORMTYPES_FETCH_SERVICES:
            return {...state, services: action.payload}

        case FORMTYPES.FORMTYPES_CREATE_FORM:
            return { ...state, status: action.payload }

        case FORMTYPES.FORMTYPES_FETCH_BY_ID:
            return {...state, form:action.payload}

        case FORMTYPES.FORMTYPES_UPDATE:
            return {...state, form:action.payload}

        case FORMTYPES.FORMTYPES_DELETE:
            return {...state, form: state.form.filter((x) => x.formId != action.payload),
            };

        case FORMTYPES.FORM_FETCH_BY_CODE:
            return {...state, form:action.payload}

        case FORMTYPES.FORMTYPES_ERROR:
            return {...state, errors:action.payload}
        default:
            return state
    }
}
export default formReducer