import React, {useState, useEffect} from 'react';
import { Form,Row,Col,FormGroup,Label,Input,Card,CardBody} from 'reactstrap';
import { connect } from 'react-redux';
import {  Modal,  Button } from "react-bootstrap";
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { url as baseUrl } from "../../../api";
import { createApplicationCodeset, updateApplicationCodeset } from './../../../actions/applicationCodeset';
import { Spinner } from 'reactstrap';
import Select from "react-select/creatable";
import axios from 'axios';


const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

const ModalSample = (props) => {
    const [loading, setLoading] = useState(false)
    const [showNewCodesetGroup, setShowNewCodesetGroup] = useState(false)
    const [showNewAltCode, setShowNewAltCode] = useState(false)
    const defaultValues = {display:"", language:"", version:"", codesetGroup:""};
    const [formData, setFormData] = useState( defaultValues)
    const [disabled, setDisabled] = useState(false)
    const classes = useStyles()

    useEffect(() => {
        //for application codeset edit, load form data
        if (props.altCode) {
            GetCodesetByCode(props.altCode)
            setDisabled(true)
        } else{
            setFormData(props.formData ? props.formData : defaultValues);
        }
        setShowNewCodesetGroup(false);
    }, [props.formData,  props.showModal, props.altCode]);

    const handleInputChange = e => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
    }

    const GetCodesetByCode = (code) => {
        axios
            .get(`${baseUrl}application-codesets/code/${code}`
            )
            .then((response) => {
                setFormData(response.data)
            })
    }

    const handleCodesetGroupChange = (newValue) => {
        setFormData ({ ...formData, codesetGroup: newValue.value});
    };

    const handleAltCodeChange = (newValue) => {
        setFormData ({ ...formData, altCode: newValue.value});
    };


    const createGlobalVariable = e => {
        e.preventDefault()
            setLoading(true);

            const onSuccess = () => {
                setLoading(false);
                toast.success("Application codeset saved successfully!")
                props.loadApplicationCodeset();
                props.toggleModal()
            }
            const onError = () => {
                setLoading(false);
                //toast.error("Something went wrong, please contact administration");
                //props.toggleModal()
            }
            if(formData.id){
                props.updateApplicationCodeset(formData.id, formData, onSuccess, onError)
                return
            }
            props.createApplicationCodeset(formData, onSuccess,onError)

    }
    return (

        <div >
            <ToastContainer />
            <Modal show={props.showModal}  size="lg">

                <Form onSubmit={createGlobalVariable}>
                    <Modal.Header toggle={props.toggleModal}> 
                    <Modal.Title style={{color:'#014d88',fontWeight:'bolder'}}>{props.formData && props.formData.id ? 'Edit' : 'New'} Application Codeset </Modal.Title>
                    <Button
                      variant=""
                      className="btn-close"
                      onClick={props.toggleModal}
                    ></Button>
                    </Modal.Header>
                    <Modal.Body>
                        <Card >
                            <CardBody>
                                <Row >
                                    <Col md={12}>
                                        {!showNewCodesetGroup ?
                                            <FormGroup>
                                                <Label style={{color:'#014d88',fontWeight:'bolder'}}>Codeset Group <span style={{cursor: "pointer", color: "blue"}}
                                                                           onClick={() => setShowNewCodesetGroup(true)}> ( or Click to create new codeset group)</span></Label>
                                                <Select
                                                    required
                                                    name="cg"
                                                    id="cg"
                                                    isOptionDisabled={option => formData.id ? option.value !== formData.codesetGroup : false}
                                                    isMulti={false}
                                                    onChange={handleCodesetGroupChange}
                                                    style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder',appearance:'auto'}}
                                                    options={props.applicationCodesetList ? Array.from(new Set(props.applicationCodesetList.map(x => x.codesetGroup))).sort().map(codesetGroup => ({
                                                        value: codesetGroup,
                                                        label: codesetGroup
                                                    })) : []}
                                                    value={formData.codesetGroup ? {
                                                        value: formData.codesetGroup,
                                                        label: formData.codesetGroup
                                                    } : ""}
                                                    isLoading={false}

                                                />
                                            </FormGroup> :
                                            <FormGroup>
                                                <Label style={{color:'#014d88',fontWeight:'bolder'}}>Codeset Group <span style={{cursor: "pointer", color: "blue"}}
                                                                           onClick={() => setShowNewCodesetGroup(false)}> ( or Click to pick from existing codeset group)</span></Label>
                                                <Input
                                                    type='text'
                                                    name='codesetGroup'
                                                    disabled={disabled}
                                                    id='codesetGroup'
                                                    placeholder='Enter new codeset group'
                                                    value={formData.codesetGroup}
                                                    onChange={handleInputChange}
                                                    style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder'}}
                                                    required
                                                />
                                            </FormGroup>

                                        }
                                    </Col>
                                    <Col md={12}>
                                        <FormGroup>
                                            <Label style={{color:'#014d88',fontWeight:'bolder'}}>Name</Label>
                                            <Input
                                                type='text'
                                                name='display'
                                                disabled={disabled}
                                                id='display'
                                                placeholder=' '
                                                value={formData.display}
                                                onChange={handleInputChange}
                                                style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder'}}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={12}>
                                        <FormGroup>
                                            <Label style={{color:'#014d88',fontWeight:'bolder'}}>Language</Label>
                                            <Input
                                                type='text'
                                                disabled={disabled}
                                                name='language'
                                                id='language'
                                                placeholder=' '
                                                value={formData.language}
                                                onChange={handleInputChange}
                                                style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder'}}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col md={12}>
                                        <FormGroup>
                                            <Label style={{color:'#014d88',fontWeight:'bolder'}}>Version</Label>
                                            <Input
                                                type='text'
                                                disabled={disabled}
                                                name='version'
                                                id='version'
                                                placeholder=' '
                                                value={formData.version}
                                                onChange={handleInputChange}
                                                style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder'}}
                                                required
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col md={12}>
                                        {!showNewAltCode ?
                                            <FormGroup>
                                                <Label style={{color:'#014d88',fontWeight:'bolder'}}>Alternate Codeset <span style={{cursor: "pointer", color: "blue"}}
                                                                           onClick={() => setShowNewAltCode(true)}> ( or Click to create new alternate codeset)</span></Label>
                                                <Select
                                                    required
                                                    name="cg"
                                                    id="cg"
                                                    isMulti={false}
                                                    onChange={handleAltCodeChange}
                                                    style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder',appearance:'auto'}}
                                                    options={props.applicationCodesetList ? Array.from(new Set(props.applicationCodesetList.map(x => x.altCode))).sort().map(altCode => ({
                                                        value: altCode,
                                                        label: altCode
                                                    })) : []}
                                                    isOptionDisabled={option => disabled}
                                                    value={formData.altCode ? {
                                                        value: formData.altCode,
                                                        label: formData.altCode
                                                    } : ""}
                                                    isLoading={false}

                                                />
                                            </FormGroup> :
                                            <FormGroup>
                                                <Label style={{color:'#014d88',fontWeight:'bolder'}}>Alternate Codeset <span style={{cursor: "pointer", color: "blue"}}
                                                                           onClick={() => setShowNewAltCode(false)}> ( or Click to pick from existing codesets)</span></Label>
                                                <Input
                                                    type='text'
                                                    disabled={disabled}
                                                    name='altCode'
                                                    id='altCode'
                                                    placeholder='Enter new alternate code'
                                                    value={formData.altCode}
                                                    onChange={handleInputChange}
                                                    style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder'}}
                                                    required
                                                />
                                            </FormGroup>

                                        }
                                    </Col>
                                </Row>

                                <MatButton
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                    style={{backgroundColor:'#014d88'}}
                                >
                                    Save  {loading ? <Spinner /> : ""}
                                </MatButton>
                                <MatButton
                                    variant='contained'
                                    className={classes.button}
                                    color='default'
                                    onClick={props.toggleModal}
                                    startIcon={<CancelIcon style={{color:'#fff'}} />}
                                    style={{backgroundColor:'#992E62',color:'#fff'}}
                                >
                                    Cancel
                                </MatButton>

                            </CardBody>
                        </Card>
                    </Modal.Body>

                </Form>
            </Modal>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        applicationCodesetList: state.applicationCodesets.applicationCodesetList
    };
};

export default connect(mapStateToProps, { createApplicationCodeset , updateApplicationCodeset})(ModalSample);
