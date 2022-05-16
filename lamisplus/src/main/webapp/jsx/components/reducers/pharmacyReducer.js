 import * as ACTION_TYPES from "../actions/types";

const initialState = {
  allPrescriptions: [],
  patientPrescriptions: [],
  medicationList: [],
  list:[]
};

 const  pharmacyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.PHARMACY_FETCH_PRESCRIPTIONS:
      return { ...state, allPrescriptions: [...action.payload] };
    case ACTION_TYPES.FETCH_PATIENT_PRESCRIPTIONS:
      return { ...state, patientPrescriptions: [...action.payload] };
    case ACTION_TYPES.MEDICATION_FETCH:
      return {...state, medicationList:action.payload}
    case ACTION_TYPES.UPDATE_PRESCRIPTION_STATUS:
      return { ...state, update: action.payload };
    case ACTION_TYPES.PHARMACY_PRESCRIPTION_FOR_PATIENT:
        return { ...state, list: action.payload };
      
    default:
      return state;
  }
};

export default pharmacyReducer;


