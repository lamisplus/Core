/// Menu
import Metismenu from "metismenujs";
import React, { Component, useContext, useEffect, useState } from "react";
/// Scroll
import PerfectScrollbar from "react-perfect-scrollbar";
/// Link
import { Link } from "react-router-dom";
import useScrollPosition from "use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import {fetchAllMenu, fetchUserPermission} from "./../../../actions/menu";
import {connect} from "react-redux";
import _ from "lodash";
import LoadMenus from './../../components/Functions/LoadMenu'
import { fontSize } from "@mui/system";

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
  }, []);//props.menuList to continuous checking for menu list
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
  //console.log(props.menuList)
  //method to determain main sidebar menu
  function sideBarParentUrl(menu){

      // if(subMenu.url){
        
      // }
          //menu.moduleId===null || menu.url!==null? menu.url : "modules", state: menu.url
          if(menu.moduleId===null && menu.url===null){
            return ""
          }else if(menu.moduleId===null && menu.url!==null){
            return menu.url
          }else if(menu.moduleId!==null || menu.url!==null){
            return ` "modules",  state: menu.url`
          }
  }
  /// Active menu
  let deshBoard = [],
    subMainMenu = [],
    sysInfo = ["application-matrics", "log-configuration", "health-checks", "system-configuration"];
    const MainMenu= props.menuList.map(item => {
        deshBoard.push(item.name)
        return item;
    })
    // console.log(props.menuList)
    // console.log(deshBoard)
    console.log(_.sortBy(props.menuList, ["id", "position"]))
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


          {props.menuList && props.menuList.map((menu, index) => (

              <>
                  <li className={`${deshBoard.includes(path) ? "mm-active" : ""}`} style={{color: '#798087', padding: '2px'}}
                      show={"false"}>
                    <Link className={menu.subs && menu.subs.length>0 ?"has-arrow ai-icon":""}  
                    to={{ pathname: menu.moduleId===null ? (menu.url!==null?menu.url:"" ): "modules", state: menu.url}}

                          style={{color: '#798087', padding: '1px', backgroundColor: 'white'}}>
                      <i className={menu.icon!==null && menu.icon!=="wc"? menu.icon : "flaticon-087-stop"} style={{color: '#24a4eb'}} size="xs"/>
                      <span className="nav-text" style={{color: '#24a4eb'}}>{menu.name}</span>
                    </Link>
                    {menu.subs.length>0 ?
                        _.sortBy(menu.subs, ["parentId", "position"]).map((subMenu, index) => (
                            <>
                              <ul style={{padding: "0.1rem 0 !important"}}>
                                <li   style={{ marginLeft:"-15px", marginTop:"-12px",  marginBottom:"-12px"}}>
                                  <Link                      
                                      to={{ pathname:  !subMenu.moduleId ? subMenu.url: "modules", state: subMenu.url}}
                                  >
                                    <span style={{fontSize:'13px'}} >{subMenu.name} </span>
                                  </Link>
                                  {subMenu.subs && subMenu.subs.length > 0 ?
                                      subMenu.subs.map((subSubMenu, index) => (
                                        <>
                                          <li className="">
                                            <Link style={{color: '#798087'}}
                                                  className={`${path === "system-information" ? "mm-active" : ""}`} to={!subSubMenu.moduleId || subSubMenu.moduleId===null? subSubMenu.url : "modules" }>
                                                      <span className="align-middle me-1" style={{fontSize:'14px !important'}} >
                                                        <i className="ti-angle-right " size="xs"></i>
                                                      </span>{" "}<span style={{fontSize:'12px'}} >{subSubMenu.name}</span>
                                            </Link>
                                          </li>
                                        </>
                                      ))
                                    :
                                      ""
                                  }
                                </li>
                              </ul>

                            </>
                        ))
                    :
                        ""

                    }

                  </li>
              </>
              ))}

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
  fetchAllExternalModulesMenu: fetchAllMenu,
  fetchUserPermission: fetchUserPermission
};

export default connect(mapStateToProps, mapActionToProps)(SideBar);
