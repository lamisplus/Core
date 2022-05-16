import * as ACTION_TYPES from '../actions/types'

const initialState = {
  list: [],
  patient: {},
  tests: [],
  testGroup: [],
  testorder:[],
  formdata:[],
  manifest:[],
  samplesmanifest:[],
  radiologyTests: [],
  radiologySearchList: [],
  radiologyTestGroup: [],
  radiologyTestTypes: [],
  manifestDetail: []
}

const laboratoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.LABORATORY_TESTORDER:
      return { ...state, list: [...action.payload] }

    case ACTION_TYPES.LABORATORY_TESTORDER_FOR_PATIENT:
      return { ...state, testorder: [...action.payload] }

    case ACTION_TYPES.CREATE_COLLECT_SAMPLE:
      return { ...state, status: action.payload }

    case ACTION_TYPES.ERROR_CREATE_COLLECT_SAMPLE:
      return { ...state, errmsg: action.payload }

    case ACTION_TYPES.FORMDATA_FETCH_BY_ID:
      return { ...state, formdata: action.payload }
    
    case ACTION_TYPES.FETCH_ALL_TEST_GROUP:
      return { ...state, testGroup: action.payload }

    case ACTION_TYPES.FETCH_ALL_TESTS_BY_TEST_GROUP:
      return { ...state, tests: action.payload }

    case ACTION_TYPES.FETCH_ALL_TESTS_BY_ENCOUNTER_ID:
        return { ...state, tests: action.payload }

    case ACTION_TYPES.SAMPLE_DISPATCHED:
      return { ...state, manifest: action.payload }  
    
    case ACTION_TYPES.SAMPLES_MANIFEST_BY_ID:
        return { ...state, samplesmanifest: action.payload }  
    case ACTION_TYPES.FETCH_ALL_RADIOLOGY_TESTS_BY_ENCOUNTER_ID:
      return { ...state, radiologyTests: action.payload }

    case ACTION_TYPES.MANIFEST_DETAIL_BY_ID:
      return {
        ...state,
        manifestDetail: action.payload,
      };  

    case ACTION_TYPES.RADIOLOGY_TEST_ORDERS:
      return {...state, radiologySearchList: action.payload}

    case ACTION_TYPES.FETCH_ALL_RADIOLOGY_TEST_GROUP:
      return { ...state, radiologyTestGroup: action.payload }

    case ACTION_TYPES.FETCH_ALL_RADIOLOGY_TESTS_BY_TEST_GROUP:
      return { ...state, radiologyTestTypes: action.payload }

    default:
      return state
  }
}

export default laboratoryReducer


