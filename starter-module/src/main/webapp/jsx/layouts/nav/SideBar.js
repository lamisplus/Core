/// Menu
import Metismenu from "metismenujs";
import React, { Component, useContext, useEffect, useState } from "react";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
/// Link
import { Link } from "react-router-dom";
import useScrollPosition from "use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import {fetchAll, fetchUserPermission} from "./../../../actions/menu";
import {connect} from "react-redux";
import _ from "lodash";
import LoadMenus from './../../components/Functions/LoadMenu'

// Image
//import profile from "../../../images/profile/pic1.jpg";

class MM extends Component {
  componentDidMount() {
    this.$el = this.el;
    this.mm = new Metismenu(this.$el);
  }
  componentWillUnmount() {
  }
  render() {
    return (
      <div className="mm-wrapper">
        <ul className="metismenu" ref={(el) => (this.el = el)}>
          {this.props.children}
        </ul>
      </div>
    );
  }
}

const SideBar = (props) => {
  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
  } = useContext(ThemeContext);

//const {menuItems,fetchExternalMenu2} = LoadMenus()

  useEffect(() => {
    var btn = document.querySelector(".nav-control");
    var aaa = document.querySelector("#main-wrapper");
    function toggleFunc() {
      return aaa.classList.toggle("menu-toggle");
    }
    btn.addEventListener("click", toggleFunc);
    fetchExternalMenu()
    fetchPermisisons()
  }, []);
  let scrollPosition = useScrollPosition();

  function userHasRole(role){
    const userRoles = props.permissions;
    if(role && role.length > 0 && _.intersection(role, userRoles).length === 0){
      return false;
    }
    return true;
  }
  const fetchExternalMenu = () => {
    const onSuccess = () => {
    }
    const onError = () => {
    }
    props.fetchAllExternalModulesMenu(onSuccess, onError);
  };

  const fetchPermisisons = () => {
    const onSuccess = () => {
    }
    const onError = () => {
    }
    props.fetchUserPermission(onSuccess, onError);
  };

  /// Path
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];
  ///Admin Roles
  let roles =["admin_read"]
  /// Active menu
  let deshBoard = ["dashboard"],
    
    admin = [
      "users",
      "roles",
      "bootstrap-modules",
      "application-codeset",
      "organisation-unit",
      "application-matrics",
      "log-configuration",
      "health-checks",
      "system-configuration",
     
    ],
    sysInfo = ["application-matrics", "log-configuration", "health-checks", "system-configuration"];

    
    
  return (
    <div
      className={`deznav ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? scrollPosition > 120
            ? "fixed"
            : ""
          : ""
      }`}
      style={{top:'52px'}}
    >
      <PerfectScrollbar className="deznav-scroll" style={{paddingTop:'20px'}}>
        <MM className="metismenu" id="menu" style={{fontSize:'10px'}}>
        <li className={`${deshBoard.includes(path) ? "mm-active" : ""}`} style={{color:'#798087',padding:'2px'}}>
            <Link to="dashboard" style={{color:'#798087',padding:'5px', backgroundColor:'white'}} >
            <i className="flaticon-025-dashboard" style={{color:'#24a4eb'}}/>
            <span className="nav-text" style={{color:'#24a4eb'}}>Dashboard</span>
            </Link>
        </li>
        {props.menuList && props.menuList.map(({ url, name }, index) => (
              <>
              
              <li className={`${deshBoard.includes(path) ? "mm-active" : ""}`} style={{color:'#798087',padding:'2px'}}>
                  <Link 
                  
                  to ={{
                    pathname: `modules`,
                    state: url
                  }} 
                  style={{color:'#798087',padding:'5px', backgroundColor:'white'}} >
                  <i className="flaticon-025-dashboard" style={{color:'#24a4eb'}}/>
                  <span className="nav-text" style={{color:'#24a4eb'}}>{name}</span>
                  </Link>
              </li>
              </>
            ))
          }
          {/* <span className="nav-text" style={{color:'#303f9f',fontWeight:'bolder',paddingTop:'15px',paddingBottom:'5px',paddingLeft:'20px'}}>Administration</span> */}
          {/*{!userHasRole(roles) ?*/}
          {/*    <></>*/}
          {/*    :*/}

              <li className={`${admin.includes(path) ? "mm-active" : ""}`} style={{color: '#798087', padding: '2px'}}
                  show={"false"}>
                <Link className="has-arrow ai-icon" to="#"
                      style={{color: '#798087', padding: '1px', backgroundColor: 'white'}}>
                  <i className="flaticon-013-checkmark" style={{color: '#24a4eb'}}/>
                  <span className="nav-text" style={{color: '#24a4eb'}}>Administration</span>
                </Link>
                <ul>
                  <li>
                    <Link style={{color: '#798087'}} className={`${path === "users" ? "mm-active" : ""}`} to="/users">User
                      Management</Link>
                  </li>
                  <li>
                    <Link
                        style={{color: '#798087'}}
                        className={`${
                            path === "bootstrap-modules" ? "mm-active" : ""
                        }`}
                        to="/bootstrap-modules"
                    >
                      Install Module
                    </Link>
                  </li>

                  <li>
                    <Link style={{color: '#798087'}} className={`${path === "roles" ? "mm-active" : ""}`} to="/roles">Roles
                      & Privileges</Link>
                  </li>

                  <li>
                    <Link style={{color: '#798087'}} className={`${path === "organisation-unit" ? "mm-active" : ""}`}
                          to="/organisation-unit">Organisation Unit</Link>
                  </li>
                  <li>
                    <Link style={{color: '#798087'}} className={`${path === "application-codeset" ? "mm-active" : ""}`}
                          to="/application-codeset">Application Codeset</Link>
                  </li>
                  <li className={`${sysInfo.includes(path) ? "mm-active" : ""}`}><Link className="has-arrow" to="#">System
                    Information</Link>
                    <ul className={`${sysInfo.includes(path) ? "mm-show" : ""}  list-icons`}>
                      <li className="ms-2 ">
                        <Link style={{color: '#798087'}}
                              className={`${path === "system-configuration" ? "mm-active" : ""}`}
                              to="/system-configuration">
                              <span className="align-middle me-1">
                                <i className="ti-angle-right"></i>
                              </span>{" "}System Configuration
                        </Link>
                      </li>
                      <li className="ms-2">
                        <Link style={{color: '#798087'}} className={`${path === "health-checks" ? "mm-active" : ""}`}
                              to="/health-check">
                            <span className="align-middle me-1">
                                <i className="ti-angle-right"></i>
                              </span>{" "}Health Checks
                        </Link>
                      </li>
                      <li className="ms-2">
                        <Link style={{color: '#798087'}}
                              className={`${path === "application-matrics" ? "mm-active" : ""}`}
                              to="/application-matrics">
                              <span className="align-middle me-1">
                                <i className="ti-angle-right"></i>
                              </span>{" "}Application matrics
                        </Link>
                      </li>
                      <li className="ms-2">
                        <Link style={{color: '#798087'}}
                              className={`${path === "log-configuration" ? "mm-active" : ""}`} to="/log-configuration">
                            <span className="align-middle me-1">
                              <i className="ti-angle-right"></i>
                            </span>{" "}Log Configurations
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {/* <li>
                      <Link style={{color:'#798087'}} className={`${path === "test" ? "mm-active" : ""}`} to="/test">Test Page </Link>
                    </li> */}
                </ul>
              </li>


          {/*}*/}
        </MM>


      </PerfectScrollbar>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    menuList: state.menu.list,
    permissions: state.menu.permissions,
  };
};

const mapActionToProps = {
  fetchAllExternalModulesMenu: fetchAll,
  fetchUserPermission: fetchUserPermission
};

export default connect(mapStateToProps, mapActionToProps)(SideBar);
