import { combineReducers } from 'redux'
import patientReducer from './patientReducer'
import registrationReducer from './registrationReducer'
import userReducer from './userReducer'
import applicationCodesetReducer from './applicationCodesetReducer'
import bootstrapModuleReducer from "./bootstrapReducer";
import organizationalUnitReducer from './organizationalUnitReducer';
import rolesReducer from './rolesReducer';
import generalUsersDashboardModuleReducer from './generalUserDashboardReducer';
import SystemInfoReducer from './SystemInfoReducer';
import menuReducer from "./menu";

export default combineReducers({
  patients: patientReducer,
  registration: registrationReducer,
  users: userReducer,
  applicationCodesets: applicationCodesetReducer,
  boostrapmodule: bootstrapModuleReducer,
  organizationalUnitReducer : organizationalUnitReducer,
  roles: rolesReducer,
  generalUsersDashboardModuleReducer : generalUsersDashboardModuleReducer,
  menu: menuReducer,
  SystemInfo: SystemInfoReducer
})

