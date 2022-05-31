import React, { useState }   from 'react';
import { Modal, ModalHeader, ModalBody,Row,Col,FormGroup,Label,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import {MdSwapHoriz} from 'react-icons/md';


const useStyles = makeStyles(theme => ({
    card: {
        margin: theme.spacing(20),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    },
    cardBottom: {
        marginBottom: 20
    },
    Select: {
        height: 45,
        width: 350
    },
    button: {
        margin: theme.spacing(1)
    },

    root: {
        '& > *': {
            margin: theme.spacing(1)
        }
    },
    input: {
        display: 'none'
    } 
}))



const ModalViewResult = (props) => {
    const classes = useStyles()
    
  return (      
      <div >
       
          
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
                  <ModalHeader toggle={props.togglestatus}>Start Module</ModalHeader>
                      <ModalBody>
                          <Card>
                            <CardBody>
                                <Row style={{ marginTop: '20px'}}>
                                    <Col xs="12">
                                        <span style={{ fontWeight: 'bold'}}>Starting this module wil restart the application and all scheduled tasked
                                        and background processes will be interupted. <br/>Do you want to Proceed?</span> : 
                                        <br/>
                                    </Col>
                                    <br/>
                                    
                    
                                </Row>
                            <br/>
                            
                            <MatButton
                              variant='contained'
                              color='default'
                              onClick={props.togglestatus}
                              className={classes.button}
                              startIcon={<CancelIcon />}
                              className=" float-right mr-1"
                            >
                              Cancel
                            </MatButton>
                            <MatButton
                                type='submit'
                                variant='contained'
                                color='primary'
                                className={classes.button}
                                startIcon={<MdSwapHoriz />}
                                className=" float-right mr-1"
                                
                            >
                                Proceed  
                            </MatButton>
                      </CardBody>
                </Card>
          </ModalBody>
      </Modal>
    </div>
  );
}

export default ModalViewResult;
