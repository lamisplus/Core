import axios from "axios";
import React, { useState, useEffect } from "react";
import MatButton from "@material-ui/core/Button";
import {

  FormGroup,
  Input,
  Label,
  FormFeedback,
} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
//import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { connect } from "react-redux";
// React Notification

import { url as baseUrl } from "./../../../api";
import { fetchRoles, deleteRole, updateRole } from "./../../../actions/role";
import useForm from "../Functions/UseForm";
import { Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
//import { FaArrowLeft } from "react-icons/fa";
import { TiArrowBack } from 'react-icons/ti'
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import PageTitle from "./../../layouts/PageTitle";



const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cardBottom: {
    marginBottom: 20,
  },
  Select: {
    height: 45,
    width: 300,
  },
  button: {
    margin: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.default,
  },
  inline: {
    display: "inline",
  },
}));

let currentUser = {};

const RoleList = (props) => {
  const UserDetails= props.location && props.location.state.row ? props.location.state.row : {}
  const userId = UserDetails && UserDetails.id !==null ? UserDetails.id : "" ;
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [assignFacilityModal, setAssignFacilityModal] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setselectedRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [basicModal, setBasicModal] = useState(false);
  let { values, setValues, handleInputChange, resetForm } = useForm({});

  useEffect(() => {
    const onSuccess = () => {
      setLoading(false);
    };
    const onError = () => {
      setLoading(false);
    };
    props.fetchAllUsers(onSuccess, onError);
    defaultUserRole()
  }, []);

  /* Get list of Roles from the server */
  useEffect(() => {
    async function getCharacters() {
      axios
        .get(`${baseUrl}roles`)
        .then((response) => {
          setRoles(
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

  const onRoleSelect = (selectedValues) => {
    setselectedRoles(selectedValues);
  };

  const toggleAssignModal = (user) => {
    console.log(user);
    currentUser = user;
    setAssignFacilityModal(!assignFacilityModal);
    console.log(assignFacilityModal);
  
  }

  const toggleEditRoles = () => {
    props.history.push('/users')
  };

  const defaultUserRole = () => {
    axios
      .get(`${baseUrl}users/${userId}`)
      .then((response) => {
        setselectedRoles(
          Object.entries(response.data.roles).map(
            ([key, value]) => value
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });

};

  const handleEdit = (e) => {
    e.preventDefault();
    let roles = [];
    selectedRoles.map((p) => {
      const role = { name: null };
      role.name = p;
      roles.push(role);
    });
    values = roles;
    setSaving(true);
    const onSuccess = () => {
      setSaving(false);
      toast.success("User roles Updated Successfully");
      resetForm();
      props.history.push('/users')
    };
    const onError = () => {
      setSaving(false);
      toast.error("Something went wrong");
    };
    props.updateUserRole(userId, values, onSuccess, onError);
  };



  return (
    <>
        <PageTitle activeMenu="Edit Permission" motherMenu="Permission" />
        <Link
              to ={{
                pathname: "/roles",
                state: 'users'
              }}
        >
          <Button
            variant="contained"
            color="primary"
            className=" float-end ms-1"
            startIcon={<TiArrowBack />}
          >
            <span style={{ textTransform: "capitalize" }}>Back </span>
          </Button>
        </Link>
        <br />
      
      <br />
      <ToastContainer autoClose={3000} hideProgressBar />
      
     <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Permissions</h4>
            </div>
            <div className="card-body">
              <div className="basic-form">
                <form onSubmit={handleEdit}>
                  <div className="row">
                    <div className="form-group mb-12 col-md-12">
                        <FormGroup>
                                <Label for="roles">Roles</Label>
                                <DualListBox
                                    canFilter
                                options={roles}
                                onChange={onRoleSelect}
                                selected={selectedRoles}
                                />
                          </FormGroup>
                    </div>

                  </div>

                  {saving ? <Spinner /> : ""}
                    <br />
                    <MatButton
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            startIcon={<SaveIcon />}
                            disabled={saving}
                            
                          >
                            {!saving ? (
                              <span style={{ textTransform: "capitalize" }}>
                                Save
                              </span>
                            ) : (
                              <span style={{ textTransform: "capitalize" }}>
                                Saving...
                              </span>
                            )}
                          </MatButton>
                          <MatButton
                            variant="contained"
                            className={classes.button}
                            startIcon={<CancelIcon />}
                            onClick={toggleEditRoles}
                          >
                            <span style={{ textTransform: "capitalize" }}>
                              Cancel
                            </span>
                          </MatButton>
                        </form>
                    </div>
                    </div>
                    
          </div>
        </div>
    </>
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