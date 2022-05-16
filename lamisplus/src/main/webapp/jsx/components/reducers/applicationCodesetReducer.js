import * as ACTION_TYPES from '../actions/types'

const initialState = {
  priorities: [],
  relationships: [],
  vlIndications: [],
  applicationCodesetList: [],
  wardList: [],
  bookingStatusList: [],
  genderList: [],
  biometricsFinger: []
}

const applicationCodesetReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.APPLICATION_CODESET_PRIORITIES:
      return { ...state, priorities: [...action.payload] }

    case ACTION_TYPES.APPLICATION_CODESET_RELATIONSHIPS:
      return { ...state, relationships: [...action.payload] }

      case ACTION_TYPES.APPLICATION_CODESET_VL_INDICATION:
      return { ...state, vlIndications: [...action.payload] }

    case ACTION_TYPES.APPLICATION_CODESET_LIST:
      return { ...state, applicationCodesetList: [...action.payload] }

    case ACTION_TYPES.APPLICATION_CODESET_GENDER:
      return { ...state, genderList: [...action.payload] }

    case ACTION_TYPES.APPLICATION_CODESET_BOOKING_STATUS:
      return { ...state, bookingStatusList: [...action.payload] }

    case ACTION_TYPES.APPLICATION_CODESET_BIOMETRICS_FINGERPRINT:
      return { ...state, biometricsFinger: [...action.payload] }

    case ACTION_TYPES.WARD_LIST:
      return { ...state, wardList: [...action.payload] }
    default:
      return state
  }
}

export default applicationCodesetReducer


