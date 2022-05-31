import React, { useState }   from 'react';
import { Modal, ModalHeader, ModalBody,Row,Col,FormGroup,Label,Card,CardBody
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import {deleteOrgUnitLevel} from './../../../actions/organizationalUnit'
import { connect } from "react-redux";


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



const DeleteModule = (props) => {
    const classes = useStyles()
    const orgUnit = props.orgUnit ? props.orgUnit : {};
    const [loading, setLoading] = useState(false)
    console.log(orgUnit);

const DeleteOrgUnitLevel = () =>{

    const onSuccess = () => {
        setLoading(false);
        props.togglestatus();
    };
    const onError = () => {
        setLoading(false);
        props.togglestatus();
    };

    props.createOrgUnitLevel(orgUnit.id,onSuccess, onError);
}

  return (      
      <div >
          {/* <ModalViewResult ref={componentRef} /> */}
          
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="md">
                  <ModalHeader toggle={props.togglestatus}>Delete Organisation Unit Level</ModalHeader>
                      <ModalBody>
                          <Card>
                            <CardBody>
                                <Row style={{ marginTop: '20px'}}>
                                    <Col xs="12">
                                        <span style={{ fontWeight: 'bold'}}>Are you sure you want to Delete {orgUnit.name} ?</span>
                                        <br/>
                                    </Col>
                                    <br/>
                                    
                                    <br/>
                                </Row>
                            <br/>
                            <MatButton
                              variant='contained'
                              color='default'
                              onClick={props.togglestatus}
                              className={classes.button}
                             
                              className=" float-right mr-1"
                            >
                              Cancel
                            </MatButton>
                            <MatButton
                                type='submit'
                                variant='contained'
                                color='primary'
                                className={classes.button}
                                onClick={DeleteOrgUnitLevel}
                                className=" float-right mr-1"
                                disabled={loading}
                            >
                                Yes 
                            </MatButton>
                            
                      </CardBody>
                </Card>
          </ModalBody>
      </Modal>
    </div>
  );
}

export default connect(null, { deleteOrgUnitLevel })(
    DeleteModule
);
