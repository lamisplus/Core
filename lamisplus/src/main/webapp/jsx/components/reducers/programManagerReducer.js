import * as ACTION_TYPES from '../actions/types'

const initialState = {
    list: [],
}

const programManagerReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.PROGRAM_FETCH_ALL:
            return { ...state, list: [...action.payload] }

        default:
            return state
    }
}

export default programManagerReducer