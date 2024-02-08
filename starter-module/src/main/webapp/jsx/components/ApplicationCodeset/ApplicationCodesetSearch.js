import React, {useEffect, forwardRef} from 'react';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAll, deleteApplicationCodeset} from "./../../../actions/applicationCodeset";
import {
    Card,
    CardBody,  FormGroup,  Input,  Spinner,
} from 'reactstrap';
import { url as baseUrl } from "../../../api";
import axios from 'axios';
import FileSaver from "file-saver";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom'
import ButtonMui from "@material-ui/core/Button";
import {FaDownload, FaEye, FaPlus, FaUpload} from "react-icons/fa";
import NewApplicationCodeset from "./NewApplicationCodeset";
import SaveIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import PageTitle from "./../../layouts/PageTitle";
import { Button, Modal} from "react-bootstrap";

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {Icon, Label} from "semantic-ui-react";
import {MdModeEdit, MdPerson, MdDelete} from "react-icons/md";
import SplitActionButton from "../Button/SplitActionButton";
import ServerInstalled from '../../Utils/ServerInstalled';
// import EditIcon from "@material-ui/icons/Edit";
// import DeleteIcon from "@material-ui/icons/Delete";

const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))
const ApplicationCodesetSearch = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [deleting, setDeleting] = React.useState(false);
    const [importing, setImporting] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [showImportModal, setShowImportModal] = React.useState(false);
    const [currentCodeset, setCurrentCodeset] = React.useState(null);
    const [applicationCodesetImportedFile, setApplicationCodesetImportedFile] = React.useState(null);
    const toggleModal = () => setShowModal(!showModal)
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal)
    const toggleImportModal = () => setShowImportModal(!showImportModal)
    const classes = useStyles()
    const serverInstalled = ServerInstalled();

    useEffect(() => {
        loadApplicationCodeset()
    }, []); //componentDidMount

 const loadApplicationCodeset = () => {
     const onSuccess = () => {
         setLoading(false);
     };
     const onError = () => {
         setLoading(false);
     };
     props.fetchAll(onSuccess, onError);
    }

const processDelete = (id) => {
     setDeleting(true);
    const onSuccess = () => {
        setDeleting(false);
        toggleDeleteModal();
        toast.success("Application codeset deleted successfully!");
        loadApplicationCodeset();
    };
    const onError = () => {
        setDeleting(false);
        toast.error("Something went wrong, please contact administration");
    };
    props.delete(id, onSuccess, onError);
    }
    const openApplicationCodeset = (row) => {
        setCurrentCodeset(row);
        toggleModal();
    }

    const deleteApplicationCodeset = (row) => {
        setCurrentCodeset(row);
        toggleDeleteModal();
    }
    function actionItems(row){
        return  [
            {
                type:'link',
                name:'View',
                icon:<FaEye  size="22"/>,
                to:{}
            },
            {
                type:'button',
                name:'Edit',
                icon:<MdModeEdit size="20" color='#014d88' />,
                onClick:(() => openApplicationCodeset(row))
            },
            {
                type:'button',
                name:'Delete',
                icon:<MdDelete size="20" color='#014d88' />,
                onClick:(() => deleteApplicationCodeset( row))
            }
        ]
    }

    const exportApplicationCodeset = () => {
    axios
      .get(`${baseUrl}application-codesets/exportCsv`,
        { responseType: 'blob'}
      )
      .then((response) => {
        const responseData = response.data
        let blob = new Blob([responseData], { type: "application/octet-stream" });
        FileSaver.saveAs(blob, `Appplication-codeset.csv`);
      })
    }

    const importApplicationCodeset = () => {
        toggleImportModal()
    }
    const handleImportFileChange = (event) => {
        setApplicationCodesetImportedFile(event.target.files[0]);
    }

    const triggerImportApplicationCodeset = () => {
        setImporting(true);
        if (!applicationCodesetImportedFile) {
            toast.error("Please select a file to import");
            setImporting(false);
            return;
        }
        const formData = new FormData();
        formData.append('file', applicationCodesetImportedFile);
        axios.post(`${baseUrl}application-codesets/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            setImporting(false);
            toggleImportModal();
            toast.success("Application codeset imported successfully!");
            setApplicationCodesetImportedFile(null);
            loadApplicationCodeset();
        }).catch((error) => {
            // toggleImportModal();
            setImporting(false);
            toast.error("Failed to import application codesets, please contact administration");
        });
    }

    return (
        <div>
        <PageTitle activeMenu="Application Codeset List" motherMenu="Application Codeset" />
            <Card>
                <ToastContainer />
              <CardBody>
                   <div className={"d-flex justify-content-end"}>
                       
                        {serverInstalled && <ButtonMui variant="contained"
                          color="primary"
                          startIcon={<FaPlus size="10"/>}
                          onClick={() => openApplicationCodeset(null)}
                                   style={{backgroundColor:'#014d88', margin: '10px'}}
                        >
                            <span style={{textTransform: 'capitalize'}}>Add Codeset</span>
                        </ButtonMui>}
                        {!serverInstalled && <ButtonMui variant="contained"
                          color="primary"
                          startIcon={<FaUpload size="10"/>}
                          disabled={importing}
                          onClick={() => importApplicationCodeset()}
                                   style={{backgroundColor:'#014d88', margin: '10px'}}
                        >
                            <span style={{textTransform: 'capitalize'}}>{importing ? <Spinner /> : "Import Codeset"}</span>
                        </ButtonMui>}
                        {serverInstalled && <ButtonMui variant="contained"
                          color="primary"
                          startIcon={<FaDownload size="10"/>}
                          onClick={() => exportApplicationCodeset()}
                                   style={{backgroundColor:'#014d88', margin: '10px'}}
                        >
                            <span style={{textTransform: 'capitalize'}}>Export Codeset</span>
                        </ButtonMui>}

                    </div>
                    <MaterialTable
                    icons={tableIcons}
                        title="Find Codeset"
                        columns={[
                            {
                                title: "Group",
                                field: "Group",
                            },
                            { title: "Value", field: "display" },
                            { title: "Version", field: "version" },
                            { title: "Language", field: "language" },
                            //{ title: "Action", field: "action" },
                        ]}
                        isLoading={loading}
                        data={props.applicationCodesetList.map((row) => ({
                            Group: row.codesetGroup,
                            
                            display: row.display,
                            language: row.language,
                            version: row.version,
                            // action:
                            // <div>
                            //     <SplitActionButton actions={actionItems(row)} />
                            //    <Label as='a' color='blue' className="ms-1" size='mini' onClick={() => openApplicationCodeset(row)}>
                            //         <Icon name='pencil' /> Edit
                            //     </Label>
                            //
                            //     <Label as='a' color='red' onClick={() => deleteApplicationCodeset( row)} size='mini'>
                            //         <Icon name='trash' /> Delete
                            //     </Label>
                            //
                            // </div>

                        }))}

                        
                        //overriding action menu with props.actions
                        components={props.actions}
                        options={{
                            headerStyle: {
                                backgroundColor: "#014d88",
                                color: "#fff",
                                fontSize:'16px',
                                padding:'10px',
                                zIndex:'3',
                            },
                            searchFieldStyle: {
                                width : '250%',
                                margingLeft: '250px',
                            },
                            filtering: false,
                            exportButton: false,
                            searchFieldAlignment: 'left',
                            actionsColumnIndex: -1
                        }}
                    />
            </CardBody>

            <NewApplicationCodeset toggleModal={toggleModal} showModal={showModal} loadApplicationCodeset={loadApplicationCodeset} formData={currentCodeset}/>
            <Modal show={showDeleteModal}  size="md">
                    <Modal.Header toggle={props.toggleDeleteModal}>

                        <Modal.Title>Delete Global Variable -  {currentCodeset && currentCodeset.display ? currentCodeset.display : ""}</Modal.Title>
                        <Button
                            variant=""
                            className="btn-close"
                            onClick={toggleDeleteModal}
                        >

                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to proceed ?</p>
                    </Modal.Body>
                    <Modal.Footer>
                    <ButtonMui
                        type='button'
                        variant='contained'
                        color='primary'
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        disabled={deleting}
                        onClick={() => processDelete(currentCodeset.id)}
                    >
                        Delete  {deleting ? <Spinner /> : ""}
                    </ButtonMui>
                    <ButtonMui
                        variant='contained'
                        color='default'
                        onClick={toggleDeleteModal}
                        startIcon={<CancelIcon />}
                    >
                        Cancel
                    </ButtonMui>
                </Modal.Footer>
        </Modal>
        <Modal show={showImportModal}  size="lg">
                    <Modal.Header toggle={props.toggleDeleteModal}>

                        <Modal.Title>Import Application Codesets</Modal.Title>
                        <Button
                            variant=""
                            className="btn-close"
                            onClick={toggleImportModal}
                        >

                        </Button>
                        
                    </Modal.Header>
                    
                    <Modal.Body>
                            <div style={{marginBottom:"15px", fontSize:"14px"}}>Select Application Codeset CSV File</div>
                    {/* <FormGroup> */}
                            <Input
                                type='file'
                                name='importCodeset'
                                id='importCodeset'
                                accept='.csv'
                                placeholder='Select Codeset CSV file.'
                                // value={applicationCodesetImportedFile}
                                onChange={handleImportFileChange}
                                style={{ height: "40px", borderRadius: '5px', fontWeight: 'bolder' }}
                                required
                            />
                            {/* <span>{applicationCodesetImportedFile?.name}</span> */}
                        {/* </FormGroup> */}
                        <Modal.Footer>
                        <ButtonMui variant="contained"
                          color="primary"
                          startIcon={<FaUpload size="10"/>}
                          onClick={() => triggerImportApplicationCodeset()}
                                   style={{backgroundColor:'#014d88', margin: '10px'}}
                          disabled={deleting}
                        >
                            <span style={{textTransform: 'capitalize'}}>{importing ? <Spinner /> : "Import Codeset"}</span>
                        </ButtonMui>
                            <ButtonMui
                                variant='contained'
                                color='default'
                                onClick={toggleImportModal}
                                startIcon={<CancelIcon />}
                            >
                                Cancel
                            </ButtonMui>
                        </Modal.Footer>
                    </Modal.Body>

        </Modal>
        </Card>
    </div>
    );
}

const mapStateToProps = state => {

    return {
        applicationCodesetList: state.applicationCodesets.applicationCodesetList
    };
};

const mapActionToProps = {
    fetchAll: fetchAll,
    delete: deleteApplicationCodeset
};

export default connect(mapStateToProps, mapActionToProps)(ApplicationCodesetSearch);