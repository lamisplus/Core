import React, { useState }   from 'react';

import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import {deleteOrgUnit} from './../../../actions/organizationalUnit'
import { connect } from "react-redux";
import { Button, Modal} from "react-bootstrap";

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
          
              <Modal show={props.modalstatus} className={props.className} size="md">
                  <Modal.Header toggle={props.togglestatus}>
                      <Modal.Title>Delete Organisation Unit</Modal.Title>
                  <Button
                      variant=""
                      className="btn-close"
                      onClick={props.togglestatus}
                  >
                  </Button>
                  </Modal.Header>
                      <Modal.Body>
                          <p style={{ fontWeight: 'bold'}}>Are you sure you want to Delete {orgUnit.name} ?</p>

                            <br/>
                        </Modal.Body>
                            <Modal.Footer>

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
                                <MatButton
                                    variant='contained'
                                    color='default'
                                    onClick={props.togglestatus}
                                    className={classes.button}

                                    className=" float-right mr-1"
                                >
                                    Cancel
                                </MatButton>
                            </Modal.Footer>
                    </Modal>
            </div>
  );
}

export default connect(null, { deleteOrgUnit })(
    DeleteModule
);
