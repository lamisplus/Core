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
import { ToastContainer, toast } from "react-toastify";
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
//import Select from "react-select";
import DualListBox from "react-dual-listbox";
import _ from "lodash";

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
  error: {
    color: "red",
  },
}));
let  arrVal = [];

const disabledColor = '#E6E6E6';
const UserRegistration = (props) => {
  const [errors, setErrors] = useState({});
   //
  const userDetail = props.location && props.location.state ? props.location.state.user : null;
  const [currentUser, setCurrentUser]=useState(null)
  const rolesDef = props.location && props.location.state ? props.location.state.defRole : null;
  const [isView, setIsView] = useState(false);
  const classes = useStyles();
  const { values, setValues, handleInputChange, resetForm } = useForm(
    props.location && props.location.state ? props.location.state.user :  initialfieldState_userRegistration 
  );
  const [gender, setGender] = useState([]);
  const [role, setRole] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [matchingPassword, setMatchingPassword] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [matchingPasswordClass, setMatchingPasswordClass] = useState("");
  const [validPasswordClass, setValidPasswordClass] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.location.state.user.roles);
  const [setArr, setSetArr] = useState([]);
  const [designation, setDesignation] = useState([]);
  const [loadingFacilities, setLoadingFacilities] = useState(false);
  const [organisations,setOrganisations] = useState([]);
  const [selectedOrganisations,setSelectedOrganisations] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState("#E6E6E6");
  const [passwordTextColor, setPasswordTextColor] = useState("#2D2D2D");
  const [passwordFeedback, setPasswordFeedback] = useState('Minimum 6 characters, one uppercase and lowercase letter and one number');
  const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  const disabledBorder = '#ccc';



  const fetchOrganisation=()=>{
    setLoadingFacilities(true)
    axios
    // .get(`${baseUrl}organisation-unit-levels/v2/4/organisation-units`)
    .get(`${baseUrl}organisation-unit-levels/v2/4/organisation-units-assigned`)
    .then((response) => {
      // setAllorganisations(response.data);
      setOrganisations(
        Object.entries(response.data).map(([key, value]) => ({
                label: value.name,
                value: value.id,
              }))
            );
            setSelectedOrganisations(
              _.uniq(_.map(userDetail.applicationUserOrganisationUnits, 'organisationUnitId'))
            )

            setLoadingFacilities(false)
          })
          .catch((error) => {
            console.log(error);
          });
          if (loadingFacilities){
            setLoadingFacilities(false)
          }
    }

  useEffect(() => {
    getCharacters();
    fetchOrganisation();
  }, []);
  
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
  
  /* Get list of Role parameter from the endpoint */
  useEffect(() => {
    async function getCharacters() {
      axios
          .get(`${baseUrl}account/roles`)
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

      axios
          .get(`${baseUrl}account`)
          .then((response) => {
            setCurrentUser(response.data)
            setMatchingPassword(true);
            setValidPassword(true);
          })
          .catch((error) => {
            console.log(error);
          });
    }
    getCharacters();
  }, []);

  useEffect(()=> {
    if (!props.location.state.isUpdate) {
      setIsView(true)
    }

  }, [props.location.state.isUpdate])


  const onPermissionSelect = (selectedValues) => {
    setSelectedOption(selectedValues);
  };
  const onOrganisationSelect = (selectedValues) => {
    setSelectedOrganisations(selectedValues);
  };

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



/*  async function switchFacility (facility) {
    console.log(facility)
    await axios.post(`${baseUrl}users/organisationUnit/${facility}`, {})
        .then(response => {
          toast.success('Facility switched successfully!');
          //toggleAssignFacilityModal();
        }) .catch((error) => {
          toast.error('An error occurred, could not switch facility.');
        });

  }*/


  const handleInputChangePhoneNumber = (e) => {
    const acceptedNumber = e.target.value;
    // Remove any non-numeric characters, and limit to 11 numbers
    const cleanedNumber = acceptedNumber.replace(/[^0-9]/g, '').slice(0, 11);
    setValues({ ...values, phoneNumber: cleanedNumber });
  
  };

  const validate = () => {
    let temp = { ...errors };
    temp.phoneNumber = values.phoneNumber
        ? ""
        : "Phone Number is required. Kindly enter a valid phone number.";
    temp.firstName = values.firstName
            ? ""
            : "First Name is required";
    temp.lastName = values.lastName
            ? ""
            : "Last Name is required";
    temp.userName = values.userName
            ? ""
            : "Username is required";
    temp.email = values.email
            ? ""
            : "Email is required";
    temp.designation = values.designation
            ? ""
            : "Designation is required";

    setErrors({
        ...temp,
    });
    return Object.values(temp).every((x) => x === "");
};


  const handleSubmit = (e) => {

    e.preventDefault();
    if (validate()) {
      const dateOfBirth = moment(values.dateOfBirth).format("YYYY-MM-DD");
      values["dateOfBirth"] = dateOfBirth;
      values["roles"] = selectedOption
      values["facilityIds"] = selectedOrganisations
      setSaving(true);
      const onSuccess = () => {
        setSaving(false);
        toast.success("User Updated Successful");
        resetForm();
        props.history.push("/users")
      };
      const onError = () => {
        setSaving(false);
        toast.error("Something went wrong");
      };

      
      props.update(userDetail.id,values, onSuccess, onError);
    }
  };



  return (
    <>
    <ToastContainer autoClose={3000} hideProgressBar />
        <PageTitle activeMenu={userDetail===null ? "User Registration" : isView ? "View User" : "Edit User"} motherMenu="Users" />
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
      
      <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title" style={{color:'#014d88',fontWeight:'bolder'}}>{userDetail===null ? "User Information" : isView ? "View User Information" : "Edit User Information"}</h4>
            </div>
            <div className="card-body">
              <div className="basic-form">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="firstName" style={{color:'#014d88',fontWeight:'bolder'}}>First Name *</Label>
                    <Input
                      type="text"
                      name="firstName"
                      id="firstName"
                      value={values.firstName}
                      onChange={handleInputChange}
                      style={{height:"40px",border:`solid 1px ${isView ? disabledBorder : '#014d88' }`, backgroundColor:`${isView && disabledColor}`, borderRadius:'5px'}}
                      disabled={isView}
                      // required
                    />
                    {errors.facilityId !=="" ? (
                                    <span className={classes.error}>{errors.firstName}</span>
                                ) : "" }
                  </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="lastName" style={{color:'#014d88',fontWeight:'bolder'}}>Last Name * </Label>
                    <Input
                      type="text"
                      name="lastName"
                      id="lastName"
                      onChange={handleInputChange}
                      value={values.lastName}
                      style={{height:"40px",border:`solid 1px ${isView ? disabledBorder : '#014d88' }`, backgroundColor:`${isView && disabledColor}`, borderRadius:'5px'}}
                      disabled={isView}
                      // required
                    />
                    {errors.facilityId !=="" ? (
                                    <span className={classes.error}>{errors.lastName}</span>
                                ) : "" }
                  </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="userName" style={{color:'#014d88',fontWeight:'bolder'}}>Username *</Label>
                    <Input
                      type="text"
                      name="userName"
                      id="userName"
                      onChange={handleInputChange}
                      value={values.userName}
                      style={{height:"40px",border:`solid 1px ${isView ? disabledBorder : '#014d88' }`, backgroundColor:`${isView && disabledColor}`, borderRadius:'5px'}}
                      disabled={isView}
                      // required
                    />
                    {errors.facilityId !=="" ? (
                                    <span className={classes.error}>{errors.userName}</span>
                                ) : "" }
                  </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                    <Label for="email" style={{color:'#014d88',fontWeight:'bolder'}}>Email *</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      onChange={handleInputChange}
                      value={values.email}
                      style={{height:"40px",border:`solid 1px ${isView ? disabledBorder : '#014d88' }`, backgroundColor:`${isView && disabledColor}`, borderRadius:'5px'}}
                      disabled={isView}
                      // required
                    />
                    {errors.facilityId !=="" ? (
                                    <span className={classes.error}>{errors.email}</span>
                                ) : "" }
                  </FormGroup>
                   
                    </div>
                    {/* <div className="form-group mb-3 col-md-6">
                    <FormGroup>
                      <Label for="role">Role *</Label>
                      
                      <Select
                            onChange={setSelectedOption}
                            value={selectedOption}
                            options={role}
                            isMulti="true"
                            noOptionsMessage="true"
                      />
                    </FormGroup>                   
                    </div> */}
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                      <Label for="gender" style={{color:'#014d88',fontWeight:'bolder'}}>Designation </Label>
                      <Input
                        type="select"
                        name="designation"
                        id="designation"
                        value={values.designation}
                        onChange={handleInputChange}
                        style={{height:"40px",border:`solid 1px ${isView ? disabledBorder : '#014d88' }`, backgroundColor:`${isView && disabledColor}`, borderRadius:'5px'}}
                        disabled={isView}
                        // required
                      >
                       
                        {designation.map(({ label, value }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Input>
                      {errors.facilityId !=="" ? (
                                    <span className={classes.error}>{errors.designation}</span>
                                ) : "" }
                    </FormGroup>                  
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                      <Label for="phoneNumber" style={{color:'#014d88',fontWeight:'bolder'}}>Phone Number *</Label>
                      <Input
                        type="number"
                        name="phoneNumber"
                        id="phoneNumber"
                        onChange={(e) => handleInputChangePhoneNumber(e)}
                        value={values.phoneNumber}
                        style={{height:"40px",border:`solid 1px ${isView ? disabledBorder : '#014d88' }`, backgroundColor:`${isView && disabledColor}`, borderRadius:'5px'}}
                        disabled={isView}
                        // required
                      />
                      {errors.facilityId !=="" ? (
                                    <span className={classes.error}>{errors.phoneNumber}</span>
                                ) : "" }
                      </FormGroup>                                     
                    </div>
                    <div className="form-group mb-3 col-md-6">
                        <FormGroup>
                        <Label for="password" style={{color:'#014d88',fontWeight:'bolder'}}>Password</Label>
                          <Input
                            type="password"
                            name="password"
                            id="password"
                            onChange={handlePassword}
                            value={values.password}
                            style={{height:"40px",border:`solid 1px ${isView ? disabledBorder : '#014d88' }`,borderRadius:'5px',backgroundColor:`${isView ? '#E6E6E6' : passwordStrength}`}}
                            className={validPasswordClass}
                            autoComplete="new-password"
                            disabled={isView}
                          />
                          <div style={{color:`${passwordTextColor}`,opacity:'1'}}>
                            {passwordFeedback}
                          </div>
{/*                        <FormFeedback>
                          Password must be atleast 6 characters
                        </FormFeedback>*/}
                        </FormGroup>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                      <FormGroup>
                      <Label for="confirm" style={{color:'#014d88',fontWeight:'bolder'}}>Confirm Password</Label>
                      <Input
                        type="password"
                        name="confirm"
                        id="confirm"
                        onChange={handleConfirmPassword}
                        value={confirm}
                        style={{height:"40px",border:`solid 1px ${isView ? disabledBorder : '#014d88' }`, backgroundColor:`${isView && disabledColor}`, borderRadius:'5px'}}
                        className={matchingPasswordClass}
                        disabled={isView}
                        autoComplete="new-password"
                      />
                      <FormFeedback>Passwords do not match</FormFeedback>
                      </FormGroup> 
                    </div>

                  </div>



                  <div className="form-group mb-12 col-md-12" >
                    <FormGroup>
                      <Label for="permissions" style={{color:'#014d88',fontWeight:'bolder'}}>Facility*</Label>
                      {!loadingFacilities ? (<DualListBox 
                          canFilter
                          options={organisations}
                          onChange={onOrganisationSelect}
                          selected={selectedOrganisations}
                          required
                          disabled={isView}
                      />) : (<div style={{display:'flex', justifyContent:"flex-start", alignItems:'center'}}>
                        <Spinner/>
                        <p style={{marginLeft:'10px'}}>Loading Facilities</p>
                        </div>
                    )}
                    </FormGroup>
                      
                  </div>





                  <div className="form-group mb-12 col-md-12" style={{paddingTop:'20px'}}>
                      <FormGroup>
                        <Label for="permissions" style={{color:'#014d88',fontWeight:'bolder'}}>Role*</Label>
                        <DualListBox
                          canFilter
                          options={role}
                          onChange={onPermissionSelect}
                          selected={selectedOption}
                          disabled={isView}
                        />
                      </FormGroup>
                    </div>
                
                  {/* {saving ? <Spinner /> : ""} */}
              <br />
              {userDetail ===null ? (

                <MatButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  startIcon={<SaveIcon />}
                  disabled={saving || !(validPassword && matchingPassword)}
                  style={{backgroundColor: '#014d88',color:'#fff'}}
                  loading={saving}
                >
                  {!saving ? (
                    <span style={{ textTransform: "capitalize" }}>Save</span>
                  ) : (
                    <span style={{ textTransform: "capitalize" }}><Spinner /> Saving...</span>
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
                disabled={!(validPassword && matchingPassword) || isView}
                style={{backgroundColor: isView ? "grey" : '#014d88',color:'#fff'}}
              >
                {!saving ? (
                  <span style={{ textTransform: "capitalize" }}>Save</span>
                ) : (
                  <span style={{ textTransform: "capitalize" }}><Spinner /> Saving...</span>
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
