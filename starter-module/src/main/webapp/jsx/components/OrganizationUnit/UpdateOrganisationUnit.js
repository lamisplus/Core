import React, { useState, useEffect }   from 'react';
import { Row,Col,FormGroup,Input,FormFeedback,Label,Card,CardBody,Form
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import {url} from '../../../api'
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import {updateOrganisationUnit} from './../../../actions/organizationalUnit'
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

const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => option.title,
  });
  

const CreateParentOrgUnit = (props) => {
    const classes = useStyles()
    const orgUnitIDParam = props.orgUnitID ? props.orgUnitID :{};
    const orgUnitDetails= props.orgUnit
    console.log(orgUnitDetails)
    const [otherfields, setOtherFields] = useState({parentOrganisationUnitId:"", name:"", description:"", organisationUnitLevelId:""});
    const defaultValues = {name:"",id:"" }
    const [formData, setFormData] = useState(defaultValues)
    const [errors, setErrors] = useState({});
    const [modal3, setModal3] = useState(false) //
    const toggleModal3 = () => setModal3(!modal3)
    const [pcrOptions, setOptionPcr] = useState([]);
    const [loading, setLoading] = useState(false)
    const handleOtherFieldInputChange = e => {
      setOtherFields ({ ...otherfields, [e.target.name]: e.target.value });

  }
  const validate = () => {
      let temp = { ...errors }
      temp.name = otherfields.name ? "" : "This field is required"
      temp.parentOrganisationUnitId = otherfields.parentOrganisationUnitId ? "" : "This field is required"
      temp.description = otherfields.description ? "" : "This field is required"
      setErrors({
          ...temp
          })    
      return Object.values(temp).every(x => x == "")
}

useEffect(() => {
    setOtherFields(orgUnitDetails)
  }, [props])

useEffect(() => {
    async function getCharacters() {
        try {
            const response = await axios(
                url + "organisation-units"
            );
            const body = response.data && response.data !==null ? response.data : {};
            
            setOptionPcr(
                 body.map(({ name, id }) => ({ title: name, value: id }))
             );

            const defaultOrgUnit = body.find(x => x.id === orgUnitDetails.organisationUnitLevelId);
            console.log(defaultOrgUnit)
            //     setValues({ ...values, countryId: defaultCountryId });
        } catch (error) {
        }
    }
    getCharacters();
}, []);


const createOrgUnit = (e) => {
    e.preventDefault();
    setOtherFields({ ...otherfields, organisationUnitLevelId: props.orgUnitID });
    otherfields['organisationUnitLevelId'] = props.orgUnitID.id
    otherfields['parentOrganisationUnitId'] = props.orgUnitID.id ===1 ? 0 : otherfields.parentOrganisationUnitId
   //check if the Org Unit Level ID is 1 which is country

 
    const onSuccess = () => {
        setLoading(false);
        props.togglestatus();
    };
    const onError = () => {
        setLoading(false);
        props.togglestatus();
    };

    props.updateOrganisationUnit(otherfields.id, otherfields, onSuccess, onError);
}

  return (      
      <div >
              <Modal show={props.modalstatus} className={props.className} size="lg">
                  <Modal.Header toggle={props.togglestatus}>

                      <Modal.Title>Update Organization Unit</Modal.Title>
                      <Button
                          variant=""
                          className="btn-close"
                          onClick={props.togglestatus}
                      >
                      </Button>
                  </Modal.Header>
                  <Modal.Body>
                      <Row>
                               {orgUnitIDParam.id!= 1 ? (
                                    <Col md={6}>
                                          <FormGroup>
                                              <Label for="">Parent Organisation  Unit</Label>

                                                  <Autocomplete
                                                    id="filter-orgUnit"
                                                    options={pcrOptions}
                                                    getOptionLabel={(option) => option.title}
                                                    filterOptions={filterOptions}
                                                    size="small"
                                                    onChange={(e, i) => {
                                                        console.log(1)
                                                        setOtherFields({ ...otherfields, parentOrganisationUnitId: i.value });
                                                    }}
                                                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                                                    />
                                              </FormGroup>
                                          </Col>
                                   ):

                                   ""
                                 }
                                  <Col md={6}>
                                    <FormGroup>
                                        <Label for=""> Name</Label>
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
                                </Row>

                    </Modal.Body>
                   <Modal.Footer>
                            <Row>
                                <Col sm={12}>
                                <MatButton
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    className={classes.button}
                                    disabled={loading}
                                    onClick={createOrgUnit}
                                >
                                    Save
                                </MatButton>
                                <MatButton
                                        variant='contained'
                                        color='default'
                                        onClick={props.togglestatus}
                                        className={classes.button}

                                    >
                                        Cancel
                                   </MatButton>

                                    
                            </Col>
                            </Row>
                        </Modal.Footer>

            </Modal>

        </div>
  );
}


export default connect(null, { updateOrganisationUnit })(
    CreateParentOrgUnit
);

