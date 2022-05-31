import axios from "axios";
import { url } from "./../api";
import * as ACTION_TYPES from "./types";
import {toast} from "react-toastify";

export const fetchApplicationCodeSet = (codesetGroup, actionType, onSuccess , onError) => dispatch => {
    console.log(actionType)
    axios
      .get(`${url}application-codesets/v2/codesetGroup?codesetGroup=${codesetGroup}`)
      .then(response => {
        dispatch({
          type: actionType,
          payload: response.data
        });
        if(onSuccess){
            onSuccess();
        }
      })
      .catch(error => {
              onError();
              let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
              toast.error(errorMessage);
      }
        
      );
  };

export const fetchAll = (onSuccess , onError) => dispatch => {
    axios
        .get(`${url}application-codesets/v2`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.APPLICATION_CODESET_LIST,
                payload: response.data
            });
            if(onSuccess){
                onSuccess();
            }
        })
        .catch(error => {
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
            }

        );
};

export const createApplicationCodeset = (data, onSuccess , onError) => dispatch => {
    axios
        .post(`${url}application-codesets/v2`, data)
        .then(response => {
            if(onSuccess){
                onSuccess();
            }
        })
        .catch(error => {
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
            }

        );
};

export const updateApplicationCodeset = (id, data, onSuccess , onError) => dispatch => {
    axios
        .put(`${url}application-codesets/v2/${id}`, data)
        .then(response => {
            if(onSuccess){
                onSuccess();
            }
        })
        .catch(error => {
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
            }

        );
};

export const deleteApplicationCodeset = (id, onSuccess , onError) => dispatch => {
    axios
        .delete(`${url}application-codesets/v2/${id}`)
        .then(response => {
            if(onSuccess){
                onSuccess();
            }
        })
        .catch(error => {
                if(onError){
                    onError();
                }
            }

        );
};

export const fetchAllWards = (onSuccess , onError) => dispatch => {
    axios
        .get(`${url}wards`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.WARD_LIST,
                payload: response.data
            });
            if(onSuccess){
                onSuccess();
            }
        })
        .catch(error => {
                if(onError){
                    onError();
                }
            }

        );
};

export const createWard = (data, onSuccess , onError) => dispatch => {
    axios
        .post(`${url}wards`, data)
        .then(response => {
            if(onSuccess){
                onSuccess();
            }
        })
        .catch(error => {
                if(onError){
                    onError();
                }
            }

        );
};

export const updateWard = (id, data, onSuccess , onError) => dispatch => {
    axios
        .put(`${url}wards/${id}`, data)
        .then(response => {
            if(onSuccess){
                onSuccess();
            }
        })
        .catch(error => {
                if(onError){
                    onError();
                }
            }

        );
};

export const deleteWard = (id, onSuccess , onError) => dispatch => {
    axios
        .delete(`${url}wards/${id}`)
        .then(response => {
            if(onSuccess){
                onSuccess();
            }
        })
        .catch(error => {
                if(onError){
                    onError();
                }
            }

        );
};