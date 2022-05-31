import axios from "axios";
import { url as baseUrl } from "../api";
import * as ACTION_TYPES from "./types";


/**
 * @Actions
 * CheckIn CRUD OPERATIONS
 * returns API response from server
 * =================================
 * fetchAll()
 * fetchById()
 * create()
 * update()
 * Delete()
 */

export const fetchAllRegisteredPatients = () => dispatch => {
  console.log('code get here ')
  axios
    .get(`${baseUrl}patient-dashboard/pie`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_REGISTERED_PATIENTS,
        payload: response.data
      })
      console.log(response)
      
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_FETCH_ALL_REGISTERED_PATIENTS,
        payload: 'Something went wrong, please try again'
      })
      console.log(error.response)
    });
};


