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

          <li className={`${deshBoard.includes(path) ? "mm-active" : ""}`}>
            <Link className="has-arrow ai-icon" to="#" >
              <i className="flaticon-025-dashboard"></i>
              <span className="nav-text">Dashboard</span>
            </Link>
            <ul >
              <li><Link className={`${path === "" ? "mm-active" : "dashboard"}`} to="/dashboard"> Dashboard Light</Link></li>
              <li><Link className={`${path === "dashboard-dark" ? "mm-active" : ""}`} to="/dashboard-dark"> Dashboard Dark</Link></li>
              <li><Link className={`${path === "order-list" ? "mm-active" : ""}`} to="/order-list">Orders List</Link></li>
              <li><Link className={`${path === "event" ? "mm-active" : ""}`} to="/event">Event</Link></li>
              <li><Link className={`${path === "customer" ? "mm-active" : ""}`} to="/customer">Customers</Link></li>
              <li><Link className={`${path === "analytics" ? "mm-active" : ""}`} to="/analytics">Analytics</Link></li>
              <li><Link className={`${path === "reviews" ? "mm-active" : ""}`} to="/reviews">Reviews</Link></li>
              <li><Link className={`${path === "task" ? "mm-active" : ""}`} to="/task">Task</Link></li>
            </ul>
          </li>
          {props.menuList && props.menuList.map((menu, index) => (

              <>
                  <li className={`${deshBoard.includes(path) ? "mm-active" : ""}`} style={{color: '#798087', padding: '5px'}}
                      show={"false"}>
                    <Link className={menu.subs && menu.subs.length>0 ?"has-arrow ai-icon":""}
                    to={{ pathname: menu.moduleId===null ? (menu.url!==null?menu.url:"" ): "modules", state: menu.url}}

                          style={{color: '#526785', padding: '1px',paddingBottom:'1px', backgroundColor: 'white'}}>
                      <i className={menu.icon!==null && menu.icon!=="wc"? menu.icon : "flaticon-087-stop"} style={{color: '#27ABF4'}} size="xs"/>
                      <span className="nav-text" style={{color: 'rgb(4, 196, 217)',fontWeight:'600'}}>{menu.name}</span>
                    </Link>
                    {menu.subs.length>0 ?
                        _.sortBy(menu.subs, ["parentId", "position"]).map((subMenu, index) => (
                            <>
                              <ul className="mm-collapse" style={{padding: "0.1rem 0 !important"}}>
                                <ul  style={{ marginLeft:"-15px", marginTop:"-22px",  marginBottom:"-12px"}}>
                                  <Link
                                      to={{ pathname:  !subMenu.moduleId ? subMenu.url: "modules", state: subMenu.url}}
                                  >
                                    <div>
                                      <i className="fa-solid fa-ellipsis" style={{color: 'rgb(4, 196, 217)'}} />{" "} {" "}
                                      <span style={{fontSize:'14px',color:"#526785"}} >{subMenu.name} </span>{" "}
                                      <span className="align-middle me-1" style={{fontSize:'14px !important'}} >
                                        {subMenu.subs && subMenu.subs.length > 0 &&(
                                            <i className="fa-solid fa-angle-right fa-sm" size="20" style={{float:"right",marginTop:'5%'}}></i>
                                        )}

                                    </span>
                                    </div>

                                  </Link>
                                  {subMenu.subs && subMenu.subs.length > 0 ?
                                      subMenu.subs.map((subSubMenu, index) => (
                                        <>
                                          <ul className="mm-collapse" style={{ marginTop:"-18px",  marginBottom:"-22px", marginLeft:'10px'}}>
                                            <Link style={{color: '#798087'}}
                                                  className={`${path === "system-information" ? "mm-collapse" : ""}`} to={!subSubMenu.moduleId || subSubMenu.moduleId===null? subSubMenu.url : "modules" }>
                                                      <span className="align-middle me-1" style={{fontSize:'14px !important'}} >
                                                        <i className="fa-solid fa-arrow-right fa-2xs" size="20"></i>
                                                      </span>{" "}<span style={{fontSize:'13px'}} >{subSubMenu.name}</span>
                                            </Link>
                                          </ul>
                                        </>
                                      ))
                                    :
                                      ""
                                  }
                                </ul>
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
