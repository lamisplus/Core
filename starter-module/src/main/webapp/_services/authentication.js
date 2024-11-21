import { BehaviorSubject } from 'rxjs';
import {url as baseUrl, url} from "../api";
import { handleResponse } from '../_helpers';
import store from './../store';
import * as ACTION_TYPES from "../actions/types";
import jwt_decode from "jwt-decode";
import _ from 'lodash';
import axios from "axios";
import { systemSettingsHelper } from './SystemSettingsHelper';

const { dispatch } = store;
const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

//const currentUserPermissions = localStorage.getItem('currentUser_Permission') ? new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser_Permission'))) : null;

export const authentication = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value },
    getCurrentUserPermissions: getCurrentUserPermissions,
    getCurrentUserRole: getCurrentUserRoles,
    getCurrentUser,
    userHasRole: userHasPermission,
    fetchMe
};

function login(username, password, remember) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, remember })
    };

    return fetch(`${url}authenticate`, requestOptions)
        .then(handleResponse)
        .then( async user => {
            dispatch({
                type: ACTION_TYPES.AUTHENTICATION,
                payload: "Authenticated"
            });
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // localStorage.setItem('currentUser', JSON.stringify(user));
            await saveToLocalStorage('currentUser', JSON.stringify(user));
            currentUserSubject.next(user);
            await systemSettingsHelper.fetchAllSystemSettings();
            await fetchMe();
            return user;
        });
}

async function saveToLocalStorage(key, value){
    localStorage.setItem(key, value);
}

function logout(history) {

            currentUserSubject.next(null);
            localStorage.clear();
            // you can also like localStorage.removeItem('Token');
            window.location.href = "/login";
            // console.log(history)
            // history.push('/login');
             // remove user from local storage to log user out
}

function getCurrentUserPermissions() {

    const currentUserPermissions = localStorage.getItem('currentUser_Permission') != null ? JSON.parse(localStorage.getItem('currentUser_Permission')) : null;
    if(!currentUserPermissions){
        return [];
    }
    // fetch all the permissions of the logged in user
    const permissions = currentUserPermissions;
    if(!permissions || permissions.length < 1){
        return [];
    }
    return permissions;
}

function getCurrentUserRoles() {

    const currentUserRoles = localStorage.getItem('currentUser_Role') != null ? JSON.parse(localStorage.getItem('currentUser_Role')) : null;
    if(!currentUserRoles){
        return [];
    }
    // fetch all the permissions of the logged in user
    const roles = currentUserRoles;
    if(!roles || roles.length < 1){
        return [];
    }
    return roles;
}

function userHasPermission(perm){
    const permissions = getCurrentUserPermissions();
    if(perm && perm.length > 0 && _.intersection(perm, permissions).length === 0){
        return false;
    }
    return true;
}

function getCurrentUser(){
    const user = currentUserSubject.value;
    if(!user || !user.id_token){
        return [];
    }

    const token = user.id_token;
    const decoded = jwt_decode(token);
    //console.log(decoded);
    //console.log(currentUserSubject)
    return decoded;
}

async function fetchMe(){

    await axios
        .get(`${baseUrl}account`)
        .then(async (response) => {
            const roles = JSON.stringify(response.data.roles);
            const perms = JSON.stringify(response.data.permissions);
            const userAccount = JSON.stringify(response.data);
            
            await saveToLocalStorage('currentUser_Roles', roles);
            await saveToLocalStorage('currentUser_Permission', perms);
            await saveToLocalStorage('user_account', userAccount);

            await dispatch({
                type: ACTION_TYPES.FETCH_ME,
                payload: response.data,
            });
            return response.data.permissions;
        })
        .catch((error) => {
            dispatch({
                type: ACTION_TYPES.FETCH_ME,
                payload: null,
            });
            return null;
        });
}

async function fetchModuleUpdates(){

   await axios
        .get(`${baseUrl}module-releases
        `)
        .then((response) => {
            localStorage.setItem('currentUser_Permission', JSON.stringify(response.data));

            dispatch({
                type: ACTION_TYPES.FETCH_ME,
                payload: response.data,
            });
            return response.data.permissions;
        })
        .catch((error) => {
            dispatch({
                type: ACTION_TYPES.FETCH_ME,
                payload: null,
            });
            return null;
        });
}