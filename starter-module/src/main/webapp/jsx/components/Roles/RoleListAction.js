import axios from "axios";
import { url as baseUrl } from "./../../../api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "@reach/menu-button/styles.css";

import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { fetchRoles, deleteRole, updateRole } from "./../../../actions/role";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";






const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

const RoleList = (props) => {

const classes = useStyles();
const onDelete = (id) => {
    if (window.confirm(`Are you sure to delete this role? ${id}`))
      props.deleteRole(id);
      window.location.href = "/roles";
      props.history.push('/roles')
  };

  return (
    <div>
              <Dropdown className="dropdown text-sans-serif">
                      <Dropdown.Toggle
                          variant=" light"
                          className="btn-info i-false p-0 sharp"
                        >
                          <svg
                            width="18px"
                            height="18px"
                            viewBox="0 0 24 24"
                            version="1.1"
                          >
                            <g
                              stroke="none"
                              strokeWidth="1"
                              fill="none"
                              fillRule="evenodd"
                            >
                              <rect x="0" y="0" width="24" height="24" />
                              <circle fill="#000000" cx="5" cy="12" r="2" />
                              <circle fill="#000000" cx="12" cy="12" r="2" />
                              <circle fill="#000000" cx="19" cy="12" r="2" />
                            </g>
                          </svg>
                        </Dropdown.Toggle>
                    <Dropdown.Menu
                    className="dropdown-menu dropdown-menu-right border py-0"
                    aria-labelledby="order-dropdown-0"
                    >
                    <div className="py-2">
                      <Link
                          className="dropdown-item"
                          to={{pathname: "/edit-role", state: { row: props.row  }}}
                        >
                          <span className="me-2">
                            <i className="fa fa-pencil " aria-hidden="true"> </i>
                          </span>
                                Edit Role
                        </Link>
                        <div className="dropdown-divider" />
                        {/* <Link
                          className="dropdown-item"
                          to={{pathname: "/edit-permission", state: { row: props.row  }}}
                        >
                          <span className="me-2">
                            <i className="fa fa-pencil " aria-hidden="true"> </i>
                          </span>
                          Edit Permissions
                        </Link>
                        <div className="dropdown-divider" /> */}
                        <Link
                          className="dropdown-item"
                          onClick={() => onDelete(props.row.id)}
                        >
                          <span className="me-2">
                            <i className="fa fa-trash " aria-hidden="true"> </i>
                          </span>
                          Delete Role
                        </Link>
                    
                    </div>
                    </Dropdown.Menu>
                </Dropdown>

        </div>
  );
};

const mapStateToProps = (state) => {
    return {
      rolesList: state.roles.list,
    };
  };
  
  const mapActionToProps = {
    fetchAllRoles: fetchRoles,
    deleteRole: deleteRole,
    updateRole: updateRole
  };
  
  export default connect(mapStateToProps, mapActionToProps)(RoleList);
  