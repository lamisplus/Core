import * as ACTION_TYPES from "./../actions/types";

const initialState = {
    list: [],
    listPatient: [],
};

const caseManagerReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.PATIENTS_FETCH_ALL:
            return {...state, list: action.payload};

        case ACTION_TYPES.USERS_FETCH_BY_ID:
            return {...state, list: action.payload};

        case ACTION_TYPES.PATIENT_BY_USER_ID:
            return {...state, listPatient: action.payload};

        case ACTION_TYPES.USER_ERROR:
            return {...state, list: action.payload};

        case ACTION_TYPES.PATIENTS_CREATE:
            return {...state, status: action.payload};

        case ACTION_TYPES.PATIENTS_UPDATE:
            return { ...state, updated: action.payload };

        default:
            return state
    }
}
    export default caseManagerReducer;

