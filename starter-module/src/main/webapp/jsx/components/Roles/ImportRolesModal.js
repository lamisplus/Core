import React, {useEffect, forwardRef, useState} from 'react';
import { url as baseUrl } from "../../../api";
import axios from 'axios';
import ButtonMui from "@material-ui/core/Button";
import {FaUpload} from "react-icons/fa";
import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast } from "react-toastify";
import { Button, Modal} from "react-bootstrap";
import { Input, Spinner } from 'reactstrap';
import { fetchRoles } from '../../../actions/role';
import { connect } from "react-redux";

const ImportRolesModal = ({showImportModal, toggleImportModal, fetchAllRoles}) => {
    const [importing, setImporting] = useState(false);
    const [rolesImportedFile, setRolesImportedFile] = useState(null);

    const handleImportFileChange = (event) => {
        setRolesImportedFile(event.target.files[0]);
    }


    const triggerImportRoles = () => {
        setImporting(true);
        if (!rolesImportedFile) {
            toast.error("Please select a file to import");
            setImporting(false);
            return;
        }
        const formData = new FormData();
        formData.append('file', rolesImportedFile);
        axios.post(`${baseUrl}roles/v2/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            setImporting(false);
            toggleImportModal();
            fetchAllRoles(()=>{}, ()=>{});
            toast.success("Roles imported successfully!");
            setRolesImportedFile(null);
        }).catch((error) => {
            // toggleImportModal();
            setImporting(false);
            toast.error("Failed to import roles, please contact administration");
        });
    }


    return (
        <Modal show={showImportModal}  size="lg">
                    <Modal.Header toggle={toggleImportModal}>

                        <Modal.Title>Import Roles </Modal.Title>
                        <Button
                            variant=""
                            className="btn-close"
                            onClick={toggleImportModal}
                        >

                        </Button>
                        
                    </Modal.Header>
                    
                    <Modal.Body>
                            <div style={{marginBottom:"15px", fontSize:"14px"}}>Select Roles JSON File</div>
                            <Input
                                type='file'
                                name='importRoles'
                                id='importRoles'
                                accept={`.json`}
                                placeholder={`'Select roles json file.`}
                                onChange={handleImportFileChange}
                                style={{ height: "40px", borderRadius: '5px', fontWeight: 'bolder' }}
                                required
                            />
                        <Modal.Footer>
                        <ButtonMui variant="contained"
                          color="primary"
                          startIcon={<FaUpload size="10"/>}
                          onClick={() => triggerImportRoles()}
                                   style={{backgroundColor:'#014d88', margin: '10px'}}
                          disabled={importing}
                        >
                            <span style={{textTransform: 'capitalize'}}>{importing ? <Spinner /> : "Import Roles"}</span>
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
    )
}
const mapActionToProps = {
    fetchAllRoles: fetchRoles,
  };
  
export default connect(null, mapActionToProps)(ImportRolesModal);