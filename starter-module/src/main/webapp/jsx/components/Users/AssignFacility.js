import React, {useState, useEffect} from 'react';
import {  Modal, ModalHeader, ModalBody, Form,Row,Col,FormGroup,Label,Input,Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { createWard, updateWard } from './../../../actions/applicationCodeset';
import { Spinner } from 'reactstrap';
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import axios from "axios";
import {url as baseUrl} from "./../../../api";
import Select from "react-select";
import PageTitle from "./../../layouts/PageTitle";
import { TiArrowBack } from 'react-icons/ti';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

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

const AssignFacility = (props) => {
  const [loading, setLoading] = useState(false)
  console.log(props.location.state.user)
    const defaultValues = {name:""};
    const currentUser = props.location && props.location.state.user ? props.location.state.user : {};
    const [formData, setFormData] = useState( defaultValues)
    const [facilities, setFacilities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [lgas, setLgas] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState( [] );
    const classes = useStyles()
    const [saving, setSaving] = useState(false);

    const onFacilitySelect = (selectedValues) => {
        setSelectedFacilities(selectedValues);
    };
    useEffect(() => {
        const y = props.location.state.user && props.location.state.user.applicationUserOrganisationUnits
            ? props.location.state.user.applicationUserOrganisationUnits.map((x) => (x.organisationUnitId)) : [];

            setSelectedFacilities(y);
    }, [props.location.state.user]);

    const getStateByCountry = (data) => {
        fetchOrgUnitByParentId(data.value.id, 2, setStates);
        fetchFacilityByParentId(data.value.id, 4);
    };

    const getLgaByState = (data) => {
        fetchOrgUnitByParentId(data.value.id, 3, setLgas);
        fetchFacilityByParentId(data.value.id, 4);
    }

    const getFacilities = (data) => {
        fetchFacilityByParentId(data.value.id, 4);
    }

    const fetchCountries = () => {
        axios
            .get(`${baseUrl}organisation-units/organisation-unit-level/1`)
            .then((response) => {
                const c = response.data.map(x => ({
                    ...x,
                    label: x.name,
                    value: x.id,
                }));
                setCountries(c);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const fetchFacilityByParentId = (parentId, levelId) => {
        axios
            .get(`${baseUrl}organisation-units/hierarchy/${parentId}/${levelId}`)
            .then((response) => {
                setFacilities(
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

    const fetchOrgUnitByParentId = (parentId, levelId, setData) => {
        axios
            .get(`${baseUrl}organisation-units/hierarchy/${parentId}/${levelId}`)
            .then((response) => {
                const c = response.data.map(x => ({
                    ...x,
                    label: x.name,
                    value: x.id,
                }));
               // const d = c.push({label:'Select one', value:''});

               setData(c);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    useEffect(() => {
        //for application codeset edit, load form data
        setFormData(props.formData ? props.formData : defaultValues);
    }, [props.formData]);



    /* Get list of Facilities from the server - id is 4*/
    useEffect(() => {
        async function getCharacters() {
            axios
                .get(`${baseUrl}organisation-units/organisation-unit-level/4`)
                .then((response) => {
                    setFacilities(
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
        fetchCountries();
    }, []);

    const handleInputChange = e => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
    }
    const closeButton = e => {
        props.history.push('/users')
    }
    const create = e => {
        e.preventDefault()
        setLoading(true);

        const data = selectedFacilities.map(x =>
        {
            return {applicationUserId: currentUser.id , organisationUnitId : x} 
        });
       
        const onSuccess = () => {
            setLoading(false);
            toast.success("Facility assigned successfully!")
            props.history.push("/users")
        }
        const onError = () => {
            setLoading(false);
            toast.error("Something went wrong, please contact administration");
            //props.toggleModal()
        }
        axios
            .post(`${baseUrl}application_user_organisation_unit`, data)
            .then((response) => {
                onSuccess();
            })
            .catch((error) => {
                onError();
            });
    }


  return (
    <>
        <PageTitle activeMenu="Edit Role" motherMenu="Users" />
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
              <h4 className="card-title">User Information</h4>
            </div>
            <div className="card-body">
              <div className="basic-form">
                <form onSubmit={create}>
                  <div className="row">
                    <div className="form-group mb-12 col-md-12">
                    <Row >

                            <Col md={4}>
                                <FormGroup>
                                    <Label>Country</Label>
                                    <Select
                                        required
                                        isMulti={false}
                                        isClearable={true}
                                        onChange={getStateByCountry}
                                        options={countries.map((x) => ({
                                            label: x.name,
                                            value: x,
                                        }))}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label>State</Label>
                                    <Select
                                        required
                                        isMulti={false}
                                        isClearable={true}
                                        onChange={getLgaByState}
                                        options={states.map((x) => ({
                                            label: x.name,
                                            value: x,
                                        }))}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup>
                                    <Label>LGA</Label>
                                    <Select
                                        required
                                        isMulti={false}
                                        isClearable={true}
                                        onChange={getFacilities}
                                        options={lgas.map((x) => ({
                                            label: x.name,
                                            value: x,
                                        }))}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="Facility">Assign Facilities</Label>
                                    <DualListBox
                                        canFilter
                                        options={facilities}
                                        onChange={onFacilitySelect}
                                        selected={selectedFacilities}
                                    />
                                </FormGroup>
                            </Col>
                            </Row>

                            <MatButton
                            type='submit'
                            variant='contained'
                            color='primary'
                            className={classes.button}
                            startIcon={<SaveIcon />}
                            disabled={loading}
                            >
                            Save  {loading ? <Spinner /> : ""}
                            </MatButton>
                            <MatButton
                            variant='contained'
                            color='default'
                            onClick={closeButton}
                            startIcon={<CancelIcon />}
                            >
                            Cancel
                            </MatButton>
                    </div>

                  </div>
                   </form>
                    </div>
                    </div>
                    
          </div>
        </div>
    </>
  );
};

export default connect(null, { createWard , updateWard})(AssignFacility);