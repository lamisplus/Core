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
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { connect } from "react-redux";
// React Notification

import { register, update } from "./../../../actions/user";
import { url as baseUrl } from "./../../../api";
import { initialfieldState_userRegistration } from "./../../../_helpers/initialFieldState_UserRegistration";
import useForm from "../Functions/UseForm";
import { Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
//import { FaArrowLeft } from "react-icons/fa";
import { TiArrowBack } from 'react-icons/ti'
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import PageTitle from "./../../layouts/PageTitle";
import Select from "react-select";

Moment.locale("en");
momentLocalizer();


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
//let  arrVal = [];

const UserRegistration = (props) => {
   //
  const userDetail = props.location && props.location.state ? props.location.state.user : null;
  //const rolesDef = props.location && props.location.state ? props.location.state.defRole : null;
  const classes = useStyles();
  const { values, setValues, handleInputChange, resetForm } = useForm(
    props.location && props.location.state ? props.location.state.user :  initialfieldState_userRegistration 
  );
  const [gender, setGender] = useState([]);
  const [role, setRole] = useState([]);
  const [confirm, setConfirm] = useState("");
  const [matchingPassword, setMatchingPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [matchingPasswordClass, setMatchingPasswordClass] = useState("");
  const [validPasswordClass, setValidPasswordClass] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  //const [setArr, setSetArr] = useState([]);  
  // console.log(selectedOption)
    // console.log(props.location.state.user.role)

  useEffect(() => {
    async function getCharacters() {
      axios
        .get(`${baseUrl}application-codesets/v2/GENDER`)
        .then((response) => {
          
          setGender(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.display,
              value: value.display,
            }))
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getCharacters();
  }, []);

  /* Get list of Role parameter from the endpoint */
  useEffect(() => {
    async function getCharacters() {
      axios
        .get(`${baseUrl}roles`)
        .then((response) => {
          
          setRole(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.name,
              value: value.id,
            }))
          );
         
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getCharacters();
  }, []);
 /// console.log(role)


  // check if password and confirm password match
  const handleConfirmPassword = (e, setConfirmPassword = true) => {
    if (setConfirmPassword) setConfirm(e.target.value);
    if (e.target.value === values.password || e.target.value === confirm) {
      setMatchingPassword(true);
      setMatchingPasswordClass("is-valid");
    } else {
      setMatchingPassword(false);
      setMatchingPasswordClass("is-invalid");
    }
  };

  const handlePassword = (e) => {
    handleInputChange(e);
    // validate password
    if (e.target.value.length > 5) {
      setValidPassword(true);
      setValidPasswordClass("is-valid");
    } else {
      setValidPassword(false);
      setValidPasswordClass("is-invalid");
    }
    // check if password and confirm password match
    handleConfirmPassword(e, false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateOfBirth = moment(values.dateOfBirth).format("YYYY-MM-DD");
    values["dateOfBirth"] = dateOfBirth;
    //values["roles"] = [values["role"]]
    let roleArr = []
    selectedOption.forEach(function (value, index, array) {
      roleArr.push(value['label'])
    })
    values["roles"] = roleArr
    setSaving(true);
    const onSuccess = () => {
      setSaving(false);
      //resetForm();
      props.history.push("/users")

    };
    const onError = () => {
      setSaving(false);
    
    };
      props.register(values, onSuccess, onError)
   
  };

  //console.log(saving)

  return (
    <>
    <ToastContainer autoClose={3000} hideProgressBar />
        <PageTitle activeMenu={userDetail===null ? "User Registration" : "Edit User"} motherMenu="Users" />
        <Card className={classes.cardBottom}>
        <CardContent>
            <Link
                  to ={{
                    pathname: "/users",
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
              <h4 className="card-title">{userDetail===null ? "User Information" : "Edit User Information"}</h4>
            </div>
            <div className="card-body">
              <div className="basic-form">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="firstName">First Name *</Label>
                    <Input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={values.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="lastName">Last Name * </Label>
                    <Input
                      type="text"
                      name="lastName"
                      id="lastName"
                      onChange={handleInputChange}
                      value={values.lastName}
                      required
                    />
                  </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="userName">Username *</Label>
                    <Input
                      type="text"
                      name="userName"
                      id="userName"
                      onChange={handleInputChange}
                      value={values.userName}
                      required
                    />
                  </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="email">Email *</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      onChange={handleInputChange}
                      value={values.email}
                      required
                    />
                  </FormGroup>
                   
                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="role">Role *</Label>
                    {/* <Input
                      type="select"
                      name="role"
                      id="role"
                      value={values.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value=""> </option>
                      {role.map(({ label, value }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Input> */}
                    <Select
                          onChange={setSelectedOption}
                          value={selectedOption}
                          options={role}
                          isMulti="true"
                          noOptionsMessage="true"
                      />
                  </FormGroup>
                   
                    </div>
                    {/* <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="gender">Gender </Label>
                    <Input
                      type="select"
                      name="gender"
                      id="gender"
                      value={values.gender}
                      onChange={handleInputChange}
                      //required
                    >
                      <option value=""> </option>
                      
                      {gender.map(({ label, value }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                   
                    </div> */}
                     <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="phoneNumber">Phone Number *</Label>
                    <Input
                      type="number"
                      name="phoneNumber"
                      id="phoneNumber"
                      onChange={handleInputChange}
                      value={values.phoneNumber}
                      required
                    />
                  </FormGroup>
                   
                    </div>
                    
                   
                  </div>
                  <div className="row">
                  <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="password">Password *</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      onChange={handlePassword}
                      value={values.password}
                      required
                      className={validPasswordClass}
                    />
                    <FormFeedback>
                      Password must be atleast 6 characters
                    </FormFeedback>
                  </FormGroup>
                   
                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="confirm">Confirm Password *</Label>
                    <Input
                      type="password"
                      name="confirm"
                      id="confirm"
                      onChange={handleConfirmPassword}
                      value={confirm}
                      required
                      className={matchingPasswordClass}
                    />
                    <FormFeedback>Passwords do not match</FormFeedback>
                  </FormGroup>
                  
                    
                    </div>
                   
                  </div>
                
                  {saving ? <Spinner /> : ""}
              <br />
              {userDetail ===null ? (

                <MatButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                  disabled={saving || !(validPassword && matchingPassword)}
                >
                  {!saving ? (
                    <span style={{ textTransform: "capitalize" }}>Save</span>
                  ) : (
                    <span style={{ textTransform: "capitalize" }}>Saving...</span>
                  )}
                </MatButton>
              )
              :
              (
                <MatButton
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<SaveIcon />}
                disabled={!(validPassword && matchingPassword)}
              >
                {!saving ? (
                  <span style={{ textTransform: "capitalize" }}>Save</span>
                ) : (
                  <span style={{ textTransform: "capitalize" }}>Saving...</span>
                )}
              </MatButton>
              )
            }
              <MatButton
                variant="contained"
                className={classes.button}
                startIcon={<CancelIcon />}
                onClick={resetForm}
              >
                <span style={{ textTransform: "capitalize" }}>Cancel</span>
              </MatButton>
                </form>
              </div>
            </div>
            
          </div>
        </div>
        </CardContent>
        </Card>
    </>
  );
};

const mapStateToProps = (state) => ({
  //status: state.users.status,
  status: [],
});

export default connect(mapStateToProps, { register, update })(UserRegistration);
