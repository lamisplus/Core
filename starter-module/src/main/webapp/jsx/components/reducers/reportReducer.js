import * as ACTION_TYPES from '../actions/types'

const initialState = {
    template: [],
    error: {},
    form: {},
    reportList:[]
}

const reportReducer = (state = {  reportList:[], form:{}, services:[], template:[]}, action) => {
    switch (action.type) {
        case ACTION_TYPES.REPORTS_CREATE_REPORT:
            return { ...state, status: action.payload }

        case ACTION_TYPES.REPORTS_FETCH_ALL:
            return {...state, reportList:action.payload}

        case ACTION_TYPES.REPORTS_UPDATE:
            return {...state, form:action.payload}

        case ACTION_TYPES.REPORTS_GENERATE_REPORT:
            return { ...state, status: action.payload }

        case ACTION_TYPES.REPORTS_ERROR:
            return { ...state, error: action.payload }

        default:
            return state
    }
}

export default reportReducer


