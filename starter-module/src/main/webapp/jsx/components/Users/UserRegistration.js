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
import {useHistory} from "react-router-dom";
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
//import Select from "react-select";
import DualListBox from "react-dual-listbox";
import _ from "lodash";
import {authentication} from "../../../_services/authentication";

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
    '& .form-control.is-valid': {
      borderColor: '#f72b50 !important',
      borderRight: '0px !important'
    },
    '& .form-control.is-invalid': {
      borderColor: '#f72b50e !important',
      borderRight: '0px !important'
    },
    /*    "& .react-dual-listbox button, .react-dual-listbox select":{
          border:'1px solid #E6E6E6'
        }*/
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
  const history = useHistory();
  const userDetail = props.location && props.location.state ? props.location.state.user : null;
  //const rolesDef = props.location && props.location.state ? props.location.state.defRole : null;
  const classes = useStyles();
  const { values, setValues, handleInputChange, resetForm } = useForm(
      props.location && props.location.state ? props.location.state.user :  initialfieldState_userRegistration
  );
  //const [gender, setGender] = useState([]);
  const [role, setRole] = useState([]);
  const [confirm, setConfirm] = useState("");
  const [matchingPassword, setMatchingPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [matchingPasswordClass, setMatchingPasswordClass] = useState("");
  const [validPasswordClass, setValidPasswordClass] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const [designation, setDesignation] = useState([]);
  const [ips, setIps] = useState([]);
  const [allOrganisations, setAllorganisations]=useState([]);
  const [organisations,setOrganisations] = useState([]);
  const [selectedIp, setSelectedIp] = useState(null);
  const [selectedOrganisations,setSelectedOrganisations] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState("#E6E6E6");
  const [passwordTextColor, setPasswordTextColor] = useState("#2D2D2D");
  const [passwordFeedback, setPasswordFeedback] = useState('Minimum 6 characters, one uppercase and lowercase letter and one number');
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  const [user, setUser] = useState(null);

  const fetchOrganisation=()=>{
    axios
        .get(`${baseUrl}organisation-unit-levels/v2/4/organisation-units`)
        .then((response) => {
          setAllorganisations(response.data);
          // setOrganisations(
          //     Object.entries(response.data).map(([key, value]) => ({
          //       label: value.name,
          //       value: value.name,
          //     }))
          // );
        })
        .catch((error) => {
          console.log(error);
        });
  }
  const fetchOrganisationsUnderIp=()=>{
    axios
        .get(`${baseUrl}organisation-units/parent-organisation-units/${selectedIp}`)
        .then((response) => {
          // setAllorganisations(response.data);
          setAllorganisations(
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

  const fetchIps= async () =>{
    await axios
        .get(`${baseUrl}organisation-unit-levels/v2/8/organisation-units`)
        .then((response) => {
          console.log(response);
          console.log(response.data);
          setIps(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.name,
              value: value.id,
            }))
            );
            if (response.data.length === 0) {
              fetchOrganisation();
            }
        })
        .catch((error) => {
          console.log(error);
          fetchOrganisation();
        });
  }

  useEffect(() => {
    async function getCharacters() {
      axios
          .get(`${baseUrl}application-codesets/v2/DESIGNATION`)
          .then((response) => {

            setDesignation(
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
    // fetchOrganisation();
    fetchMe();
    fetchIps();
  }, []);

  useEffect(()=>{
    if (selectedIp !== null) {
      fetchOrganisationsUnderIp();
    }
  },[selectedIp])

  /* Get list of Role parameter from the endpoint */
  useEffect(() => {
    async function getCharacters() {
      axios
          .get(`${baseUrl}account/roles`)
          .then((response) => {
            //console.log(response.data)
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
  async function fetchMe() {
    if( authentication.currentUserValue != null ) {
      axios
          .get(`${baseUrl}account`)
          .then((response) => {
            setUser(response.data);
            //console.log(response.data)
            // setOrganisations(
            //     Object.entries(response.data.applicationUserOrganisationUnits).map(([key, value]) => ({
            //       label: value.organisationUnitName,
            //       value: value.organisationUnitId,
            //     }))
            // );
          })
          .catch((error) => {
            //authentication.logout();
            // console.log(error);
          });
    }
  }
  //console.log(user)
  // check if password and confirm password match
  const handleConfirmPassword = (e, setConfirmPassword = true) => {
    if(strongRegex.test(e.target.value)) {
      setPasswordStrength("#DDFFEE");
      setPasswordTextColor("#01C864");
      setPasswordFeedback('Password Strength: Strong')
    } else if(mediumRegex.test(e.target.value)) {
      setPasswordStrength("#FFF3D0");
      setPasswordTextColor("#FFD55A");
      setPasswordFeedback('Password Strength: Medium')
    } else {
      setPasswordStrength("#E6E6E6");
      setPasswordTextColor("#2D2D2D");
      setPasswordFeedback('Minimum 6 characters, one uppercase and lowercase letter and one number')
    }


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
  // const updateUserOrganisations=(userId)=>{
  //   if(selectedOrganisations.length >0){
  //     //Add Organisations
  //     let facilityDetails = [];
  //     selectedOrganisations.map((organisation) =>{
  //       var orgDetails = _.find(allOrganisations, {name:organisation});
  //       facilityDetails.push({
  //         "applicationUserId": userId,
  //         "organisationUnitId": orgDetails.id
  //       })

  //     });
  //     axios.post(`${baseUrl}application_user_organisation_unit`, facilityDetails)
  //         .then(response => {
  //           toast.success(`successfully added`);
  //         }) .catch((error) => {
  //       toast.error(`An error occurred, adding facility`);
  //     });
  //     return true;
  //   }
  //   return false;
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateOfBirth = moment(values.dateOfBirth).format("YYYY-MM-DD");
    values["dateOfBirth"] = dateOfBirth;
    values["roles"] = selectedOption
    values["facilityIds"] = selectedOrganisations
    setSaving();

    axios.post(`${baseUrl}users`, values)
        .then(response => {
          setSaving(false);
          toast.success(`successfully added`);
          //console.log(response.data)
          history.push({
            pathname: '/users',
          });
        }) .catch((error) => {
      setSaving(false);
      toast.error(`An error occurred, while adding user`);
    });
    //updateUserOrganisations();
  };

  const onPermissionSelect = (selectedValues) => {
    setSelectedOption(selectedValues);
  };
  const onOrganisationSelect = (selectedValues) => {
    setSelectedOrganisations(selectedValues);
  };
  const checkNINLimit=(e)=>{
    const limit = 11;        
    const acceptedNumber= e.slice(0, limit)
    return  acceptedNumber   
}
  const handleInputChangePhoneNumber=(e, inputName)=>{
    const limit = 11;
    const acceptedNumber= e.target.value.slice(0, limit)
    setValues({...values, ['phoneNumber']: acceptedNumber})
      return  acceptedNumber
  }

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
                  startIcon={<TiArrowBack style={{color:'#fff'}} />}
                  style={{backgroundColor:'#014d88'}}
              >
                <span style={{ textTransform: "capitalize" }}>Back </span>
              </Button>
            </Link>
            <br />

            <br />
            <ToastContainer autoClose={3000} hideProgressBar />

            <div  className={classes.root} >
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title" style={{color:'#014d88',fontWeight:'bolder'}}>{userDetail===null ? "User Information" : "Edit User Information"}</h4>
                </div>
                <div className="card-body">
                  <div className="basic-form">
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="firstName" style={{color:'#014d88',fontWeight:'bolder'}}>First Name <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="text"
                                name="firstName"
                                id="firstName"
                                value={values.firstName}
                                onChange={handleInputChange}
                                //style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px'}}
                                style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                required
                            />
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="lastName" style={{color:'#014d88',fontWeight:'bolder'}}>Last Name <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="text"
                                name="lastName"
                                id="lastName"
                                onChange={handleInputChange}
                                value={values.lastName}
                                style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                required
                            />
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="userName" style={{color:'#014d88',fontWeight:'bolder'}}>Username <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="text"
                                name="userName"
                                id="userName"
                                onChange={handleInputChange}
                                value={values.userName}
                                style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                required
                            />
                          </FormGroup>
                        </div>
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="email" style={{color:'#014d88',fontWeight:'bolder'}}>Email <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                                value={values.email}
                                style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                required
                            />
                          </FormGroup>

                        </div>

                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="role" style={{color:'#014d88',fontWeight:'bolder'}}>Designation <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="select"
                                name="designation"
                                id="designation"
                                value={values.designation}
                                onChange={handleInputChange}
                                style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                            >
                              <option value="">Select </option>
                              {designation.map(({ label, value }) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                              ))}
                            </Input>
                          </FormGroup>


                        </div>

                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="phoneNumber" style={{color:'#014d88',fontWeight:'bolder'}}>Phone Number <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="number"
                                name="phoneNumber"
                                id="phoneNumber"
                                onChange={handleInputChangePhoneNumber}
                                value={values.phoneNumber}
                                style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                required
                            />
                          </FormGroup>

                        </div>


                      </div>
                      <div className="row">
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="password" style={{color:'#014d88',fontWeight:'bolder'}}>Password <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                onChange={handlePassword}
                                value={values.password}
                                style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                required
                                className={validPasswordClass}
                                autocomplete="off"
                            />
                            <div style={{color:`${passwordTextColor}`,opacity:'1'}}>
                              {values.password!=="" ? passwordFeedback : ""}
                            </div>
                            {/*                   <FormFeedback>
                      {passwordFeedback}
                    </FormFeedback>*/}
                          </FormGroup>

                        </div>
                        <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="confirm" style={{color:'#014d88',fontWeight:'bolder'}}>Confirm Password <span style={{ color:"red"}}> *</span></Label>
                            <Input
                                type="password"
                                name="confirm"
                                id="confirm"
                                onChange={handleConfirmPassword}
                                value={confirm}
                                style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                required
                                className={matchingPasswordClass}
                                autocomplete="off"
                            />
                            <FormFeedback>Passwords do not match</FormFeedback>
                          </FormGroup>
                        </div>
                        {ips.length > 0 && <div className="form-group mb-3 col-md-6">
                          <FormGroup>
                            <Label for="ip" style={{color:'#014d88',fontWeight:'bolder'}}>Implementing Partner</Label>
                            <Input
                                type="select"
                                name="ipCode"
                                id="ipCode"
                                value={values.ip}
                                onChange={(e)=>{
                                  handleInputChange(e)
                                  setSelectedIp(e.target.value)
                                }}
                                style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                            >
                              <option value="">Select </option>
                              {ips.map(({ label, value }) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                              ))}
                            </Input>
                          </FormGroup>


                        </div>}
                        <div className="form-group mb-12 col-md-12">
                          <FormGroup>
                            <Label for="permissions" style={{color:'#014d88',fontWeight:'bolder'}}>Facility <span style={{ color:"red"}}> *</span></Label>
                            <DualListBox
                                options={allOrganisations}
                                onChange={onOrganisationSelect}
                                selected={selectedOrganisations}
                            />
                          </FormGroup>
                        </div>

                        <div className="form-group mb-12 col-md-12">
                          <FormGroup>
                            <Label for="permissions" style={{color:'#014d88',fontWeight:'bolder'}}>Role <span style={{ color:"red"}}> *</span></Label>
                            <DualListBox
                                //canFilter
                                options={role}
                                onChange={onPermissionSelect}
                                selected={selectedOption}
                                sx={{border:'solid 1px #014d88',borderRadius:'5px'}}
                            />
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
                                  style={{backgroundColor:'#014d88',color:'#fff'}}
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
                                  style={{backgroundColor:'#014d88',color:'#fff'}}
                              >
                                {!saving ? (
                                    <span style={{ textTransform: "capitalize" }}>Save</span>
                                ) : (
                                    <span style={{ textTransform: "capitalize" }}>Saving...</span>
                                )}
                              </MatButton>
                          )
                      }
                      {" "}<Link
                        to ={{
                          pathname: "/users",
                          state: 'users'
                        }}
                    >
                      <MatButton
                          variant="contained"
                          className={classes.button}
                          startIcon={<CancelIcon style={{color:'#fff'}} />}
                          style={{backgroundColor:'#992E62'}}
                      >
                        <span style={{ textTransform: "capitalize",color:'#fff' }}>Cancel</span>
                      </MatButton>
                    </Link>
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
