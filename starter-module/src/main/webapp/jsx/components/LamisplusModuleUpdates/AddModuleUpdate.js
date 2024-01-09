import React, {useEffect, useState} from 'react';
import PageTitle from "../../layouts/PageTitle";
import {Link,} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {TiArrowBack} from "react-icons/ti";
import {Col, Form, FormGroup, Input, Label, Row, Spinner} from "reactstrap";
import {Card, CardContent,} from "@material-ui/core";
// import DualListBox from "react-dual-listbox";
import MatButton from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import {url as baseUrl} from "../../../api";
import { toast} from "react-toastify";
import {useHistory} from "react-router-dom";


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

function AddOrganization(props) {
    const history = useHistory();
    const classes = useStyles();
    const [saving, setSaving]= useState(false)
    const [objValues, setObjValues] = useState({name:"", description:""});
    const [errors, setErrors] = useState({});
    useEffect(() => {

    }, []);

    const handleInputChange = e => { 
        setErrors({...errors, [e.target.name]: ""})  
        setObjValues ({...objValues,  [e.target.name]: e.target.value});
    } 
    const validate = () => {
        let temp = { ...errors }
        temp.name = objValues.name ? "" : "This field is required"
        temp.description = objValues.description ? "" : "This field is required"
        //temp.datereferred = objValues.datereferred ? "" : "This field is required"
        setErrors({
            ...temp
            })    
        return Object.values(temp).every(x => x === "")
    }
    /**** Submit Button Processing  */
    const handleSubmit = (e) => {        
        e.preventDefault();
        if(validate()){
            setSaving(true);

            axios.post(`${baseUrl}central-lamisplusadd-organisation`,objValues)
                .then(response => {
                    setSaving(false);
                    toast.success("Record save successful", {position: toast.POSITION.TOP});
                    history.push({
                        pathname: '/organization',
                      });
                })
                .catch(error => {
                    setSaving(false);
                    if(error.response && error.response.data){
                    let errorMessage = error.response.data.apierror && error.response.data.apierror.message!=="" ? error.response.data.apierror.message :  "Something went wrong, please try again";
                    if(error.response.data.apierror){
                        toast.error(error.response.data.apierror.message , {position: toast.POSITION.BOTTOM_CENTER});
                    }else{
                        toast.error(errorMessage, {position: toast.POSITION.BOTTOM_CENTER});
                    }
                }else{
                    toast.error("Something went wrong, please try again...", {position: toast.POSITION.BOTTOM_CENTER});
                }
                });
            }
    }          
        
    
    return (
        <div>
            <PageTitle activeMenu="Module Update" motherMenu="Add LAMISPlus " />

            <Form >
                <Col xl={12} lg={12} md={12}>
                    <Card className={classes.cardBottom}>
                        <CardContent>
                            <Link to="/lamisplus-module-update">
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

                                <Card style={{marginTop:'10px'}}>
                                    <CardContent>
                                        <Row>
                                            <Col md={6} className=" mb-3 ">
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>Module Name <span style={{ color:"red"}}> *</span></Label>
                                                    <Input
                                                        type="text"
                                                        name="name"
                                                        id="name"
                                                        onChange={handleInputChange}
                                                        style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                                        required
                                                    />
                                                    {errors.name !=="" ? (
                                                        <span className={classes.error}>{errors.name}</span>
                                                    ) : "" } 
                                                </FormGroup>
                                            </Col>
                                            <Col md={6} className=" mb-3 ">
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>Module Version </Label>
                                                    <Input
                                                        type="text"
                                                        name="description"
                                                        id="description"
                                                        onChange={handleInputChange}
                                                        style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                                        required
                                                    />
                                                    {errors.description !=="" ? (
                                                        <span className={classes.error}>{errors.description}</span>
                                                    ) : "" } 
                                                </FormGroup>
                                            </Col>
                                            <Col md={6} className=" mb-3 ">
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>Release Date</Label>
                                                    <Input
                                                        type="text"
                                                        name="description"
                                                        id="description"
                                                        onChange={handleInputChange}
                                                        style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                                        required
                                                    />
                                                    {errors.description !=="" ? (
                                                        <span className={classes.error}>{errors.description}</span>
                                                    ) : "" }
                                                </FormGroup>
                                            </Col>
                                            <Col md={6} className=" mb-3 ">
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>Release Note</Label>
                                                    <Input
                                                        type="text"
                                                        name="description"
                                                        id="description"
                                                        onChange={handleInputChange}
                                                        style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                                        required
                                                    />
                                                    {errors.description !=="" ? (
                                                        <span className={classes.error}>{errors.description}</span>
                                                    ) : "" }
                                                </FormGroup>
                                            </Col>
                                            <Col md={6} className=" mb-3 ">
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>Module URL</Label>
                                                    <Input
                                                        type="text"
                                                        name="description"
                                                        id="description"
                                                        onChange={handleInputChange}
                                                        style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                                        required
                                                    />
                                                    {errors.description !=="" ? (
                                                        <span className={classes.error}>{errors.description}</span>
                                                    ) : "" }
                                                </FormGroup>
                                            </Col>
                                            <Col md={6} className="mb-3">
                                                <FormGroup>
                                                    <Label for="" style={{color:'#014d88',fontWeight:'bolder'}}>Previous Version </Label>
                                                    <Input
                                                        type="text"
                                                        name="description"
                                                        id="description"
                                                        onChange={handleInputChange}
                                                        style={{border: "1px solid #014D88",borderRadius:"0.2rem"}}
                                                        required
                                                    />
                                                    {errors.description !=="" ? (
                                                        <span className={classes.error}>{errors.description}</span>
                                                    ) : "" }
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardContent>
                                    {saving ? <Spinner /> : ""}
                            <br />
                            <MatButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<SaveIcon />}
                                onClick={handleSubmit}
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
                        </Card>






                        </CardContent>
                    </Card>
                </Col>
            </Form>
        </div>
    );
}

export default AddOrganization;