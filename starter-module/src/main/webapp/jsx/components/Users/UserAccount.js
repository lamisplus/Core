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

import { register, update } from "../../../actions/user";
import { url as baseUrl } from "../../../api";
import { initialfieldState_userRegistration } from "../../../_helpers/initialFieldState_UserRegistration";
import useForm from "../Functions/UseForm";
import { Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
//import { FaArrowLeft } from "react-icons/fa";
import { TiArrowBack } from 'react-icons/ti'
import Moment from "moment";
import momentLocalizer from "react-widgets-moment";
import moment from "moment";
import PageTitle from "../../layouts/PageTitle";
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
let  arrVal = [];

const UserRegistration = (props) => {
   //
  const userDetail = props.location && props.location.state ? props.location.state.user : null;
  console.log(userDetail)
  const rolesDef = props.location && props.location.state ? props.location.state.defRole : null;
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
  const [setArr, setSetArr] = useState([]);  


  useEffect(() => {
    async function getCharacters() {
      axios
        .get(`${baseUrl}application-codesets/codesetGroup?codesetGroup=GENDER`)
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
              value: value.name,
            }))
          );
          //setSelectedOption(role.filter(x => x.value in(props.location.state.user.roles)))
          props.location.state.user.roles.forEach(function (value, index, array) {
            for(var i=0; i<rolesDef.length; i++){
              if (rolesDef[i].label===value ){
              
              arrVal.push(rolesDef[i])
              }
                          
            }
            
        });
        setSelectedOption(arrVal)
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getCharacters();
  }, []);
 

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
    const newRoleList =selectedOption.forEach(function (value, index, array) {
      roleArr.push(value['label'])
    })
    values["roles"] = roleArr
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
  };



  return (
    <>
    <ToastContainer autoClose={3000} hideProgressBar />
        <PageTitle activeMenu="Account" motherMenu="Users" />
        <Card className={classes.cardBottom}>
        <CardContent>
            <Link
                  to ={{
                    pathname: "/users",
                    state: 'users'
                  }}
            >
              
            </Link>
            <br />
          
          <br />
      <ToastContainer autoClose={3000} hideProgressBar />
      
      <div className="col-xl-12 col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">User Information</h4>
            </div>
            <div className="card-body">
              <div className="basic-form">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="mb-3 col-md-6">
                    
                    <Label for="firstName">First Name  :  <b>{values.firstName}</b></Label>

                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <Label for="lastName">Last Name :  <b>{values.lastName}</b></Label>

                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <Label for="userName">Username : <b>{values.userName}</b></Label>
                    </div>
                    <div className="form-group mb-3 col-md-6">
                    <Label for="email">Email :  <b>{values.email}</b></Label>
                   
                    </div>
                    <div className=" mb-3 col-md-6">                  
                    <Label for="role">Role  : <b>{values.roles.toString()}</b></Label>          
                    </div>                   
                   
                    <div className=" mb-3 col-md-6">
                    <Label for="phoneNumber">Phone Number :<b>{values.phoneNumber}</b></Label>

                    </div>
                  </div>

                
                  {saving ? <Spinner /> : ""}
                <br />
            
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
