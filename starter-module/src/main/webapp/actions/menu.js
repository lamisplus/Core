import axios from "axios";
import { url } from "./../api";
import * as ACTION_TYPES from "./types";
import {url as baseUrl} from "./../api";
import {toast} from "react-toastify";


export const fetchAll = (onSuccess , onError) => dispatch => {
    axios
      .get(`${url}menus`)
      .then(response => {
          //console.log(response)
        dispatch({
          type: ACTION_TYPES.MENU_FETCH_ALL,
          payload: response.data
        });
        if(onSuccess){
            onSuccess();
        }
        return;
      })
      .catch(error => {
          if(onError){
              onError();
          }
      }
        
      );
  };
export const fetchAllMenu = (onSuccess , onError) => dispatch => {
    axios
        .get(`${url}menus?withChild=false`)
        .then(response => {
            //console.log(response)
            dispatch({
                type: ACTION_TYPES.MENU_FETCH_ALL,
                payload: response.data
            });
            if(onSuccess){
                onSuccess();
            }
            return;
        })
        .catch(error => {
                if(onError){
                    onError();
                }
            }

        );
};
export const getSubMenus = (id,onSuccess , onError) => dispatch => {
    axios
        .get(`${url}menus/parent/${id}`)
        .then(response => {
            //console.log(response)
            dispatch({
                type: ACTION_TYPES.FETCH_ALL_SUB_MENU,
                payload: response.data
            });
            if(onSuccess){
                onSuccess();
            }
            return;
        })
        .catch(error => {
                if(onError){
                    onError();
                }
            }

        );
};

//http://localhost:8282/api/menus?withChild=false
export const fetchUserPermission = (onSuccess , onError) => dispatch => {
    axios
        .get(`${url}account`)
        .then((response) => {
            localStorage.setItem('currentUser_Permission', JSON.stringify(response.data.permissions));

            dispatch({
                type: ACTION_TYPES.FETCH_PERMISSIONS,
                payload: response.data.permissions,
            });
            return response.data.permissions;
        })
        .catch((error) => {
            dispatch({
                type: ACTION_TYPES.FETCH_PERMISSIONS,
                payload: [],
            });
            return null;
        });
}

export const addMenu = (obj, onSuccess, onError)=> dispatch => {
    axios
        .post(`${baseUrl}menus?isModule=false`, obj)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.ADD_MODULE_MENU,
                payload: response.data
            })

            onSuccess && onSuccess();
            toast.success("Menu added successfully!");
        })
        .catch(error => {
                console.log(error)
                dispatch({
                    type: ACTION_TYPES.ERROR_ADD_MODULE_MENU,
                    payload: error
                })
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
            }
        );

};

export const deleteModuleMenu = (id, onSuccess, onError)=> dispatch => {
    axios
        .delete(`${baseUrl}menus/${id}`)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.DELETE_MENU,
                payload: response.data
            })
            console.log(response.data)
            onSuccess && onSuccess();
            toast.success("Menu Deleted successfully!");
        })
        .catch(error => {
                dispatch({
                    type: ACTION_TYPES.ERROR_DELETE_MENU,
                    payload: error
                })
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
            }
        );

};

