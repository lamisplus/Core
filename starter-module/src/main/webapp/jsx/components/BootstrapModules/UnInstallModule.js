import React   from 'react';
import {  Row,Col,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { unInstallBootstrapModule } from '../../../actions/bootstrapModule';
import { connect } from 'react-redux';
import {Modal} from 'react-bootstrap';
import {useHistory} from "react-router-dom";



const UnIstallModal = (props) => {
    let history = useHistory();
    const datasample = props.datasample ? props.datasample : {};


    const unistallModule = () => {
        const onError = () => {
        }
        const onSuccess = () => {
            props.togglestatus()
            props.loadModules()
            history.push(`/bootstrap-modules`)
        }
        props.unInstallBootstrapModule(datasample, onSuccess, onError);


    }


  return (      
      <div >
          {/* <ModalViewResult ref={componentRef} /> */}
          
              <Modal show={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                  <Modal.Header toggle={props.togglestatus}>Unistall Module</Modal.Header>
                      <Modal.Body>
                          <Card>
                            <CardBody>
                                <Row style={{ marginTop: '20px'}}>
                                    <Col xs="12">
                                       <p>Are you sure you want to Unistall the <span style={{ fontWeight: 'bold'}}>{datasample.name } </span>module</p> 
                                        <br/>
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
                                onClick={()=> unistallModule()}
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
                      </CardBody>
                </Card>
          </Modal.Body>
      </Modal>
    </div>
  );
}


  
  export default connect(null, {unInstallBootstrapModule })(UnIstallModal);
  