import React, { useState, useEffect }   from 'react';
import { Form,Modal, ModalHeader, ModalBody,Row,Col,FormGroup,Input,FormFeedback,Label,Card,CardBody, Alert 
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CreatOrgUnitByUpload from "./CreatOrgUnitByUpload";
import {updateOrganisationUnitLevel} from './../../../actions/organizationalUnit'
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



const UpdateOrgUnit = (props) => {
    const classes = useStyles()
    
    const orgUnitDetails= props.orgUnit
    const [otherfields, setOtherFields] = useState({name:"", description:"", status:""});

    useEffect(() => {
        setOtherFields(orgUnitDetails)
      }, [props])
   
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [modal3, setModal3] = useState(false) //
    const toggleModal3 = () => setModal3(!modal3)

    // console.log(orgUnitDetails)
    console.log(otherfields)

    const handleOtherFieldInputChange = e => {
      
      if(e.target.checked){
        setOtherFields ({ ...otherfields, status:0 });  
        }else{
            setOtherFields ({ ...otherfields, status:1});
        }
        setOtherFields ({ ...otherfields, [e.target.name]: e.target.value });
        
  }

  const handleCheckedBox = e => {
      console.log(e.target.checked)
    var isChecked = e.target.checked;
    setOtherFields ({ ...otherfields, status:e.target.checked ===true ? 0 : 1 });
  
}
  const validate = () => {
      let temp = { ...errors }
      temp.name = otherfields.name ? "" : "This field is required"
      temp.description = otherfields.description ? "" : "This field is required"
      
      setErrors({
          ...temp
          })    
      return Object.values(temp).every(x => x == "")
}

const createUploadBatch = () => {

    props.togglestatus();
    setModal3(!modal3)
}
const saveOrgName = (e) => {
    e.preventDefault();
    //const status = otherfields.status===true ?  otherfields.status=1 :  otherfields.status=0
    
    if (validate()) {
        setLoading(true);        
        const onSuccess = () => {
            setLoading(false);
            props.togglestatus();
        };
        const onError = () => {
            setLoading(false);
            props.togglestatus();
        };
       
        props.updateOrganisationUnitLevel(otherfields.id, otherfields, onSuccess, onError);
    }
};

  return (      
      <div >
              <Modal isOpen={props.modalstatus} toggle={props.togglestatus} className={props.className} size="lg">
              <Form onSubmit={saveOrgName}> 
                  <ModalHeader toggle={props.togglestatus}>Update Organization Unit Level</ModalHeader>
                      <ModalBody>
                          <Card>
                            <CardBody>
                              <br />
                              <Row>
                                  <Col>
                                 
                                </Col>
                              </Row>
                                <Row>
                                  <Col md={6}>
                                    <FormGroup>
                                        <Label for="">Name</Label>
                                              <Input
                                                  type="text"
                                                  name="name"
                                                  id="name"
                                                  
                                                  value={otherfields.name}
                                                  onChange={handleOtherFieldInputChange}
                                                  {...(errors.name && { invalid: true})}
                                                  
                                              />
                                                <FormFeedback>{errors.name}</FormFeedback>
                                      </FormGroup>
                                  </Col>

                                  <Col md={6}>
                                    <FormGroup>
                                        <Label for="">Description</Label>
                                              <Input
                                                  type="text"
                                                  name="description"
                                                  id="description"
                                                  
                                                  value={otherfields.description}
                                                  onChange={handleOtherFieldInputChange}
                                                  {...(errors.description && { invalid: true})}
                                                  
                                              />
                                                <FormFeedback>{errors.description}</FormFeedback>
                                      </FormGroup>
                                  </Col>
                                <Col md={12}>
                                <FormGroup check>
                                        <Label check>
                                        <Input 
                                        type="checkbox"
                                        name="status"
                                        id="status"
                                        checked={otherfields.status === 0 ? true : false}
                                        
                                        onChange={handleCheckedBox}/>{' '}
                                            Has no child 
                                            <br/>
                                            <Alert color="primary">
                                                 This organisational unit level has no lower level
                                            </Alert>
                                          
                                        </Label>
                                    </FormGroup>
                                </Col>
                                </Row>
                            <br/>
                            <Row>
                                <Col sm={12}>
                                    
                                    <MatButton
                                        variant='contained'
                                        color='default'
                                        onClick={props.togglestatus}
                                        className={classes.button}
                                        
                                        className=" float-right mr-1"
                                    >
                                        Cancel
                                   </MatButton> { " "} { " "} { " "} { " "} { " "}
                                   <MatButton
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        className={classes.button}
                                        disabled={loading}
                                        className=" float-right mr-1"
                                        
                                    >
                                        Save 
                                    </MatButton>
                            </Col>
                            </Row>
                      </CardBody>
                </Card>
          </ModalBody>
          </Form>
      </Modal>
      <CreatOrgUnitByUpload modalstatus={modal3} togglestatus={toggleModal3}  />
 
    </div>
  );
}
export default connect(null, { updateOrganisationUnitLevel })(
    UpdateOrgUnit
);

