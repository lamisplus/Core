import React, {useState,useEffect}   from 'react';
import {  Row,Col,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import {Modal, Button} from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import { updateModuleDetail } from '../../../actions/bootstrapModule';
import { connect } from 'react-redux';


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

    const updateInformation = (e) => {
        e.preventDefault();
        const onError = () => {}
        const onSuccess = () => {
            props.loadModules()
            props.togglestatus()
        }
        props.updateModuleDetail(moduleInformation.id, moduleInformation, onSuccess, onError);

        //history.push(`/bootstrap-modules`)
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
                            <form>
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
                                                        disabled
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
                                                            disabled
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
                                onClick={updateInformation}
                                className=" float-right ms-2"

                            >
                                Save
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
                          </form>
                        </CardBody>
                    </Card>
                </Modal.Body>
            </Modal>
        </div>
    );
}


export default connect(null, {updateModuleDetail })(UpdateModuleInformation);

