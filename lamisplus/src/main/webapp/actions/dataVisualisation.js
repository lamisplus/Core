/*
import axios from "axios";
import {url} from "../api";
import * as ACTION_TYPES from "./types";
import {toast} from "react-toastify"

/!**
 * ===============================================================================
 * @Actions
 * Encounter CRUD OPERATIONS
 * returns API response from server => payload: response || error
 * @method GET => fetchPrescriptions() -> get all encounters: params {null} || query {dateStart}{dateEnd}
 *@method GET => fetchPatientPrescriptions() -> get all prescriptions for a patient: params {patientId} || query {}
 *================================================================================
 *!/

export const createChart = () => dispatch => {
  axios
    .post(
      `${url}encounters/4ab293ff-6837-41e8-aa85-14f25ce59ef0/{dateStart}/{dateEnd}`
    )
    .then((response) => {
      console.log(response)
      dispatch({
        type: ACTION_TYPES.CREATE_CHART,
        payload: response.data,
      });
    })
    .catch((error) => {
      dispatch({
        type: ACTION_TYPES.CREATE_CHART_ERROR,
        payload: "Something went wrong",
      });
    });
};

export const fetchChartsById = (patientId) => dispatch => {
  console.log(patientId)
  axios
    .get(
      `${url}patients/${patientId}/encounters/4ab293ff-6837-41e8-aa85-14f25ce59ef0/{dateStart}/{dateEnd}`
    )
    .then((response) => {
      dispatch({
        type: ACTION_TYPES.FETCH_CHART_BY_ID,
        payload: response.data,
      });
    })
    .catch((error) => {
      console.log("Pharmacy Error: ", error);
      dispatch({
        type: ACTION_TYPES.FETCH_CHART_BY_ID_ERROR,
        payload: "Something went wrong",
      });
    });

}

export const deleteChartById = (onSuccess, onError) => dispatch => {
  axios
      .put(`${url}drugs/`)
      .then(response => {
        dispatch({
          type: ACTION_TYPES.DELETE_CHART_BY_ID,
          payload: response.data
        })
        onSuccess()
      })
      .catch(error => {
        dispatch({
          type: ACTION_TYPES.DELETE_CHART_BY_ID_ERROR,
          payload: 'Something went wrong, please try again'
        })
        onError(error.response)
      })
}
*/
