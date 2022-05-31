import React, {useState,useEffect}   from 'react';
import {  Row,Col,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import {Modal, Button} from 'react-bootstrap';
import { Badge} from "react-bootstrap";
import { useHistory } from "react-router-dom";

const UpdateModuleInformation = (props) => {
    let history = useHistory();
    const datasample = props.datasample ? props.datasample : {};
    const [moduleInformation, setModuleInformation]= useState({})

    useEffect (()=>{
        //Getting the module information from props
        setModuleInformation(props.datasample ? props.datasample : {})
    },[props.datasample]);

    //Handle input change of the fields value
    const handleOtherFieldInputChange = e => {
        setModuleInformation ({ ...moduleInformation, [e.target.name]: e.target.value });
    }

    const updateModuleInformation = () => {
        const onError = () => {
        }
        const onSuccess = () => {

        }
        props.activateBootstrapModule(datasample, onSuccess, onError);
        props.togglestatus()
        //window.location.href = "bootstrap-modules";
        props.loadModules()
        history.push(`/bootstrap-modules`)
    }



    return (
        <div >
            {/* <ModalViewResult ref={componentRef} /> */}

            <Modal show={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                <Modal.Header toggle={props.togglestatus}>
                    <Modal.Title>Update Module Information</Modal.Title>

                    <Button
                        variant=""
                        className="btn-close"
                        onClick={props.togglestatus}
                    ></Button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <CardBody>
                            <div className="basic-form">

                            <Row style={{ marginTop: '20px'}}>
                                <Col xs="12">
                                    <div className="card-body p-0 pb-3">
                                        <ul className="list-group list-group-flush">

                                            <li className="list-group-item">
                                                <span className="mb-0 title">Module Name</span> :
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control input-rounded"
                                                        name={"name"}
                                                        onChange={handleOtherFieldInputChange}
                                                        value={moduleInformation.name}
                                                    />
                                                </div>

                                            </li>
                                            <li className="list-group-item">
                                                <span className="mb-0 title">Description</span> :

                                                <span className="text-black ms-2">
                                                  <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control input-rounded"
                                                        name={"description"}
                                                        onChange={handleOtherFieldInputChange}
                                                        value={moduleInformation.description}
                                                    />
                                                </div>
                                                </span>
                                            </li>
                                            <li className="list-group-item">
                                                <span className="mb-0 title">Module Base Package</span> :
                                                <span className="text-black ms-2">
                                                    <div className="form-group">
                                                        <input
                                                            type="text"
                                                            className="form-control input-rounded"
                                                            name={"basePackage"}
                                                            value={moduleInformation.basePackage}
                                                        />
                                                      </div>

                                                </span>
                                            </li>

                                        </ul>
                                    </div>
                                </Col>
                                <br/>

                                <br/>
                            </Row>
                            <br/>
                            <MatButton
                                type='submit'
                                variant='contained'
                                color='primary'
                                //className={classes.button}
                                onClick={()=> updateModuleInformation()}
                                className=" float-right ms-2"

                            >
                                Yes
                            </MatButton>
                            <MatButton
                                variant='contained'
                                color='default'
                                onClick={props.togglestatus}
                                //className={classes.button}
                                className=" float-right ms-2"
                            >
                                Cancel
                            </MatButton>
                          </div>
                        </CardBody>
                    </Card>
                </Modal.Body>
            </Modal>
        </div>
    );
}



export default UpdateModuleInformation;
