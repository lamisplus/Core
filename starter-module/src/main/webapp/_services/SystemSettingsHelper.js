import axios from "axios";
import * as ACTION_TYPES from "../actions/types";
import {url as baseUrl, url} from "../api";
import store from '../store';


const { dispatch } = store;

export const systemSettingsHelper = {
    fetchAllSystemSettings,
    getAllSystemSettings,
    getSingleSystemSetting
};

async function fetchAllSystemSettings(){

    axios
        .get(`${baseUrl}system-settings`)
        .then((response) => {
            localStorage.setItem('system_settings', JSON.stringify(response.data));

            dispatch({
                type: ACTION_TYPES.FETCH_ALL_SYSTEM_SETTINGS,
                payload: response.data,
            });
            return response.data;
        })
        .catch((error) => {
            dispatch({
                type: ACTION_TYPES.FETCH_ALL_SYSTEM_SETTINGS,
                payload: null,
            });
            return null;
        });
}

function getAllSystemSettings() {

    const currentSystemsettings = localStorage.getItem('system_settings') != null ? JSON.parse(localStorage.getItem('system_settings')) : null;
    
    return !currentSystemsettings ? [] : currentSystemsettings;
}

function getSingleSystemSetting(key){
    const systemSettingsArray = getAllSystemSettings();
    const found = systemSettingsArray.find(setting => setting.key === key);
    return found !== null ? found : null;
}
