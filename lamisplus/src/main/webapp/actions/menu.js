import axios from "axios";
import { url } from "./../api";
import * as ACTION_TYPES from "./types";
import {url as baseUrl} from "./../api";


export const fetchAll = (onSuccess , onError) => dispatch => {
    axios
      .get(`${url}modules/menus`)
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