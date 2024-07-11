import React, { Fragment, useEffect, useState } from "react";
import MaterialTable from "material-table";
import { Dropdown, Button as Button2, Menu, } from 'semantic-ui-react'
import { RoleCheck } from "../utils/RoleCheck";
import { MdModeEdit } from "react-icons/md";
import ButtonMui from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles'
import { FaPlus, FaUpload } from "react-icons/fa";
import MatButton from '@material-ui/core/Button'
import { Form,Row,Col,FormGroup,Label,Input,Card,CardBody} from 'reactstrap';
import {  Modal,  Button } from "react-bootstrap";
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { ToastContainer, toast } from "react-toastify";
import { Spinner } from 'reactstrap';
import { token, url as baseUrl } from "../../../api";
import axios from "axios";
import FileSaver from "file-saver";
import { systemSettingsHelper } from "../../../_services/SystemSettingsHelper";

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))
const SystemSettings = (props) => {
    // const tableIcons = tableIcons;
    const classes = useStyles();
    const tableIcons = {};
    const hasAdminReadRole = RoleCheck('admin_read');
    const hasAdminWriteRole = RoleCheck('admin_write');
    const [systemSettingsList, setSystemSettingsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSetting, setSelectedSetting] = useState(null);
    const [selectedSettingKey, setSelectedSettingKey] = useState(null);
    const [systemSettingModal, setSystemSettingsModal] = useState(false);
    const [importModal, setImportModal] = useState(false);
    const [importing, setImporting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [exportingSettings, setExportingSettings] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);


    const toggleSystemSettingsModal = () => {
        setSystemSettingsModal(!setSystemSettingsModal);
    }

    const toggleImportModal = () => {
        setImportModal(!importModal)
    }


    useEffect(() => {
        fetchSystemSettings()
    }, []);

    const fetchSystemSettings = () => {
        setLoading(true)
        axios.get(`${baseUrl}system-settings`)
        .then((response) => {
            setSystemSettingsList(response.data);
        })

        setLoading(false)

    }

    const openSystemSettingsModal = (row, isUpdate) => {
        setSelectedSetting(row);
        setSystemSettingsModal(true);
        setSelectedSettingKey(row?.key);
        setIsUpdate(isUpdate);
    }

    const handleInputChange = (e) => {
        setSelectedSetting ({ ...selectedSetting, [e.target.name]: e.target.value});
    }

    const handleImportFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    }

    const createSetting = (e) => {
        e.preventDefault();
        setSaving(true)
        axios.post(`${baseUrl}system-settings`, selectedSetting, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(async (response) => {
            setSaving(false)
            toggleSystemSettingsModal();
            toast.success("System Setting created successfully!");
            setSelectedSetting(null)
            await systemSettingsHelper.fetchAllSystemSettings();
            fetchSystemSettings();
            // setApplicationCodesetImportedFile(null);
            // loadApplicationCodeset();
        })

    }

    const updateSetting = (e) => {
        e.preventDefault();
        setSaving(true)
        axios.put(`${baseUrl}system-settings/${selectedSetting.key}`, selectedSetting, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(async (response) => {
            setSaving(false)
            toggleSystemSettingsModal();
            toast.success("System Setting updated successfully!");
            setSelectedSetting(null)
            await systemSettingsHelper.fetchAllSystemSettings();
            fetchSystemSettings();
        })

    }

    const importCsv = (e) => {
        e.preventDefault();
        console.log("selectedFile", selectedFile);
        const formData = new FormData();
        formData.append("file", selectedFile);

        setImporting(true);
        axios.post(`${baseUrl}system-settings/import-csv`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}` 
            }
        }).then(async (response) => {
            setImporting(false);
            // toggleImportModal();
            toast.success("System Settings imported successfully!");
            toggleImportModal();
            await systemSettingsHelper.fetchAllSystemSettings();
            fetchSystemSettings();
        })

    }

    const exportCsv = (e) => {
        e.preventDefault();
        setExportingSettings(true);
        axios.get(`${baseUrl}system-settings/export-csv`,
        { 
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${token}` 
            }
        }
      )
        .then((response) => {
            const responseData = response.data
            let blob = new Blob([responseData], { type: "application/octet-stream" });
            FileSaver.saveAs(blob, `System_Settings_${new Date().getTime()}.csv`);
            setExportingSettings(false);
            toast.success("System Settings exported successfully!");
        })

    }


    return (
        <Fragment>
            <ToastContainer autoClose={3000} hideProgressBar />
            <div style={{display: "flex", justifyContent:"flex-end"}}>
                {/* {hasAdminWriteRole && <ButtonMui variant="contained"
                color="primary"
                startIcon={<FaPlus size="10" />}
                onClick={() => openSystemSettingsModal(null, false)}
                style={{ backgroundColor: '#014d88', margin: '10px' }}
                >
                <span style={{ textTransform: 'capitalize' }}>Add System Setting</span>
            </ButtonMui>} */}
                {hasAdminWriteRole && <ButtonMui variant="contained"
                color="primary"
                startIcon={<FaPlus size="10" />}
                onClick={() => toggleImportModal()}
                style={{ backgroundColor: '#014d88', margin: '10px' }}
                >
                <span style={{ textTransform: 'capitalize' }}>Import System Settings</span>
            </ButtonMui>}
                {hasAdminReadRole && <ButtonMui variant="contained"
                color="primary"
                startIcon={<FaPlus size="10" />}
                onClick={(e) => exportCsv(e)}
                style={{ backgroundColor: '#014d88', margin: '10px' }}
                disabled={exportingSettings}
                >
                <span style={{ textTransform: 'capitalize' }}>Export System Setting</span>
            </ButtonMui>}
            </div>
            <MaterialTable
                icons={tableIcons}
                title="System Settings"
                columns={[
                    { title: "Key", field: "key" },
                    { title: "Value", field: "value" },
                    { title: "Description", field: "description" },
                    { title: "Action", field: "action", hidden: !hasAdminWriteRole },
                ]}
                isLoading={loading}
                data={systemSettingsList.map((row) => ({
                    key: row.key,
                    value: row.value,
                    description: row.description,
                    action:
                        <div>
                            {hasAdminWriteRole && <Menu.Menu position='right'  >
                                <Menu.Item >
                                    <Button2 style={{ backgroundColor: 'rgb(153,46,98)' }} primary>
                                        <Dropdown item text='Action'>

                                            <Dropdown.Menu style={{ marginTop: "10px", }}>
                                                <Dropdown.Item onClick={() => openSystemSettingsModal(row, true)}><MdModeEdit size="20" color='#014d88' /> Edit Setting
                                                </Dropdown.Item>
                                                {/* <Dropdown.Item onClick={() => deleteSystemSettingsModal(row)}><MdDelete size="20" color='#014d88' /> Delete Codeset
                                                        </Dropdown.Item> */}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </Button2>
                                </Menu.Item>
                            </Menu.Menu>}

                        </div>

                }))}


                //overriding action menu with props.actions
                components={props.actions}
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

            <Modal show={systemSettingModal} size="lg">

                <Form onSubmit={!selectedSettingKey ? createSetting : updateSetting}>
                    <Modal.Header toggle={() => toggleSystemSettingsModal()}>
                        <Modal.Title style={{ color: '#014d88', fontWeight: 'bolder' }}>{selectedSetting !== null ? 'Edit' : 'New'} System Setting</Modal.Title>
                        <Button
                            variant=""
                            className="btn-close"
                            onClick={() => toggleSystemSettingsModal()}
                        ></Button>
                    </Modal.Header>
                    <Modal.Body>
                        <Row >
                            <Col md={12}>
                                <FormGroup>
                                    <Label style={{ color: '#014d88', fontWeight: 'bolder' }}>Key</Label>
                                    <Input
                                        type='text'
                                        name='key'
                                        id='key'
                                        placeholder='Enter the system setting key'
                                        value={selectedSetting?.key}
                                        onChange={(e) => handleInputChange(e)}
                                        style={{ height: "40px", border: 'solid 1px #014d88', borderRadius: '5px'}}
                                        required
                                        disabled={isUpdate}
                                    />
                                </FormGroup>
                            </Col>

                            <Col md={12}>
                                <FormGroup>
                                    <Label style={{ color: '#014d88', fontWeight: 'bolder' }}>Value</Label>
                                    <Input
                                        type='text'
                                        name='value'
                                        id='value'
                                        placeholder='Enter a value for this system setting'
                                        value={selectedSetting?.value}
                                        onChange={(e) => handleInputChange(e)}
                                        style={{ height: "40px", border: 'solid 1px #014d88', borderRadius: '5px'}}
                                        required
                                    />
                                </FormGroup>
                            </Col>

                            <Col md={12}>
                                <FormGroup>
                                    <Label style={{ color: '#014d88', fontWeight: 'bolder' }}>Description</Label>
                                    <Input
                                        type='text'
                                        name='description'
                                        id='description'
                                        placeholder='Enter a description for this system setting'
                                        value={selectedSetting?.description}
                                        onChange={(e) => handleInputChange(e)}
                                        style={{ height: "40px", border: 'solid 1px #014d88', borderRadius: '5px' }}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                        </Row>
                        <br></br>

                        <MatButton
                            type='submit'
                            variant='contained'
                            color='primary'
                            className={classes.button}
                            startIcon={<SaveIcon />}
                            disabled={loading}
                            style={{ backgroundColor: '#014d88' }}
                        >
                            Save  {loading ? <Spinner /> : ""}
                        </MatButton>
                        <MatButton
                            variant='contained'
                            className={classes.button}
                            color='default'
                            onClick={() => toggleSystemSettingsModal()}
                            startIcon={<CancelIcon style={{ color: '#fff' }} />}
                            style={{ backgroundColor: '#992E62', color: '#fff' }}
                        >
                            Cancel
                        </MatButton>

                    </Modal.Body>

                </Form>
            </Modal>

            <Modal show={importModal}  size="lg">
                    <Modal.Header toggle={props.toggleDeleteModal}>

                        <Modal.Title>Import System Settings</Modal.Title>
                        <Button
                            variant=""
                            className="btn-close"
                            onClick={toggleImportModal}
                        >

                        </Button>
                        
                    </Modal.Header>
                    
                    <Modal.Body>
                            <div style={{marginBottom:"15px", fontSize:"14px"}}>Select System Settings CSV File</div>
                    
                            <Input
                                type='file'
                                name='importSystemSettings'
                                id='importSystemSettings'
                                accept='.csv'
                                placeholder='Select System Setting CSV file.'
                                // value={applicationCodesetImportedFile}
                                onChange={handleImportFileChange}
                                style={{ height: "40px", borderRadius: '5px', fontWeight: 'bolder' }}
                                required
                            />
                           
                        <Modal.Footer>
                        <ButtonMui variant="contained"
                          color="primary"
                          startIcon={<FaUpload size="10"/>}
                          onClick={(e) => importCsv(e)}
                                   style={{backgroundColor:'#014d88', margin: '10px'}}
                          disabled={saving}
                        >
                            <span style={{textTransform: 'capitalize'}}>{importing ? <Spinner /> : "Import System Settings"}</span>
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


        </Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        SystemInfo: state.SystemInfo.list,
    };
};


export default SystemSettings;

