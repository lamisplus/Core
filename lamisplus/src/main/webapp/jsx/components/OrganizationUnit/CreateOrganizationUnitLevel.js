import React, { useState, useEffect }   from 'react';
import { Form,FormGroup,Input,FormFeedback,Label,Card,CardBody, Alert 
} from 'reactstrap';
import { Row,  Col, Button, Modal, } from "react-bootstrap";
import axios from "axios";
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CreatOrgUnitByUpload from "./CreatOrgUnitByUpload";
import {createOrganisationUnit} from './../../../actions/organizationalUnit'
import { connect } from "react-redux";
import { url  } from "../../../api";

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



const CreateOrgUnit = (props) => {
    const classes = useStyles()
    const [otherfields, setOtherFields] = useState({name:"", description: "", status:"", parentOrganisationUnitLevelId:""});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [modal3, setModal3] = useState(false) //
    const toggleModal3 = () => setModal3(!modal3)
    const [orgUnitLevel, setOrgUnitLevel] = useState([]);

    useEffect(() => {
        async function getCharacters() {
            try {
                const response = await axios(
                    url + "organisation-unit-levels/v2?status=1"
                );
                const body = response.data && response.data !==null ? response.data : {};
                
                setOrgUnitLevel(
                     body.map(({ name, id }) => ({ title: name, value: id }))
                 );
            } catch (error) {
            }
        }
        getCharacters();
    }, []);

    const handleOtherFieldInputChange = e => {
      
      if(e.target.checked){
        setOtherFields ({ ...otherfields, status:0 });  
        }else{
            setOtherFields ({ ...otherfields, status:1});
        }
        setOtherFields ({ ...otherfields, [e.target.name]: e.target.value });
        
  }

  const handleCheckedBox = e => {
      
        var isChecked = e.target.checked;
        setOtherFields ({ ...otherfields, status:isChecked });
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
    const status = otherfields.status===true ?  otherfields.status=1 :  otherfields.status=0
    //return console.log(otherfields)
    if (validate()) {
        setLoading(true);        
        const onSuccess = () => {
            
            setLoading(false);
            props.loadAllOrgUnitLevel()
            props.togglestatus();
            
        };
        const onError = () => {
            setLoading(false);
            props.togglestatus();
        };
       
        props.createOrganisationUnit(otherfields, onSuccess, onError);
    }
};

  return (      
      <div >
              <Modal show={props.modalstatus} toggle={props.togglestatus}   className={props.className} size="lg" zIndex={"9999"} backdrop={false}>
              <Form onSubmit={saveOrgName}> 
                  <Modal.Header toggle={props.togglestatus}>
                      
                      <Modal.Title>Create Organization Unit Level</Modal.Title>
                    <Button
                      variant=""
                      className="btn-close"
                      onClick={props.togglestatus}
                    >
                      
                    </Button>
                    </Modal.Header>
                      <Modal.Body>
                          <Card>
                            <CardBody>
                              <br />
                              <Row>
                              <Col md={6}>
                                <FormGroup>
                                              <Label for="">Parent Organisation  Unit Level</Label>

                                              <Input
                                                        type="select"
                                                        name="parentOrganisationUnitLevelId"
                                                        id="parentOrganisationUnitLevelId"
                                                        value={otherfields.parentOrganisationUnitLevelId} 
                                                        onChange={handleOtherFieldInputChange}
                                                        required
                                                        >
                                                            <option ></option>
                                                            {orgUnitLevel.map((row) => (
                                                                <option key={row.id} value={row.value}>
                                                                    {row.title}
                                                                </option>
                                                            ))}
                                                    </Input>
                                          </FormGroup>
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
                                       
                                        onChange={handleCheckedBox}/>{' '}
                                            Has no sublevel
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
                                        type='submit'
                                        variant='contained'
                                        color='primary'
                                        //className={classes.button}
                                        disabled={loading}
                                        className=" float-left mr-1"
                                        
                                    >
                                        <span style={{textTransform: 'capitalize'}}>Save</span> 
                                    </MatButton> { " "} { " "} { " "} { " "} { " "}
                                    <MatButton
                                        variant='contained'
                                        color='default'
                                        onClick={props.togglestatus}
                                        //className={classes.button}
                                        
                                        className=" float-left mr-1"
                                    >
                                        <span style={{textTransform: 'capitalize'}}>Cancel</span> 
                                   </MatButton>
                            </Col>
                            </Row>
                      </CardBody>
                </Card>
          </Modal.Body>
          </Form>
      </Modal>
      <CreatOrgUnitByUpload modalstatus={modal3} togglestatus={toggleModal3}  />
 
    </div>
  );
}
export default connect(null, { createOrganisationUnit })(
    CreateOrgUnit
);

