import axios from "axios";
import { url as baseUrl } from "../api";
import * as ACTION_TYPES from "./types";
import { toast } from "react-toastify";



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

export const fetchAllBootstrapModule = (onSuccess, onError) => dispatch => {

  axios
    .get(`${baseUrl}modules/installed`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_BOOTSTRAP_MODULE,
        payload: response.data
      })
      //console.log(response)
      onSuccess();
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_FETCH_ALL_BOOTSTRAP_MODULE,
        payload: 'Something went wrong, please try again'
      })
      onError();
      //console.log(error)
    });
};
export const fetchAllBootstrapModuleBYBatchNum = (status, batchNum,onSuccess, onError) => dispatch => {

  axios
    .get(`${baseUrl}modules/${status}/${batchNum}/`)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.FETCH_ALL_BOOTSTRAP_MODULE_BY_BATCH_NUM,
        payload: response.data
      })
      onSuccess(response.data);
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_FETCH_ALL_BOOTSTRAP_MODULE_BY_BATCH_NUM,
        payload: 'Something went wrong, please try again'
      })
      onError();
    });
};

export const installBootstrapModule = (obj, onSuccess, onError)=> dispatch => {

  if(obj){
  axios
    .post(`${baseUrl}modules/install?install=true`,obj)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.INSTALL_BOOSTRAP_MODULE_BY_ID,
        payload: response.data
      })

      onSuccess && onSuccess(response.data);
      toast.success("Module installed successfully!");
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: ACTION_TYPES.ERROR_INSTALL_BOOSTRAP_MODULE_BY_ID,
        payload: error
      })
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
    }
    );
    }
};
export const updateBootstrapModule = (obj, onSuccess, onError)=> dispatch => {

    if(obj){
        axios
            .post(`${baseUrl}modules/update`,obj)
            .then(response => {
                dispatch({
                    type: ACTION_TYPES.INSTALL_BOOSTRAP_MODULE_BY_ID,
                    payload: response.data
                })

                onSuccess && onSuccess(response.data);
                toast.success("Module Updated successfully!");
            })
            .catch(error => {
                    console.log(error)
                    dispatch({
                        type: ACTION_TYPES.ERROR_INSTALL_BOOSTRAP_MODULE_BY_ID,
                        payload: error
                    })
                onError();
                let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                toast.error(errorMessage);
                }
            );
    }
};

export const unInstallBootstrapModule = (obj, onSuccess, onError)=> dispatch => {

  axios
    .post(`${baseUrl}modules/uninstall`,obj)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.UNINSTALL_BOOSTRAP_MODULE,
        payload: response.data
      })

      onSuccess && onSuccess(response.data);
      toast.success("Module Uninstalled successfully!");
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_UNINSTALL_BOOSTRAP_MODULE,
        payload: error
      })
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
    }
    );
    
};


export const deActivateBootstrapModule = (data, onSuccess, onError)=> dispatch => {

  axios
    .post(`${baseUrl}modules/deactivate`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.DEACTIVATE_BOOSTRAP_MODULE,
        payload: response.data
      })

      onSuccess && onSuccess();
      toast.success("Module Deactivate Successfully!");
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_DEACTIVATE_BOOSTRAP_MODULE,
        payload: error
      })
      onError && onError();
      toast.error("Something went wrong!");
    }
    );
    
};

export const activateBootstrapModule = (data, onSuccess, onError)=> dispatch => {

  axios
    .post(`${baseUrl}modules/activate`, data)
    .then(response => {
      dispatch({
        type: ACTION_TYPES.ACTIVATE_BOOSTRAP_MODULE,
        payload: response.data
      })

      onSuccess && onSuccess();
      toast.success("Module Activate Successfully!");
    })
    .catch(error => {
      dispatch({
        type: ACTION_TYPES.ERROR_ACTIVATE_BOOSTRAP_MODULE,
        payload: error
      })
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
    }
    );
    
};
export const createBootstrapModule = (data) => dispatch => {

const options = {
  headers: {
      'Content-Type': ' multipart/form-data',
  }
};
  axios
  
    .post(`${baseUrl}modules/upload`, data,options)
    .then(response => {
      console.log(response)
      dispatch({
        type: ACTION_TYPES.CREATE_BOOTSTRAP_MODULE,
        payload: response.data
      });
      //onSuccess()
      toast.success("Module Uploaded Successfully");
    })
    .catch(error =>{
      
      dispatch({
        type: ACTION_TYPES.ERROR_CREATE_BOOTSTRAP_MODULE,
        payload: error
      })
      //onError()
        //onError();
        let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
        toast.error(errorMessage);
      
    });
  
};

export const startBootstrapModule = (onSuccess, onError)=> dispatch => {

  axios
    .post(`${baseUrl}modules/start/all`)
    .then(response => {
       console.log(response)
      dispatch({
        type: ACTION_TYPES.START_BOOSTRAP_MODULE,
        payload: response.data
      })

      onSuccess && onSuccess();
      toast.success("Module Restarted successfully!");
    })
    .catch(error => {
      console.log(error)
      dispatch({
        type: ACTION_TYPES.ERROR_START_BOOSTRAP_MODULE,
        payload: error
      })
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
    }
    );

};
export const getModuleMenus = (id,onSuccess, onError)=> dispatch => {
    axios
        .get(`${baseUrl}modules/${id}/menus`)
        .then(response => {
            console.log(response)
            dispatch({
                type: ACTION_TYPES.GET_MODULE_MENU,
                payload: response.data
            })
            onSuccess && onSuccess();
        })
        .catch(error => {
                console.log(error)
                dispatch({
                    type: ACTION_TYPES.ERROR_GET_MODULE_MENU,
                    payload: error
                })
                onError && onError();
                //toast.error("Something went wrong! please try again..");
            }
        );

};
export const updateModuleMenu = (id, obj, onSuccess, onError)=> dispatch => {
    axios
        .post(`${baseUrl}modules/start/all`)
        .then(response => {
            console.log(response)
            dispatch({
                type: ACTION_TYPES.UPDATE_MODULE_MENU,
                payload: response.data
            })

            onSuccess && onSuccess();
        })
        .catch(error => {
                console.log(error)
                dispatch({
                    type: ACTION_TYPES.ERROR_UPDATE_MODULE_MENU,
                    payload: error
                })
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
            }
        );

};

export const addModuleMenu = (obj, onSuccess, onError)=> dispatch => {
    axios
        .post(`${baseUrl}menus?isModule=true`, obj)
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
        .delete(`${baseUrl}menus/${id}`, )
        .then(response => {
            dispatch({
                type: ACTION_TYPES.DELETE_MODULE_MENU,
                payload: response.data
            })

            onSuccess && onSuccess();
            toast.success("Module menu deleted successfully!");
        })
        .catch(error => {
                console.log(error)
                dispatch({
                    type: ACTION_TYPES.ERROR_DELETE_MODULE_MENU,
                    payload: error
                })
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
            }
        );

};

export const editModuleMenu = (id, obj, onSuccess, onError)=> dispatch => {
    axios
        .put(`${baseUrl}menus/${id}`, obj)
        .then(response => {
            dispatch({
                type: ACTION_TYPES.EDIT_MODULE_MENU,
                payload: response.data
            })
            onSuccess && onSuccess();
            toast.success("Module menu updated successfully!");
        })
        .catch(error => {
                console.log(error)
                dispatch({
                    type: ACTION_TYPES.ERROR_EDIT_MODULE_MENU,
                    payload: error
                })
            onError();
            let errorMessage = error.response.data && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
            toast.error(errorMessage);
            }
        );

};
