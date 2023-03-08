import React, { useState, useEffect} from 'react';
import PageTitle from "../../layouts/PageTitle";
import { makeStyles } from '@material-ui/core/styles'
import {Link, useHistory} from 'react-router-dom';
import MatButton from '@material-ui/core/Button'
import { TiArrowBack} from 'react-icons/ti';
import 'react-widgets/dist/css/react-widgets.css'
import { connect, useDispatch } from 'react-redux';
import { Alert, AlertTitle } from '@material-ui/lab';
import { DropzoneArea } from 'material-ui-dropzone';
//Stepper
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Table } from 'reactstrap';
import { Button as ButtonSematic} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import OverlayLoader from 'react-overlay-loading/lib/OverlayLoader'
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import {CardBody,Col,Row, Form} from 'reactstrap'
import { Card, CardContent } from "@material-ui/core";
import { url } from "./../../../api";
import { createBootstrapModule, startBootstrapModule } from './../../../actions/bootstrapModule';
import { updateBootstrapModule, fetchAllBootstrapModuleBYBatchNum } from './../../../actions/bootstrapModule';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import _ from "lodash";

//import RestartingApp from "./RestartModule";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        "& .MuiStepIcon-active": { color: "#014d88" },
        "& .MuiStepIcon-completed": { color: "green" },
        "& .Mui-disabled .MuiStepIcon-root": { color: "#992E62" },
        "& .MuiStepLabel-label.MuiStepLabel-active":{ color: "#014d88", fontSize:'14px' },
        "& .MuiStepLabel-label":{ color: "#992E62", fontSize:'14px' },
        "& .MuiDropzoneArea-icon":{ color: "#992E62", fontSize:'24px',width:'150px',height:'150px' },
        "& .MuiDropzoneArea-text":{ color: "#992E62", fontSize:'24px' }
    },
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    backButton: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
}));


function getSteps() {
    return ['Upload', 'Install'];
}

const BootstrapModule = (props) => {
    let history = useHistory();
    const classes = useStyles()
    const [timesession, setTimesession] = useState('July 27th - Auguts 27th, 2021');
    const [postModal, setPostModal] = useState(false);
    const [contacts, setContacts] = useState();
    // delete data
    const handleDeleteClick = (contactId) => {
        const newContacts = [...contacts];
        const index = contacts.findIndex((contact)=> contact.id === contactId);
        newContacts.splice(index, 1);
        setContacts(newContacts);
    }
    //Add data
    const [addFormData, setAddFormData ] = useState({
        Cust_Id:'',
        Date_Join:'',
        Cust_Name:'',
        Location:'',
        image:'',
    });

    const [editModal, setEditModal] = useState(false);

    // Edit function editable page loop
    const [editContactId, setEditContactId] = useState(null);

    // Edit function button click to edit
    const handleEditClick = ( event, contact) => {
        event.preventDefault();
        setEditContactId(contact.id);
        const formValues = {
            Cust_Id: contact.Cust_Id,
            Date_Join: contact.Date_Join,
            Cust_Name: contact.Cust_Name,
            Location: contact.Location,
            image: contact.image,
        }
        setEditFormData(formValues);
        setEditModal(true);
    };


    // edit  data
    const [editFormData, setEditFormData] = useState({
        Cust_Id:'',
        Date_Join:'',
        Cust_Name:'',
        Location:'',
        image:'',
    })

    const apiURl = url + "module/";

    const dispatch = useDispatch();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
    const [fileToUpload, setFileToUpload] = useState({})
    const [uploadResponse, setUploadResponse] = React.useState([])
    const [uploadModuleList, setUploadModuleList] = React.useState({})
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const [disableNextButtonProcess, setDisableNextButtonProcess] = React.useState(true);
    const [installationMessage, setInstallationMessage] = useState();
    const [installationOverlay, setInstallationOverlay] = useState(false)
    const [uploadButton, setUploadButton] = useState(false)
    const [uploadButtonhidden, setuploadButtonhidden] = useState(false)
    const [buttonStatus, setButtonStatus] = useState(true)
    const [hiddeStartModuleFinishButton, sethiddeStartModuleFinishButton] = useState(true)
    const [modal, setModal] = useState(false)//modal to View
    const toggleModal = () => setModal(!modal)
    const [collectModal, setcollectModal] = useState([])//
    const [disabledUploadButton, setDisabledUploadButton] = useState(false)
    const [disabledNextButton, setDisabledNextButton] = useState(false)
    const [moduleStatus, setModuleStatus] = useState()
    const [moduleBatchNum, setModuleBatchNum] = useState()
    const [restartmodal, setRestartModal] = useState(false) //Modal
    const toggleRestartModal = () => setRestartModal(!restartmodal);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onSuccess = (data) => {
            //setUploadResponse(data)
            setUploadModuleList(data)
        }
        const onError = () => {}
        //props.fetchAllBootstrapModuleBYBatchNum(moduleStatus,moduleBatchNum, onSuccess,onError)

    }, [moduleStatus,moduleBatchNum]); //componentDidMount

    const restartingModule  = () => {
        axios.get(`restart`)
        .then((response) => {
            handleClose()
            toast.error(`Successfully restarting`);
        }).catch((error) => {
            console.log(error);
            toast.error(`An error occurred, restarting`);
        });
/*        alert('restarting');
        //setRestartModal(!restartmodal)*/
    }

    const handleModuleBatchList = (moduleStatus,moduleBatchNum) => {
        const onSuccess = (data) => {

            setUploadResponse([data])
            setActiveStep((prevActiveStep) => prevActiveStep + 1); //auotmatically move to the next phase of installation in the wizard
        }
        const onError = () => {}
        props.fetchAllBootstrapModuleBYBatchNum(moduleStatus,moduleBatchNum, onSuccess,onError)
    }

    const handleNext = async e => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        if(activeStep === 1 && steps[2] === 'Start module'){
            sethiddeStartModuleFinishButton(false)
            setDisableNextButtonProcess(true)
        }

    };
    const handleBack = () => {
        setDisabledUploadButton(false)
        setuploadButtonhidden(false)
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const startModule = () => {
        const onSuccess = () => {
            setTimeout(() => {
                history.push(`/bootstrap-modules`)
            }, 1000)
        }
        const onError = () => {}
        props.startBootstrapModule( onSuccess, onError);
    }
    const handleClickOpen = () => {

    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleInstallModule = (obj) => {

        setDisabledNextButton(true)
        setInstallationOverlay(true)
        setDisableNextButtonProcess(true)
        const onSuccess = (installResponse) => {
            const installModuleDetail = installResponse
            // var foundIndex = uploadResponse.findIndex(x => x.batchNo == installModuleDetail.batchNo);
            //uploadResponse[foundIndex] = installModuleDetail
            setDisabledNextButton(false)
            setInstallationOverlay(false)
            setDisableNextButtonProcess(false)
            //window.location.href = "bootstrap-modules";
            //history.push(`/bootstrap-modules`)
            setOpen(true);

        }
        const onError = () => {
            setDisabledNextButton(false)
            setInstallationOverlay(false)
            setDisableNextButtonProcess(false)
        }
        props.updateBootstrapModule(obj, onSuccess, onError);
    }

    const handleUploadFile = async e => {
        if(fileToUpload[0]){
            setDisabledUploadButton(true)
            setDisableNextButtonProcess(true)
            setInstallationMessage('Processing, please wait...')
            const form_Data = new FormData();
            form_Data.append('file', fileToUpload[0]);

            try {
                const res = await axios.post(url+'modules/upload', form_Data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },

                    onUploadProgress: progressEvent => {
                        setUploadPercentage(
                            parseInt(
                                Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            )
                        );
                        // Clear percentage
                        setTimeout(() => setUploadPercentage(0), 10000);
                    }
                });

                const { fileName, filePath } = res.data;
                setUploadedFile({ fileName, filePath });
                setMessage('File Uploaded');
                setUploadResponse(res.data===null ? {} :res.data)
                setuploadButtonhidden(true)
                setDisableNextButtonProcess(false) //Enable the next process button for the next stage
                setInstallationMessage('')
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } catch (err) {
                console.log(err)
                if (err.response && err.response.status === 500) {
                    setDisabledUploadButton(false)
                    setMessage('There was a problem in uploading file! please try again...');
                } else if(err.response && err.response.status === 400){
                    setDisabledUploadButton(false)
                    setMessage('Something went wrong! please try again...');
                    //setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }else{
                    setDisabledUploadButton(false)
                    setMessage('Something went wrong! please try again...');
                }
            }
        }else{
            setMessage('Please upload a jar file');
        }
    }

    const handleStartModule = () => {
        history.push(`/bootstrap-modules`)

    }


    const sampleAction = (obj) =>{
        return (
            <ButtonSematic content='Update Module' labelPosition='left' icon='cogs' primary  size='mini' compact onClick={() => handleInstallModule(obj)}/>
        )
    }



    function getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (
                    <Form enctype="multipart/form-data">
                        <Card className="mb-12">
                            <CardBody>
                                <br />
                                
                                <Row>
                                    <Col sm={12}>
                                        {message ? <Message msg={message} /> : null}
                                        <DropzoneArea
                                            //onChange={(files) => console.log('Files:', files)}
                                            onChange = {(file) => setFileToUpload(file)}
                                            showFileNames="true"
                                            //acceptedFiles={['jar']}
                                            maxFileSize ={'1000000000000000000'}

                                        />
                                    </Col>

                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <Progress percentage={uploadPercentage} />
                                        <br/>
                                        <strong>{installationMessage}</strong>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Form>
                );
            case 1:
                return (
                    <>
                        <ToastContainer autoClose={3000} hideProgressBar />
                       
                        <Card className="mb-12">
                            <CardBody>
                                <br />
                                <Row>
                                    <Col>
                                        <OverlayLoader
                                            color={'red'} // default is white
                                            loader="ScaleLoader" // check below for more loaders
                                            text="Installing... please wait!"
                                            active={installationOverlay}
                                            backgroundColor={'black'} // default is black
                                            opacity=".4" // default is .9
                                        >
                                            {uploadResponse.type==='ERROR'? 
                                   <>
                                    <Alert severity="error">
                                      <AlertTitle>
                                        <b>{uploadResponse.message}</b>
                                      </AlertTitle>
                                    </Alert>
                                   </> 
                                   : 
                                   <>
                                   <Alert severity="success">
                                      <AlertTitle>
                                        <b>No dependecy issue</b>
                                      </AlertTitle>
                                    </Alert>
                                   </>
                                   }
                                   <br/>
                                    <Table striped>
                                        <thead style={{  backgroundColor:'#014d88', color:'#ffffff', height:"5px !important" }}>
                                        <tr style={{ height:"5px !important" }}>

                                            <th style={{padding:'15px 10px'}}>Module Name</th>
                                            <th style={{padding:'15px 10px'}}>Description</th>
                                            <th style={{padding:'15px 10px'}}>Version</th>
                                            <th style={{padding:'15px 10px'}}>Status</th>
                                            <th style={{padding:'15px 10px'}}>Action</th>
                                        </tr>
                                        </thead>
                                        <tbody>

                                        {[uploadResponse].map((row) => (
                                            <tr key={row.id}>
                                                <td>{row.name===""?" ":row.name}</td>
                                                <td>{row.description===""?" ":row.description}</td>

                                                <td>{row.version===""?" ":row.version}</td>
                                                <td>{row.status!==2 ? "Uploaded":"Uploaded"}</td>
                                                <td>
                                                    {row.type==='ERROR'? 
                                                    ( <ButtonSematic content="Can't Install" labelPosition='left' icon='fork' color='red' size='mini' compact />)
                                                    : sampleAction(row)}
                                                </td>
                                            </tr>

                                        ))
                                        }

                                        </tbody>
                                    </Table>
                                        </OverlayLoader>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </>
                );
            case 2:
                return (
                    <>
                        <Alert color="info">
                            <Typography className={classes.instructions}>
                                <span style={{ fontWeight: 'bold'}}>Starting this module wil restart the application and all scheduled tasked
                                and background processes will be interupted. <br/>Do you want to Proceed?</span>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                <br/>
                            </Typography>
                        </Alert>
                        <br/>
                        <br/>
                        <Table striped>
                            <thead style={{  backgroundColor:'#9F9FA5' }}>
                            <tr>

                                <th>Module Name</th>
                                <th>Description</th>
                                <th>Version</th>
                                <th>Status</th>

                            </tr>
                            </thead>
                            <tbody>
                            {[uploadResponse].map((row) => (
                                <tr key={row.id}>
                                    <td>{row.name===""?" ":row.name}</td>
                                    <td>{row.description===""?" ":row.description}</td>
                                    <td>{row.version===""?" ":row.version}</td>
                                    <td>{row.status!==2 ? "":"Installed"}</td>

                                </tr>

                            ))
                            }

                            </tbody>
                        </Table>
                    </>
                );
            default:
                return 'Unknown';
        }
    }


    return(
        <>
            <PageTitle
                motherMenu="Bootstrap"
                activeMenu="Update Module"
                pageContent="Update Module"
            />
            <Link
                to ={{
                    pathname: "/bootstrap-modules",
                    activetab: 1
                }}
            >
                <MatButton
                    type='submit'
                    variant="contained"
                    className="me-2 float-end"
                    style={{backgroundColor:'#992E62',color:'#fff',marginTop:'-20px',marginRight:'10px', fontSize:'18px',width:'110px'}}
                >
                    <TiArrowBack/>{" "} Back
                </MatButton>
            </Link>
            <br/><br/>
            <Card className={classes.cardBottom} style={{marginTop:'-10px'}}>
                <CardContent>
                    <br/>
                    <Row>
                        <Col>
                            <h3 style={{color:'#014d88', fontWeight:'bold'}}>Update Module</h3>
                            <Card className="mb-12">
                                <CardBody>

                                    <div className={classes.root}>
                                        <Stepper activeStep={activeStep} alternativeLabel>
                                            {steps.map((label) => (
                                                <Step key={label}>
                                                    <StepLabel>{label}</StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>
                                        <div>
                                            {activeStep === steps.length ? (
                                                <div>
                                                    <Alert color="info">
                                                        <Typography className={classes.instructions}>All steps completed</Typography>
                                                    </Alert>
                                                    <br/>
                                                    <br/>
                                                    <Button variant="contained"
                                                            onClick={handleReset}
                                                            color="secondary">
                                                        Reset/Cancel
                                                    </Button>

                                                </div>
                                            ) : (
                                                <div>
                                                    <Typography className={classes.instructions}>
                                                        {getStepContent(activeStep)}

                                                    </Typography>
                                                    <div>
                                                        <Button
                                                            disabled={activeStep === 0}
                                                            onClick={handleBack}
                                                            className={classes.backButton}
                                                            hidden={!uploadButtonhidden}
                                                            variant="contained"
                                                            style={{backgroundColor:'#992E62',color:'#fff'}}
                                                        >
                                                            Previous
                                                        </Button>

                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            onClick={handleUploadFile}
                                                            hidden={uploadButtonhidden}
                                                            disabled={disabledUploadButton}
                                                            style={{backgroundColor:'#014d88',color:'#fff'}}
                                                        >
                                                            Upload Module
                                                        </Button>

                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </CardContent>
            </Card>
            <Dialog open={open} >
                <DialogTitle style={{backgroundColor:'#014d88',color:'#fff',textAlign:'center', fontSize:'28px'}}>Restart LAMISPlus</DialogTitle>
                <DialogContent style={{width:'850px',height:'250px',padding:'0px'}}>
                    <DialogContentText style={{fontSize:'24px',color:'#992E62',fontWeight:'bold', width:'600px',height:'250px',border:'10px solid #fff',textAlign:'center',justifyContent:'center',display:'flex',alignItems:'center'}}>
                        Kindly restart LAMISPlus to effect the update
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{backgroundColor:'#014d88',color:'#fff'}}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={restartingModule}
                        style={{color:'#014d88',backgroundColor:'#fff'}}
                    >
                        Restart
                    </Button>

                    <Link
                        to ={{
                            pathname: "/bootstrap-modules",
                            activetab: 1
                        }}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            style={{backgroundColor:'#992E62',color:'#fff',marginLeft:"20px"}}
                        >
                            Close
                        </Button>
                    </Link>

                </DialogActions>
            </Dialog>

        </>
    );
}

const mapStateToProps = state => {
    return {
        moduleLists: state.boostrapmodule.moduleList
    };
};

export default connect(mapStateToProps, { createBootstrapModule, updateBootstrapModule, startBootstrapModule, fetchAllBootstrapModuleBYBatchNum})(BootstrapModule);
