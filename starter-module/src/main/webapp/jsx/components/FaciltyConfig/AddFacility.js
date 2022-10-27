import React, {useEffect, useState} from 'react';
import PageTitle from "../../layouts/PageTitle";
import {Link, useHistory} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {TiArrowBack} from "react-icons/ti";
import {Col, Form, FormGroup, Input, Label, Row, Spinner} from "reactstrap";
import {Card, CardContent,CardHeader} from "@material-ui/core";
import DualListBox from "react-dual-listbox";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import {url} from "../../../api";
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
function AddFacility(props) {
    let history = useHistory();
    const classes = useStyles();
    const [saving, setSaving] = useState(false);
    const [states, setStates]=useState([])
    const [lgas, setLGAs]=useState([])
    const [facilities, setFacilities]=useState([])

    const loadStates = () =>{
        axios.get(`${url}organisation-units/parent-organisation-units/1`).then((response)=>{
            if(response.data){
                setStates(response.data);
            }
        }).catch((e)=>{
            console.log("Fetch states error"+e)
        })
    }

    const loadLGA = (e) =>{
        axios.get(`${url}organisation-units/parent-organisation-units/${e.target.value}`).then((response)=>{
            if(response.data){
                setLGAs(response.data);
                setFacilities([]);
            }
        }).catch((e)=>{
            console.log("Fetch LGA error"+e)
        })
    }
    const loadFacilities = (e) =>{
        axios.get(`${url}organisation-units/parent-organisation-units/${e.target.value}`).then((response)=>{
            if(response.data){
                setFacilities(response.data)
            }
        }).catch((e)=>{
            console.log("Fetch Facilities error"+e)
        })
    }

    useEffect(() => {
        loadStates()

    }, []);
    
    
    return (
        <div>
            <PageTitle activeMenu="Configuration" motherMenu="Facility" />

            <Form >
                <Col xl={12} lg={12} md={12}>
                    <Card className={classes.cardBottom}>
                        <CardContent>
                            <Link to="/facility">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className=" float-end ms-2"
                                    startIcon={<TiArrowBack />}
                                    style={{backgroundColor:'#014d88'}}
                                >
                                    <span style={{ textTransform: "capitalize" }}>Back</span>
                                </Button>
                            </Link>
                            <br />

                            <br />
                                <Card>
                                    <CardContent>
                                        <Row>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>State</Label>
                                                    <Input
                                                        type="select"
                                                        name="parentOrganisationUnitLevelId"
                                                        id="parentOrganisationUnitLevelId"
                                                        style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder',appearance:'auto'}}
                                                        required
                                                        onChange={loadLGA}
                                                    >
                                                        <option>Select State</option>
                                                        {states.map((state ) => (
                                                            <option key={state.id} value={state.id}>
                                                                {state.name}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={6}>
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>LGA</Label>
                                                    <Input
                                                        type="select"
                                                        name="parentOrganisationUnitLevelId"
                                                        id="parentOrganisationUnitLevelId"
                                                        style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder',appearance:'auto'}}
                                                        required
                                                        onChange={loadFacilities}
                                                    >
                                                        <option>Select LGA</option>
                                                        {lgas.map((lga ) => (
                                                            <option key={lga.id} value={lga.id}>
                                                                {lga.name}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>

                                <Card style={{marginTop:'10px'}}>
                                    <CardContent>
                                        <Row>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>Facility</Label>
                                                    <Input
                                                        type="select"
                                                        name="parentOrganisationUnitLevelId"
                                                        id="parentOrganisationUnitLevelId"
                                                        style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder',appearance:'auto'}}
                                                        required
                                                    >
                                                        <option>Select Facility</option>
                                                        {facilities.map((facility ) => (
                                                            <option key={facility.id} value={facility.id}>
                                                                {facility.name}
                                                            </option>
                                                        ))}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>MFL Code</Label>
                                                    <Input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        disabled={true}
                                                        style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px'}}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col md={4}>
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>Datim UID</Label>
                                                    <Input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px'}}
                                                        required
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                </Card>




                            {saving ? <Spinner /> : ""}
                            <br />
                            <MatButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<SaveIcon />}
                                disabled={saving}
                                style={{backgroundColor:'#014d88'}}
                            >
                                {!saving ? (
                                    <span style={{ textTransform: "capitalize" }}>Save</span>
                                ) : (
                                    <span style={{ textTransform: "capitalize" }}>Saving...</span>
                                )}
                            </MatButton>

                            <MatButton
                                variant="contained"
                                className={classes.button}
                                startIcon={<CancelIcon style={{color:'#fff'}} />}
                                style={{backgroundColor:'#992E62'}}

                            >
                                <span style={{ textTransform: "capitalize",color:'#fff' }}>Cancel</span>
                            </MatButton>

                        </CardContent>
                    </Card>
                </Col>
            </Form>
        </div>
    );
}

export default AddFacility;