import React   from 'react';
import {  Row,Col,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import {Modal, Button} from 'react-bootstrap';
import { Badge} from "react-bootstrap";


const VieweModule = (props) => {

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
                                      <ul className="list-group list-group-flush">
                                      <li className="list-group-item">
                                              <span className="mb-0 title">Module Name</span> :
                                              <span className="text-black "><h3>{datasample.name}</h3></span>
                                          </li>
                                          <li className="list-group-item">
                                              <span className="mb-0 title">Description</span> :
                                              <span className="text-black ms-2"><b>{datasample.description}</b></span>
                                          </li>
                                          <li className="list-group-item">
                                              <span className="mb-0 title">Module Base Package</span> :
                                              <span className="text-black ms-2"><b>{datasample.basePackage}</b></span>
                                          </li>
                                          <li className="list-group-item">
                                              <span className="mb-0 title">Build Time</span> :
                                              <span className="text-black ms-2"><b>{datasample.buildTime}</b></span>
                                          </li>
                                          
                                          <li className="list-group-item">
                                          
                                              <Badge variant="info badge-xs light" className="card-link float-end">Veriosn {datasample.version}</Badge>
                                              <span className="mb-0 title">Status</span> :
                                              <span className="text-black desc-text ms-2">
                                              <Badge variant={datasample.active===true? "primary badge-xs": "danger badge-xs"}><i className="fa fa-check-square me-2 scale4" aria-hidden="true"></i> {datasample.active===true? "Active": "Inactive"}</Badge>
                                                  
                                              </span>
                                          </li>
                                      </ul>
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


  
  export default VieweModule;
  