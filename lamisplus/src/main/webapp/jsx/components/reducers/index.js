import { combineReducers } from 'redux'
import checkInReducer from './checkInReducer'
import patientReducer from './patientReducer'
import encounterReducer from './encounterReducer'
import formManagerReducer from './formManagerReducer'
import pharmReducer from "./pharmacyReducer";
import laboratoryReducer from "./laboratoryReducer"
import consultationReducer from './consultationReducer'
import medicationReducer from './medicationReducer'
import formReducers from './formReducers'
import reportReducer from './reportReducer'
import visitReducer from './visitReducer'
import registrationReducer from './registrationReducer'
import userReducer from './userReducer'
import applicationCodesetReducer from './applicationCodesetReducer'
import appointmentReducer from './appointmentReducer'
import globalVariableReducer from "./globalVariableReducer";
import internationalStandardReducer from "./internationalStandardReducer";
import bootstrapModuleReducer from "./bootstrapReducer";
import organizationalUnitReducer from './organizationalUnitReducer';
import rolesReducer from './rolesReducer';
import generalUsersDashboardModuleReducer from './generalUserDashboardReducer';
import programManagerReducer from './programManagerReducer';
import caseManagerReducer from './caseManagerReducer'

import menuReducer from "./menu";

export default combineReducers({
  patients: patientReducer,
  checkedIn: checkInReducer,
  pharmacy: pharmReducer,
  encounter: encounterReducer,
  laboratory: laboratoryReducer,
  formManager: formManagerReducer,
  consultations: consultationReducer,
  formReducers: formReducers,
  reportReducer: reportReducer,
  medication: medicationReducer,
  visit: visitReducer,
  registration: registrationReducer,
  users: userReducer,
  applicationCodesets: applicationCodesetReducer,
  appointments: appointmentReducer,
  globalVariables: globalVariableReducer,
  programManager: programManagerReducer,
  standards: internationalStandardReducer,
  boostrapmodule: bootstrapModuleReducer,
  organizationalUnitReducer : organizationalUnitReducer,
  roles: rolesReducer,
  generalUsersDashboardModuleReducer : generalUsersDashboardModuleReducer,
  menu: menuReducer,
  caseManager: caseManagerReducer
})

