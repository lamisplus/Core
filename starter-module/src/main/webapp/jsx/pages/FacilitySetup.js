import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {authentication} from "../../_services/authentication";
import { Form,Row,Col,FormGroup,Label,Input,Card,CardBody} from 'reactstrap';
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { Spinner } from 'reactstrap';
import SaveIcon from '@material-ui/icons/Save'
import Select from "react-select";
import {url as baseUrl} from "../../api";
import DualListBox from "react-dual-listbox";
import { toast } from "react-toastify";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

const ErrorMissingOrganisation = (props) => {

    const [loading, setLoading] = useState(false)
    //const currentUser = props.user;
    const defaultValues = {applicationUserId: "", organisationUnitId:"", targetGroup:""};
    const [formData, setFormData] = useState( defaultValues)
    const [facilities, setFacilities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [lgas, setLgas] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState( [] );
    const classes = useStyles()
    const [targetGroup, setTargetGroup] = useState([]);
    const onFacilitySelect = (selectedValues) => {
        setSelectedFacilities(selectedValues);
    };

    const getStateByCountry = (data) => {
        fetchOrgUnitByParentId(data.value.id, 2, setStates);
        //fetchFacilityByParentId(data.value.id, 4);
    };

    const getLgaByState = (data) => {
        fetchOrgUnitByParentId(data.value.id, 3, setLgas);
        //fetchFacilityByParentId(data.value.id, data.value.id);
    }
    const getTargetGroup = (data) => {
        defaultValues.targetGroup=data.label
    }
    const getFacilities = (data) => {
        fetchFacilityByParentId(data.value.id, 4);
    }
    useEffect(() => {
        fetchCountries();
        fetchTargetGroup();
    }, []);
    const fetchCountries = () => {
        axios
            .get(`${baseUrl}organisation-units/parent-organisation-units/0`)
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
    const fetchTargetGroup = () => {
        axios
            .get(`${baseUrl}application-codesets/v2/TARGET_GROUP_SETUP`)
            .then((response) => {
                const c = response.data.map(x => ({
                    ...x,
                    label: x.name,
                    value: x.id,
                }));
                setTargetGroup(c);
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const fetchFacilityByParentId = (parentId, levelId) => {
        axios
            .get(`${baseUrl}organisation-units/parent-organisation-units/${parentId}/organisation-units-level/${levelId}/hierarchy`)
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
    //console.log(facilities)
    const fetchOrgUnitByParentId = (parentId, levelId, setData) => {
        axios
            .get(`${baseUrl}organisation-units/parent-organisation-units/${parentId}`)
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
    // useEffect(() => {
    //     const y = props.user && props.user.applicationUserOrganisationUnits
    //         ? props.user.applicationUserOrganisationUnits.map((x) => (x.organisationUnitId)) : [];
    //     setSelectedFacilities(y);
    // }, [props.user]);

    /* Get list of Facilities from the server - id is 4*/
    // useEffect(() => {
    //     async function getCharacters() {
    //         axios
    //             .get(`${baseUrl}organisation-units/organisation-unit-level/4`)
    //             .then((response) => {
    //                 setFacilities(
    //                     Object.entries(response.data).map(([key, value]) => ({
    //                         label: value.name,
    //                         value: value.id,
    //                     }))
    //                 );
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //             });
    //     }
    //
    //     getCharacters();
    //     //fetchCountries();
    // }, []);
    const create = e => {
        e.preventDefault()
        setLoading(true);
        defaultValues.organisationUnitId = selectedFacilities
        defaultValues.applicationUserId= props.user.userName
        //console.log(defaultValues);
        const onSuccess = () => {
            setLoading(false);
            toast.success("Facility assigned successfully!")
            //props.toggleModal()
            window.location.reload(false);
        }
        const onError = () => {
            setLoading(false);
            toast.error("Something went wrong, please contact administration");
            //props.toggleModal()
        }
        axios
            .post(`${baseUrl}users/facility/setup`, defaultValues)
            .then((response) => {
                onSuccess();
            })
            .catch((error) => {
                onError();
            });
    }
    const handleClick = ()=>{
        //console.log('mew mew mew')
        authentication.logout();
    }
    return (
        <div className="authincation h-100 p-meddle">
            <div className="container h-100">
                {" "}
                <div className="row justify-content-center h-100 align-items-center">
                    <div className="col-md-12">
                        <div className="form-input-content text-center error-page">
                            <p className="error-text font-weight-bold" style={{fontSize:'70px'}}>Welcome To LAMISPlus 2.0</p>
                            <h4 className="text-info" >
                                <i className="fa fa-thumbs-down text-info" /> Missing Facility
                            </h4>
                            <p style={{fontSize:'24px'}}>Kindly setup your facility </p>
                            <Card >
                                <CardBody>
                                    <Row >

                                        <Col md={4}>
                                            <FormGroup>
                                                <Label style={{fontWeight: "bold", fontSize: "16px", }} >Country</Label>
                                                <Select
                                                    required
                                                    isMulti={false}
                                                    //isClearable={true}
                                                    style={{border: "1px solid #014D88", borderRadius:"0.2rem"}}
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
                                                <Label style={{fontWeight: "bold", fontSize: "16px"}}>State</Label>
                                                <Select
                                                    required
                                                    //isMulti={false}
                                                    //isClearable={true}
                                                    onChange={getLgaByState}
                                                    options={states.sort().map((x) => ({
                                                        label: x.name,
                                                        value: x,
                                                    }))}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <Col md={4}>
                                            <FormGroup>
                                                <Label style={{fontWeight: "bold", fontSize: "16px"}}>LGA</Label>
                                                <Select
                                                    required
                                                    isMulti={false}
                                                    isClearable={true}
                                                    onChange={getFacilities}
                                                    options={lgas.sort().map((x) => ({
                                                        label: x.name,
                                                        value: x,
                                                    }))}
                                                />
                                            </FormGroup>
                                        </Col>
                                        <br/><br/>
                                        <br/><br/>
                                        <Col md={12}>
                                            <FormGroup>
                                                <Label for="Facility" style={{fontSize:'22px', fontWeight: "bold"}}>Assign Facilities</Label>
                                                <DualListBox
                                                    canFilter
                                                    options={facilities}
                                                    onChange={onFacilitySelect}
                                                    selected={selectedFacilities}
                                                />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <br/>
                                    {/*<Row >*/}
                                    {/*<Col md={4}>*/}
                                    {/*    <FormGroup>*/}
                                    {/*        <Label style={{fontWeight: "bold", fontSize: "16px"}}>Target Group</Label>*/}
                                    {/*        <Select*/}
                                    {/*            required*/}
                                    {/*            //isMulti={false}*/}
                                    {/*            //isClearable={true}*/}
                                    {/*            onChange={getTargetGroup}*/}
                                    {/*            options={targetGroup.map((x) => ({*/}
                                    {/*                label: x.display,*/}
                                    {/*                value: x.code,*/}
                                    {/*            }))}*/}
                                    {/*        />*/}
                                    {/*    </FormGroup>*/}
                                    {/*</Col>*/}
                                    {/*</Row>*/}

                                    <MatButton
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        className={classes.button}
                                        startIcon={<SaveIcon />}
                                        onClick={create}
                                        disabled={loading}
                                    >
                                        Save  {loading ? <Spinner /> : ""}
                                    </MatButton>

                                </CardBody>
                            </Card>

                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorMissingOrganisation;


