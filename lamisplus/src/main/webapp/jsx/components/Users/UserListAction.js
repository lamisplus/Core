import React, {  useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { connect } from "react-redux";
import {  deleteUser } from "./../../../actions/user";
import "./UserList.css";
import axios from "axios";
import { url as baseUrl } from "./../../../api";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import AssignFacilityModal from "./AssignFacilityModal";
//import {  Button, Modal} from "react-bootstrap";




let userId = 0;
let currentUser = {};

const UserListAction = (props) => {
  const [role, setRole] = useState([]);
  const [basicModal, setBasicModal] = useState(false);
  const [assignFacilityModal, setAssignFacilityModal] = useState(false);
  /* Get list of Role parameter from the endpoint */
  useEffect(() => {
    async function getCharacters() {
      axios
        .get(`${baseUrl}roles`)
        .then((response) => {
          
          setRole(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.name,
              value: value.name,
            }))
          );
        
        
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getCharacters();
  }, []);
  
  const onDelete = (id) => {
    if (window.confirm(`Are you sure to delete this role? ${id}`)){
    props.deleteUser(id);  
    window.location.href = "/users";
    //props.history.push("/users")  
    }
    ///
      
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
                              {/* <Link
                                className="dropdown-item"
                                
                                to={{pathname: "/edit-role", state: { row: props.row  }}}
                              >
                                <span className="me-2">
                                 <i className="fa fa-pencil " aria-hidden="true"> </i>
                                </span>
                                 Edit User Role
                                 
                              </Link> */}
                              <div className="dropdown-divider" />
                              <Link
                                className="dropdown-item"
                                to={{pathname: "/edit-user", state: { user: props.row, defRole: role  }}}
                              >
                                <i className="fa fa-user" />  Edit User
                              </Link>
							              <div className="dropdown-divider" />
                              <Link
                                className="dropdown-item"
                                onClick={() => onDelete(props.row.id)}
                                
                              >
                                 <span className="me-2">
                                  <i className="fa fa-times" aria-hidden="true"></i>
                                </span>
                                Deactivate User
                              </Link>
                              
                              <div className="dropdown-divider" />
                              {/* <Link
                                className="dropdown-item"
                                to={{pathname: "/assign-facility", state: { user: props.row  }}}
                              >
                                 <i className="fa fa-send" /> Assign User Facility
                              </Link> */}
                            </div>
                            
                          </Dropdown.Menu>
              </Dropdown>
               
      <AssignFacilityModal
          showModal={assignFacilityModal} toggleModal={() => setAssignFacilityModal(!assignFacilityModal)} user={currentUser}/>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    usersList: state.users.list,
    //usersList: [],
  };
};

const mapActionToProps = {
  deleteUser: deleteUser,
};

export default connect(mapStateToProps, mapActionToProps)(UserListAction);
