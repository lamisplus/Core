import * as ACTION_TYPES from "../actions/types";

const initialState = {
  list: [],
  status: 0,
  vitalSigns: {},
  vitalSignsList: [],
  allergies: [],
  patient: {},
  previousMedications: [],
  encounters: [],
  exclusiveEncounters: [],
  previousTestOrders: [],
  checkedInPatientList: [],
  consultationHistory: [],
  appointments: [],
  previousRadiologyOrders: [],
  patientCount: []
};

const patientReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.PATIENTS_FETCH_ALL:
      return { ...state, list: action.payload };

    case ACTION_TYPES.PATIENTS_FETCH_BY_ID:
      return { ...state, patient: action.payload };

    case ACTION_TYPES.PATIENTS_CREATE:
      return { ...state, status: action.payload };

    case ACTION_TYPES.PATIENTS_ERROR:
      return { ...state, errormsg: action.payload };

    case ACTION_TYPES.PATIENTS_UPDATE:
      return { ...state, updated: action.payload };

    case ACTION_TYPES.PATIENT_DELETE:
      return {
        ...state,
        list: state.list.filter((x) => x.patientId != action.payload),
      };

    case ACTION_TYPES.PATIENT_VITAL_SIGNS:
      return { ...state, vitalSignsList: action.payload };

    case ACTION_TYPES.PATIENT_LATEST_VITAL_SIGNS:
      return { ...state, vitalSigns: action.payload };

    case ACTION_TYPES.PATIENT_ALLERGIES:
      return { ...state, allergies: action.payload };

    case ACTION_TYPES.PATIENT_LATEST_MEDICATION_LIST:
      return { ...state, previousMedications: action.payload };

    case ACTION_TYPES.PATIENT_ENCOUNTER_LIST:
      return { ...state, encounters: action.payload };

    case ACTION_TYPES.PATIENT_EXCLUSIVE_ENCOUNTER_LIST:
      return { ...state, exclusiveEncounters: action.payload };

    case ACTION_TYPES.PATIENT_LAB_ORDERS:
      return { ...state, previousTestOrders: action.payload };

    case ACTION_TYPES.CHECKEDIN_PATIENT_FETCH_ALL:
      return { ...state, checkedInPatientList: action.payload };

    case ACTION_TYPES.FETCH_COUNTRIES:
      return { ...state, countries: action.payload };

    case ACTION_TYPES.PATIENT_UPDATE:
      return {
        ...state,
        list: state.list.map((x) =>
          x._id == action.payload._id ? action.payload : x
        ),
      };
    case ACTION_TYPES.PATIENT_CONSULTATION_HISTORY:
      return { ...state, consultationHistory: action.payload };

    case ACTION_TYPES.PATIENT_APPOINTMENTS:
      return { ...state, appointments: action.payload };

    case ACTION_TYPES.PATIENT_RADIOLOGY_ORDERS:
      return { ...state, previousRadiologyOrders: action.payload };
    
    case ACTION_TYPES.TOTAL_PATIENTS:
      return { ...state, patientCount: action.payload };
    default:
      return state;
  }
};

export default patientReducer;
