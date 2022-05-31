import React, { useContext } from "react";

/// React router dom
import {  Switch, Route } from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
/// Dashboard
import Home from "./components/Dashboard/Home";
import Bootstrap from "./components/BootstrapModules/Home";
import NewBootstrapModule from "./components/BootstrapModules/NewBootstrapModule";
import UpdateModuleJar from "./components/BootstrapModules/UpdateModuleJar";
import UserList from "./components/Users/UserPage";
import userRegsitration from "./components/Users/UserRegistration";
import EditUser from "./components/Users/EditUser";
import SystemConfiguration from "./components/SystemConfiguration/Index";
import HealthCheck from "./components/HealthCheck/Index";
import ApplicationMatrics from "./components/ApplicationMatrics/Index";
import LogConfiguration from "./components/LogConfiguration/Index";
import RoleList from "./components/Roles/RolesPage";
import AddRole from "./components/Roles/AddRole";
import EditRole from "./components/Roles/EditRole";
import EditPermission from "./components/Roles/EditPermission";
import AssignFacility from "./components/Users/AssignFacility";
import Test from "./components/TestPage/Index";
import Modules from "./components/Modules/Index";
import OrganizationUnit from "./components/OrganizationUnit/Index";
import ApplicationCodeset from "./components/ApplicationCodeset/ApplicationCodesetSearch";
import ParentOrganizationUnit from "./components/OrganizationUnit/ParentOrganizationalUnit";
import { ThemeContext } from "../context/ThemeContext";

const Markup = () => {
  const { menuToggle } = useContext(ThemeContext);
  const routes = [
    /// Dashboard
    { url: "", component: Home },
    { url: "dashboard", component: Home },
    ///LamisPlus Pages
    ///Bootstrap Module
    { url: "bootstrap-modules", component: Bootstrap },
    { url: "upload-module", component: NewBootstrapModule },
    { url: "update-module", component: UpdateModuleJar },
    ///User and Role Management
    { url: "users", component: UserList },
    { url: "user-registration", component: userRegsitration },
    { url: "edit-user", component: EditUser },
    { url: "roles", component: RoleList },
    { url: "add-role", component: AddRole },
    { url: "edit-role", component: EditRole },
    { url: "edit-permission", component: EditPermission },
    { url: "assign-facility", component: AssignFacility },
      { url: "system-configuration", component: SystemConfiguration },
    { url: "health-check", component: HealthCheck },
    { url: "log-configuration", component: LogConfiguration },
    { url: "application-matrics", component: ApplicationMatrics },
    { url: "test", component: Test },
    { url: "modules", component: Modules },
    { url: "organisation-unit", component: OrganizationUnit },
    { url: "application-codeset", component: ApplicationCodeset },
    { url: "admin-parent-organization-unit", component: ParentOrganizationUnit },
  ];
  
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  let pagePath = path.split("-").includes("page");
  return (
    <>
      <div
        id={`${!pagePath ? "main-wrapper" : ""}`}
        className={`${!pagePath ? "show" : "mh100vh"}  ${
          menuToggle ? "menu-toggle" : ""
        }`}
      >
        {!pagePath && <Nav />}

        <div className={`${!pagePath ? "content-body" : ""}`} style={{paddingTop: '4rem',backgroundColor:'#f2f7f8'}}>
          <div
            className={`${!pagePath ? "container-fluid" : ""}`}
            style={{ minHeight: window.screen.height - 60, padding:'5px' }}
          >
            <Switch>
              {routes.map((data, i) => (
                <Route
                  key={i}
                  exact
                  path={`/${data.url}`}
                  component={data.component}
                />
              ))}
            </Switch>
          </div>
        </div>
        {!pagePath && <Footer />}
      </div>
      
    </>
  );
};

export default Markup;
