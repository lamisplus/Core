import React, { useContext, useEffect, useState } from "react";

/// React router dom
import { Switch, Route } from "react-router-dom";

/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";
/// Dashboard
import LoginPage from "./pages/LoginPage";
import Home from "./components/Dashboard/Home";
import Bootstrap from "./components/BootstrapModules/Home";
import NewBootstrapModule from "./components/BootstrapModules/NewBootstrapModule";
import ModuleMenu from "./components/BootstrapModules/ModuleMenu";
import UpdateModuleJar from "./components/BootstrapModules/UpdateModuleJar";
import UserList from "./components/Users/UserPage";
import userRegsitration from "./components/Users/UserRegistration";
import userAccount from "./components/Users/UserAccount";
import EditUser from "./components/Users/EditUser";
import SystemConfiguration from "./components/SystemConfiguration/Index";
import HealthCheck from "./components/HealthCheck/Index";
import ApplicationMatrics from "./components/ApplicationMatrics/Index";
import LogConfiguration from "./components/LogConfiguration/Index";
import ModuleUpdateList from "./components/LamisplusModuleUpdates/ModuleUpdatePage";
import RoleList from "./components/Roles/RolesPage";
import AddRole from "./components/Roles/AddRole";
import EditRole from "./components/Roles/EditRole";
import EditPermission from "./components/Roles/EditPermission";
import AssignFacility from "./components/Users/AssignFacility";
import Test from "./components/TestPage/Index";
import Modules from "./components/Modules/Index";
import OrganizationUnit from "./components/OrganizationUnit/Index";
import ApplicationCodeset from "./components/ApplicationCodeset/ApplicationCodesetSearch";
import ModuleUpdate from "./components/ModuleUpdates/ModuleUpdate";
import ParentOrganizationUnit from "./components/OrganizationUnit/ParentOrganizationalUnit";
import MenuList from "./components/Menu/MenuList";
import BiometricList from "./components/Biometric/BiometricList";

import SubMenuList from "./components/Menu/SubMenuList";
import { ThemeContext } from "../context/ThemeContext";
import { authentication } from "../_services/authentication";
import axios from "axios";
import { url as baseUrl } from "../api";
import * as ACTION_TYPES from "../actions/types";
import ErrorMissingOrganisation from "./pages/ErrorMissingOrganisation";
import FacilitiesList from "./components/FaciltyConfig/FacilitiesPage";
import AddFacility from "./components/FaciltyConfig/AddFacility";
import FacilitySetup from "./pages/FacilitySetup";
import WebLog from "./components/weblog/WebLog";

const Markup = () => {
  const [user, setUser] = useState(null);
  const { menuToggle } = useContext(ThemeContext);
  const [appConfig, setAppConfig] = useState(null);
  const routes = [
    /// Dashboard
    { url: "", component: Home },
    { url: "dashboard", component: Home },
    ///LamisPlus Pages
    ///Bootstrap Module
    { url: "bootstrap-modules", component: Bootstrap },
    { url: "upload-module", component: NewBootstrapModule },
    { url: "update-module", component: UpdateModuleJar },
    { url: "module-menu", component: ModuleMenu },
    { url: "submenu", component: SubMenuList },

    ///User and Role Management
    { url: "users", component: UserList },
    { url: "user-registration", component: userRegsitration },
    { url: "account", component: userAccount },
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
    { url: "module-update", component: ModuleUpdate },
    { url: "lamisplus-module-update", component: ModuleUpdateList },
    {
      url: "admin-parent-organization-unit",
      component: ParentOrganizationUnit,
    },
    { url: "menu", component: MenuList },
    { url: "biometrics", component: BiometricList },
    { url: "facility", component: FacilitiesList },
    { url: "facility-config", component: AddFacility },
    { url: "weblog", component: WebLog },
  ];
  let path = window.location.pathname;
  path = path.split("/");
  path = path[path.length - 1];

  let pagePath = path.split("-").includes("page");

  async function fetchMe() {
    if (authentication.currentUserValue != null) {
      axios
        .get(`${baseUrl}account`)
        .then((response) => {
          setUser(response.data);
          console.log(response.data);
        })
        .catch((error) => {
          authentication.logout();
          // console.log(error);
        });
    }
  }
  async function configApp() {
    if (authentication.currentUserValue != null) {
      axios
        .get(`${baseUrl}users/configure/app`)
        .then((response) => {
          setAppConfig(response.data);
        })
        .catch((error) => {
          //authentication.logout();
          // console.log(error);
        });
    }
  }

  useEffect(() => {
    fetchMe();
    configApp();
  }, []);

  return (
    <>
      {/*{appConfig !== true ? (*/}
      {/*    <>*/}
      {user !== null ? (
        <>
          {user && user.currentOrganisationUnitId !== null ? (
            <>
              <div
                id={`${!pagePath ? "main-wrapper" : ""}`}
                className={`${!pagePath ? "show" : "mh100vh"}  ${
                  menuToggle ? "menu-toggle" : ""
                }`}
              >
                {!pagePath && <Nav />}

                <div
                  className={`${!pagePath ? "content-body" : ""}`}
                  style={{ paddingTop: "4rem", backgroundColor: "#f2f7f8" }}
                >
                  <div
                    className={`${!pagePath ? "container-fluid" : ""}`}
                    style={{
                      minHeight: window.screen.height - 260,
                      padding: "1px",
                    }}
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
          ) : (
            <>
              <FacilitySetup user={user} />
            </>
          )}
        </>
      ) : (
        <ErrorMissingOrganisation />
      )}
    </>
  );
};

export default Markup;
