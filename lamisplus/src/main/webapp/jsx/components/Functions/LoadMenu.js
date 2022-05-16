import { useState, useEffect  } from 'react'
//import useFunctions from './../../components/Functions/LoadMenu'
import {fetchAll, fetchUserPermission} from "../../../actions/menu";
import {connect} from "react-redux";

const LoadMenus = (props) => {


    useEffect(() => {
        fetchExternalMenu2()
        }, [])

        const fetchExternalMenu2 = () => {
            const onSuccess = () => {
            }
            const onError = () => {
            }
            props.fetchAllExternalModulesMenu(onSuccess, onError);
        };

    const menuItems = props.menuList;

    return {
        fetchExternalMenu2,
        menuItems
    }


}

const mapStateToProps = (state, ownProps) => {
    return {
        menuList: state.menu.list
    };
};

const mapActionToProps = {
    fetchAllExternalModulesMenu: fetchAll
};

export  default connect(mapStateToProps, mapActionToProps)(LoadMenus);

