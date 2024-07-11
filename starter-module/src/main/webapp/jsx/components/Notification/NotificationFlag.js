import React, { useEffect, forwardRef, useState } from 'react';
import { Form, Row, Col, FormGroup, Input, Card, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { Modal, Button } from "react-bootstrap";
import MatButton from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table';
// import SaveIcon from '@material-ui/icons/Save'
import SaveIcon from "@material-ui/icons/Delete";
import CancelIcon from '@material-ui/icons/Cancel'
import { ToastContainer, toast } from "react-toastify";
import SplitActionButton from "../Button/SplitActionButton";
import { FaDownload, FaEye, FaPlus, FaUpload } from "react-icons/fa";
import { Icon, Label } from "semantic-ui-react";
import { MdModeEdit, MdPerson, MdDelete } from "react-icons/md";

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
import PageTitle from "../../layouts/PageTitle";

import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";

import { createApplicationCodeset, updateApplicationCodeset } from '../../../actions/applicationCodeset';
import { Spinner } from 'reactstrap';
import Select from "react-select/creatable";
import axios from 'axios';
import { url as baseUrl, token } from '../../../api';
import ButtonMui from "@material-ui/core/Button";
import { authentication } from '../../../_services/authentication';
import NewNotificationConfigModal from './NewNotificationModal';
import PatientFlagCreation from './PatientFlagModal';


const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))

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
let rowNum = 0;

const NotificationFlag = (props) => {
    const [notificationConfigList, setNotificationConfigList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreationModal, setShowCreationModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [hasAdminReadRole, setHasAdminReadRole] = useState(false);
    const [hasAdminWriteRole, setHasAdminWriteRole] = useState(false);
    const [modal, setModal] = useState(false);

    const toggleModal = () => {
        setShowCreationModal(!showCreationModal)
    }

    const loadAdminReadWriteRoles = () => {
        const hasAdminReadRole = authentication?.userHasRole(['admin_read']);
        const hasAdminWriteRole = authentication?.userHasRole(['admin_write']);
        setHasAdminReadRole(hasAdminReadRole);
        setHasAdminWriteRole(hasAdminWriteRole);
    }

    const fetchNotificationConfigs = () => {
        axios.get(`${baseUrl}patient-flag/patient-flag-configs`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            setNotificationConfigList(typeof response.data === 'object' ? response.data : [])
        })
    }

    useEffect(() => {
        fetchNotificationConfigs();
        loadAdminReadWriteRoles();
    }, [])

    const openNotificationConfigCreationModal = (row) => {
        if (row === null) {
            setSelectedNotification(null);
            setShowCreationModal(true);
        } else {
            setSelectedNotification(row);
            setShowCreationModal(true);
        }

    }

    const openNotificationConfigDeletionModal = (row) => {
        axios
            .delete(`${baseUrl}patient-flag/${row.id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                setModal(false)
                fetchNotificationConfigs()
                toast.success("Patient Flag successfully deleted...")
            })
            .catch(error => {
                console.log(error)
                 }
     
             );
  
    }

    const deleteNotificationModal = (row) => {
        rowNum = row.id;
        setSelectedNotification(row)
        setModal(!modal);
        
    
      };

    function actionItems(row) {
        return [
            {
                type: 'link',
                name: 'View',
                icon: <FaEye size="22" />,
                to: {}
            },
            {
                type: 'button',
                name: 'Edit',
                icon: <MdModeEdit size="20" color='#014d88' />,
                onClick: (() => openNotificationConfigCreationModal(row))
            },
            {
                type: 'button',
                name: 'Delete',
                icon: <MdDelete size="20" color='#014d88' />,
                onClick: (() => deleteNotificationModal(row))
            }
        ]
    }


    return (
        <>
            {/* <PageTitle activeMenu="Notification Config" motherMenu="Notification" /> */}
            <PatientFlagCreation toggleModal={toggleModal} showModal={showCreationModal}
                fetchNotificationConfigs={fetchNotificationConfigs} selectedNotification={selectedNotification} />
                
            <Card>
                <CardBody >
                    <div className={"d-flex justify-content-end"}>
                        {hasAdminWriteRole && <ButtonMui variant="contained"
                            color="primary"
                            startIcon={<FaPlus size="10" />}
                            onClick={() => openNotificationConfigCreationModal(null)}
                            style={{ backgroundColor: '#014d88', margin: '10px' }}
                              disabled={notificationConfigList.length > 0 ? true : false}
                        >
                            <span style={{ textTransform: 'capitalize' }}>Add Patient Flag Config</span>
                        </ButtonMui>}
                    </div>
                    <MaterialTable
                        icons={tableIcons}
                        title="Find Patient Flag"
                        columns={[
                            // {
                            //     title: "Grace Period",
                            //     field: "gracePeriod",
                            // },
                            { title: "Surpression Value", field: "surpressionValue" },
                            // {
                            //     title: "Api",
                            //     field: "api",
                            // },
                            // {
                            //     title: "Message",
                            //     field: "message",
                            // },
                            
                            { title: "Action", field: "action" }
                        ]}
                        isLoading={loading}
                        data={notificationConfigList.map((row) => ({
                            // gracePeriod: row.gracePeriod,
                            surpressionValue: row.surpressionValue,
                            // api: row.api,
                            // message: row.message,
                            action:
                                <div>
                                    <SplitActionButton actions={actionItems(row)} />
                                </div>

                        }))}

                        //overriding action menu with props.actions
                        // components={props.actions}
                        options={{
                            headerStyle: {
                                backgroundColor: "#014d88",
                                color: "#fff",
                                fontSize: '16px',
                                padding: '10px',
                                zIndex: '3',
                            },
                            searchFieldStyle: {
                                width: '250%',
                                margingLeft: '250px',
                            },
                            filtering: false,
                            exportButton: false,
                            searchFieldAlignment: 'left',
                            actionsColumnIndex: -1
                        }}
                    />



                    <Modal show={modal}>

                        <Modal.Header>
                            <Modal.Title>Delete Patient Flag Config </Modal.Title>
                            <Button
                                variant=""
                                className="btn-close"
                                onClick={() => setModal(false)}
                            >

                            </Button>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to delete Patient Flag Config</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <MatButton
                                type="submit"
                                variant="contained"
                                color="primary"
                                // className={classes.button}
                                startIcon={<SaveIcon />}

                                onClick={() => openNotificationConfigDeletionModal(selectedNotification)}
                            >
                                Yes
                            </MatButton>
                            <MatButton
                                variant="contained"
                                // className={classes.button}
                                startIcon={<CancelIcon />}
                                onClick={() => setModal(false)}
                            >
                                <span style={{ textTransform: "capitalize" }}>
                                    Cancel
                                </span>
                            </MatButton>
                        </Modal.Footer>
                    </Modal>



                </CardBody>
            </Card>
        </>
    )

}


export default NotificationFlag;
