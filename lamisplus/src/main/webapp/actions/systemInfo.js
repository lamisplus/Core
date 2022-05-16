import axios from "axios";
import { url as baseUrl } from "../api";
import * as ACTION_TYPES from "./types";


/**
 * @Actions



 */
export const env = ( onSuccess, onError) => (dispatch) => {
  axios
    .get(`${baseUrl}management/env`)
    .then((response) => {
      
        dispatch({
          type: ACTION_TYPES.FETCH_ENV,
          payload: response.data,
        });
        onSuccess();
    
    })
    .catch((error) => {
      console.log(error)
      dispatch({
        type: ACTION_TYPES.FETCH_ENV_ERROR,
        payload: "Something went wrong, please try again",
      });
      onError();
    });
};

export const metrics = ( onSuccess, onError) => (dispatch) => {
    axios
      .get(`${baseUrl}management/metrics`)
      .then((response) => {
        
          dispatch({
            type: ACTION_TYPES.FETCH_MATRICS,
            payload: response.data,
          });
          onSuccess && onSuccess();
      
      })
      .catch((error) => {
        dispatch({
          type: ACTION_TYPES.FETCH_MATRICS_ERROR,
          payload: "Something went wrong, please try again",
        });
        onError();
      });
  };
  export const loggers = ( onSuccess, onError) => (dispatch) => {
    axios
      .get(`${baseUrl}management/loggers`)
      .then((response) => {
        
          dispatch({
            type: ACTION_TYPES.FETCH_LOGGER,
            payload: response.data,
          });
          onSuccess && onSuccess();
      
      })
      .catch((error) => {
        dispatch({
          type: ACTION_TYPES.FETCH_LOGGER_ERROR,
          payload: "Something went wrong, please try again",
        });
        onError();
      });
  };
  export const health = ( onSuccess, onError) => (dispatch) => {
    axios
      .get(`${baseUrl}management/health`)
      .then((response) => {
        
          dispatch({
            type: ACTION_TYPES.FETCH_HEALTH,
            payload: response.data,
          });
          onSuccess && onSuccess();
      
      })
      .catch((error) => {
        dispatch({
          type: ACTION_TYPES.FETCH_HEALTH_ERROR,
          payload: "Something went wrong, please try again",
        });
        onError();
      });
  };