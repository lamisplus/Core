import React, { useEffect, forwardRef, useState } from 'react';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAll, deleteApplicationCodeset } from "../../../actions/applicationCodeset";
import {
    Form, Row, Col, FormGroup, Input, Card, CardBody
} from 'reactstrap';
import { url as baseUrl, token } from "../../../api";
import axios from 'axios';
import FileSaver from "file-saver";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom'
import ButtonMui from "@material-ui/core/Button";
import { FaDownload, FaEye, FaPlus, FaUpload } from "react-icons/fa";
import SaveIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import { makeStyles } from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import PageTitle from "../../layouts/PageTitle";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select/creatable";
import { Dropdown, FormInput } from 'semantic-ui-react';


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
import { Icon, Label } from "semantic-ui-react";
import { MdModeEdit, MdPerson, MdDelete } from "react-icons/md";
import SplitActionButton from "../Button/SplitActionButton";
import ServerInstalled from '../../Utils/ServerInstalled';
import { authentication } from '../../../_services/authentication';
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
const NewNotificationConfigModal = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [notificationObject, setNotificationObject] = useState(props.selectedNotification);

    const [formData, setFormData] = useState(notificationObject)


    useEffect(() => {
        if (props.selectedNotification) {
            setNotificationObject(props.selectedNotification)
        }
    }, [props.selectedNotification]);



    const handleChange = (e) => {
        setNotificationObject({ ...notificationObject, [e.target.name]: e.target.value });
    };
    console.log(notificationObject)

    const handleSaveNotification = () => {
        axios
            .post(`${baseUrl}notification/`, notificationObject, { headers: { "Authorization": `Bearer ${token}` } })
            .then(response => {
                setNotificationObject(null)
                props.toggleModal()
                props.fetchNotificationConfigs()
                toast.success("Notification successfully saved...")
            })
            .catch(error => {
                console.log(error)
            }

            );
    }

    return (
        <Modal show={props.showModal} size="lg">
            <Modal.Header toggle={props.toggleModal}>

                <Modal.Title>Create Notification Config</Modal.Title>
                <Button
                    variant=""
                    className="btn-close"
                    onClick={props.toggleModal}
                />

            </Modal.Header>

            <Modal.Body>
                <Col md={12}>
                    <FormGroup>
                        <Label style={{ color: '#014d88', fontWeight: 'bolder' }}>Period <span style={{ cursor: "pointer", color: "blue" }}
                        // onClick={() => setShowNewCodesetGroup(true)}

                        >
                        </span></Label>
                        <Input
                            type="select"
                            name="period"
                            id="period"
                            onChange={handleChange}
                            style={{ border: "1px solid #014D88", borderRadius: "0.2rem" }}
                            value={notificationObject?.period}
                        >
                            <option > </option>
                            {[{ value: "Daily", label: "Daily" },
                            { value: "Weekly", label: "Weekly" },
                            { value: "Monthly", label: "Monthly" }
                            ].map(({ label, value }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>
                </Col>
                <Col md={12}>
                    <FormGroup>
                        <Label style={{ color: '#014d88', fontWeight: 'bolder' }}>Indicator <span style={{ cursor: "pointer", color: "blue" }}

                        >
                        </span></Label>
                        <Input
                            type="select"
                            name="indicator"
                            id="indicator"
                            onChange={handleChange}
                            style={{ border: "1px solid #014D88", borderRadius: "0.2rem" }}
                            value={notificationObject?.indicator}
                        >
                            <option > </option>
                            {[{ value: "ART Refill", label: "ART Refill" },
                                // { value: "Weekly", label: "Weekly" },
                                // { value: "Monthly", label: "Monthly" }
                            ].map(({ label, value }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                        </Input>
                    </FormGroup>

                </Col>


                <Modal.Footer>
                    <ButtonMui variant="contained"
                        color="primary"
                        startIcon={<FaUpload size="10" />}
                        onClick={() => handleSaveNotification()}
                        style={{ backgroundColor: '#014d88', margin: '10px' }}
                    //   disabled={deleting}
                    >
                        {/* <span style={{textTransform: 'capitalize'}}>{importing ? <Spinner /> : "Import Codeset"}</span> */}
                        <span style={{ textTransform: 'capitalize' }} >Save </span>

                    </ButtonMui>
                    <ButtonMui
                        variant='contained'
                        color='default'
                        onClick={props.toggleModal}
                        startIcon={<CancelIcon />}
                    >
                        Cancel
                    </ButtonMui>
                </Modal.Footer>
            </Modal.Body>

        </Modal>
    );
}

export default NewNotificationConfigModal;