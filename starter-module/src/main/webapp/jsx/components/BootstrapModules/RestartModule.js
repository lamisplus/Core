import React   from 'react';
import {  Row,Col,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import {Modal, Button} from 'react-bootstrap';
import { Badge} from "react-bootstrap";


const RestartModule = (props) => {

    const datasample = props.datasample ? props.datasample : {};


    return (
        <div >
            {/* <ModalViewResult ref={componentRef} /> */}

            <Modal show={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                <Modal.Header toggle={props.togglestatus}>
                    <Modal.Title>View Module</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={props.togglestatus}
                    ></Button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <CardBody>
                            <Row style={{ marginTop: '20px'}}>
                                <Col xs="12">
                                    <div className="card-body p-0 pb-3">

                                    </div>
                                </Col>
                                <br/>

                                <br/>
                            </Row>
                            <br/>

                        </CardBody>
                    </Card>
                </Modal.Body>
            </Modal>
        </div>
    );
}



export default RestartModule;
