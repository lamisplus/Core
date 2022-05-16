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

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

const AssignFacilityModal = (props) => {
    const [loading, setLoading] = useState(false)
    const defaultValues = {name:""};
    const currentUser = props.user;
    const [formData, setFormData] = useState( defaultValues)
    const [facilities, setFacilities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [lgas, setLgas] = useState([]);
    const [selectedFacilities, setSelectedFacilities] = useState( [] );
    const classes = useStyles()

    const onFacilitySelect = (selectedValues) => {
        setSelectedFacilities(selectedValues);
    };

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
            .get(`${baseUrl}organisation-unit-levels/v2/1/organisation-units`)
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

    useEffect(() => {
        const y = props.user && props.user.applicationUserOrganisationUnits
            ? props.user.applicationUserOrganisationUnits.map((x) => (x.organisationUnitId)) : [];
        setSelectedFacilities(y);
    }, [props.user]);

    /* Get list of Facilities from the server - id is 4 
    old endpoint organisation-units/organisation-unit-level/4
    */

    useEffect(() => {
        async function getCharacters() {
            axios
                .get(`${baseUrl}organisation-unit-levels/v2/4/organisation-units`)
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

    const create = e => {
        e.preventDefault()
        setLoading(true);

        const data = selectedFacilities.map(x =>
        {
            return {applicationUserId: currentUser.id , organisationUnitId : x} });
        console.log(data);
        const onSuccess = () => {
            setLoading(false);
            toast.success("Facility assigned successfully!")

            props.toggleModal()
            window.location.reload(false);
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

        <div >
            <ToastContainer />
            <Modal isOpen={props.showModal} toggle={props.toggleModal} size="lg">

                <Form onSubmit={create}>
                    <ModalHeader toggle={props.toggleModal}> {props.formData && props.formData.id ? 'Reassign' : 'Assign'} user to a facility </ModalHeader>
                    <ModalBody>
                        <Card >
                            <CardBody>
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
                                    onClick={props.toggleModal}
                                    startIcon={<CancelIcon />}
                                >
                                    Cancel
                                </MatButton>

                            </CardBody>
                        </Card>
                    </ModalBody>

                </Form>
            </Modal>
        </div>
    );
}



export default connect(null, { createWard , updateWard})(AssignFacilityModal);
