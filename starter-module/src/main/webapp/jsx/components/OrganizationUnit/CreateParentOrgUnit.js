import React, {useState, useEffect} from 'react';
import axios from "axios";
import {  Row,Col,Form,FormGroup,Label,Input,Card,CardBody, Table,} from 'reactstrap';
import {  Button, Modal, } from "react-bootstrap";
import { connect } from 'react-redux'
import MatButton from '@material-ui/core/Button'
//import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'
import CancelIcon from '@material-ui/icons/Cancel'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import Select from "react-select";

import { Spinner } from 'reactstrap';
import { url  } from "./../../../api";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete'
///import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
//import List from "@material-ui/core/List";
import {Icon, List, Label as LabelSui} from 'semantic-ui-react'
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import {createOrgUnitLevel} from './../../../actions/organizationalUnit'


const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    error: {
        color: "#f85032",
        fontSize: "12.8px",
    },
}))
const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: (option) => option.title,
  });


const CreateOrgUnit = (props) => {
    let history = useHistory();
    
    const defaultValues = {name:"",id:"" }
    const [loading, setLoading] = useState(false)
    const [hiddeDetail, setHiddeDetail] = useState(false)
    const dispatch = useDispatch();
    const defaultDetailValues = { name: "", description:"", parentOrganisationUnitId:"", details:{}}
    const defaultDetailValuesOtherDetails = { name: "", email:"", address:"", phone:""}
    const classes = useStyles()
    const [errors, setErrors] = useState({});
    const [otherDetailFields, setOtherDetailFields] = useState(false);
    const [locationList, setLocationList] = useState({ stateName:"", lga:""})
    const [otherDetails, setOtherDetails] = useState(defaultValues);
    const [details, setDetails] = useState(defaultDetailValues);
    const [otherDetailsFields, setOtherDetailsFields] = useState(defaultDetailValuesOtherDetails);
    const [relativesLocation, setRelativesLocation] = useState([]);
    const [locationListArray2, setLocationListArray2] = useState([])

    const orgUnitIDParam = props.orgUnitID ? props.orgUnitID :{};
    const [otherfields, setOtherFields] = useState({parentOrganisationUnitId:"", name:"", description:"", organisationUnitLevelId:""});
    
    const [formData, setFormData] = useState(defaultValues)
    const [pcrOptions, setOptionPcr] = useState([]);
    const [orgUnitLevel, setOrgUnitLevel] = useState([]);

    const handleOtherFieldInputChange = e => {
        setDetails ({ ...details, [e.target.name]: e.target.value });
    }


    useEffect(() => {
        //loadCboProjectList()
        setOtherDetails(props.formData ? props.formData : defaultValues);
        
    }, [props.formData]); //componentDidMount

    const validate = () => {
        let temp = { ...errors }
        temp.name = details.name ? "" : "This field is required"
        temp.description = details.description ? "" : "This field is required"
        setErrors({
            ...temp
            })    
        return Object.values(temp).every(x => x == "")
  }
  
  useEffect(() => {
      async function getCharacters() {
          try {
              const response = await axios(
                  url + `organisation-unit-levels/v2/parent-organisation-unit-level/${orgUnitIDParam.id}/organisation-units`+'?size=3000'
              );
              const body = response.data && response.data !==null ? response.data : {};
              setOptionPcr(
                   body.map(({ name, id, parentOrganisationUnitName }) => ({ title: name +" -  " + parentOrganisationUnitName, value: id }))
               );
          } catch (error) {
          }
      }
      getCharacters();
  }, [orgUnitIDParam.parentOrganisationUnitLevelId]);
  
  const handleInputChangeOrgUnit = (e)=> {
      const orgUnitID = e && e.value ? e.value : ""
     
      async function getCharacters() {
          const response = await axios.get(`${url}organisation-units/organisation-unit-level/v2`+orgUnitID);
          //
          setOrgUnitLevel(
              Object.entries(response.data).map(([key, value]) => ({
                  label: value.name + " -  " + value.parentOrganisationUnitName,
                  value: value.id,
                }))
             
              
              );
    }
      getCharacters();

  }


    const handleInputChange = e => {
        //setDetails ({...details,  [e.target.name]: e.target.value});
        setOtherFields({ ...otherfields, [e.target.name]: parseInt(e.target.value) })
    }
    const handleOtherDetailFields = e => {
        setOtherDetailsFields ({...otherDetailsFields,  [e.target.name]: e.target.value});
    }
    
    const addLocations2 = e => { 
            if(validate()){
            //details['parentOrganisationUnitId']= otherfields.parentOrganisationUnitId
            details['details']= otherDetailsFields 
            //parentOrganisationUnitId   
            const allRelativesLocation = [...relativesLocation, details];
            setRelativesLocation(allRelativesLocation);
            }else{
                return;
            }
   }

    /* Remove Relative Location function **/
    const removeRelativeLocation = index => {       
        relativesLocation.splice(index, 1);
        setRelativesLocation([...relativesLocation]);
       
    };
    const resetForm = () => {
        setOtherDetails(defaultValues)
        setRelativesLocation({state: "", lga:""})  
    }

    const organisationUnitIds = []
    const createOrgUnittSetup = e => {
        e.preventDefault()
        if(relativesLocation.length >0 && validate()){
        const parentOrganisationUnitId = otherfields.parentOrganisationUnitId
        const orgUnitIDParam = props.orgUnitID.id
        console.log(orgUnitIDParam)
        console.log(parentOrganisationUnitId)
        console.log(relativesLocation)
        
        setLoading(true);
        const onSuccess = () => {
            props.loadOrgUnit() 
            setLoading(false)
            setDetails(defaultDetailValues)
            setOtherDetails(defaultValues)  
            setLocationListArray2([]) 
            props.togglestatus() 
            
            resetForm()
                  
        }
        const onError = () => {
            setLoading(false)  
            setOtherDetails(defaultValues) 
            setDetails(defaultDetailValues) 
            setLocationListArray2([])
            props.togglestatus() 
        }       
        props.createOrgUnitLevel(relativesLocation,parentOrganisationUnitId,orgUnitIDParam, onSuccess, onError);      
        return

    }else if(!validate()){
        return
    }else{
        toast.error("Organisation Unit can't be empty")
    }
 
    }
    const showDetailFields = e => {
        setHiddeDetail(!hiddeDetail);
        
    }
    const closeModal = ()=>{
        resetForm()
        props.togglestatus()
        setDetails(defaultDetailValues) 
        setErrors({}) 
    }
console.log(otherfields)
    return (

        <div >
        <ToastContainer />
            <Modal show={props.modalstatus}   size="xl"  backdrop={true} >
                <Form >
                    <Modal.Header >
                        <Modal.Title>Create Org. Unit - {orgUnitIDParam.name} </Modal.Title>
                        <Button
                            variant=""
                            className="btn-close"
                            onClick={closeModal}
                        >
                        </Button>

                    </Modal.Header>
                    <Modal.Body >
                        <Card >
                            <CardBody>
                                <Row >
                                
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
                                                        handleInputChangeOrgUnit(i)
                                                        setOtherFields({ ...otherfields, parentOrganisationUnitId: i.value });
                                                    }}
                                                    renderInput={(params) => <TextField {...params} variant="outlined" />}
                                                    />
                                          </FormGroup>
                                    </Col>
                                    
                                   
                                    <Col md={12}>
                                        <hr/>
                                        <h5>Organisation Unit Level </h5>
                                    </Col>
                                    
                                    <Col md={5}>
                                        <FormGroup>
                                            <Label >Name</Label>
                                            <Input
                                                  type="text"
                                                  name="name"
                                                  id="name"
                                                  
                                                  value={details.name}
                                                  onChange={handleOtherFieldInputChange}
                                                  {...(errors.name && { invalid: true})}
                                                  
                                              />
                                            {errors.name !=="" ? (
                                                <span className={classes.error}>{errors.name}</span>
                                            ) : "" }
                                        </FormGroup>
                                    </Col>
                                    
                                    <Col md={5}>
                                                <FormGroup>
                                                    <Label >Description </Label>
                                                    <Input
                                                        type="text"
                                                        name="description"
                                                        id="description"
                                                        
                                                        value={details.description}
                                                        onChange={handleOtherFieldInputChange}
                                                        {...(errors.description && { invalid: true})}
                                                        
                                                        />
                                                            {errors.description !=="" ? (
                                                            <span className={classes.error}>{errors.description}</span>
                                                        ) : "" }
                                                </FormGroup>

                                    </Col>
                                    
                                    <Col md={2}>

                                        <LabelSui as='a' color='black'  onClick={addLocations2}  size='tiny' style={{ marginTop:35}}>
                                            <Icon name='plus' /> Add
                                        </LabelSui>
                                    </Col>
                                    <Col md={12}>
                                        <FormGroup >
                                            <Label   onClick={showDetailFields}>
                                            
                                                <span style={{color:'#892'}}><b>Other Detail</b> </span>
                                            
                                            </Label>
                                        </FormGroup>
                                        </Col>
                                        {/* Other Detail Field for the Org. unit*/}
                                                {hiddeDetail===true ? ( 
                                                <>
                                                   
                                                        <Col md={5}>
                                                            <FormGroup>
                                                                <Label >Name</Label>
                                                                <Input
                                                                    type="text"
                                                                    name="name"
                                                                    id="name"
                                                                    
                                                                    value={otherDetailsFields.name}
                                                                    onChange={handleOtherDetailFields}
                                                                    {...(errors.name && { invalid: true})}
                                                                    
                                                                />
                                                            {errors.name !=="" ? (
                                                                <span className={classes.error}>{errors.name}</span>
                                                            ) : "" }
                                                        </FormGroup>
                                                    </Col>
                                                    
                                                <Col md={5}>
                                                    <FormGroup>
                                                        <Label >Email </Label>
                                                        <Input
                                                            type="text"
                                                            name="email"
                                                            id="email"
                                                            
                                                            value={otherDetailsFields.email}
                                                            onChange={handleOtherDetailFields}
                                                        
                                                            />
                                                            
                                                    </FormGroup>
                                                </Col>
                                                <Col md={2}></Col>
                                                <Col md={5}>
                                                    <FormGroup>
                                                        <Label >Phone Number </Label>
                                                        <Input
                                                            type="text"
                                                            name="phone"
                                                            id="phone"
                                                            
                                                            value={otherDetailsFields.phone}
                                                            onChange={handleOtherDetailFields}

                                                            />
                                                            
                                                    </FormGroup>

                                                </Col>
                                                <Col md={5}>
                                                    <FormGroup>
                                                        <Label >Address </Label>
                                                        <Input
                                                            type="text"
                                                            name="address"
                                                            id="address"
                                                            
                                                            value={otherDetailsFields.address}
                                                            onChange={handleOtherDetailFields}
                                                        
                                                            />
                                                            
                                                    </FormGroup>

                                                </Col>
                                                <Col md={2}></Col>
                                                </>
                                            )
                                            :
                                            ""
                                            }
                                            {/* End of the Other Detail Fields for the Org. Unit */}
                                         <Col md={12}>
                                                  <div className={classes.demo}>
                                                  {relativesLocation.length >0 
                                                    ?
                                                      <List>
                                                      <Table  striped responsive>
                                                            <thead >
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Description</th>
                                                                    <th >Details</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            {relativesLocation.map((relative, index) => (

                                                                <RelativeList
                                                                    key={index}
                                                                    index={index}
                                                                    relative={relative}
                                                                    removeRelativeLocation={removeRelativeLocation}
                                                                />
                                                          ))}
                                                          </tbody>
                                                        </Table>
                                                      </List>
                                                     :
                                                     ""
                                                  }               
                                                  </div>
                                            </Col>
                                        
                                </Row>

                                <MatButton
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    className={classes.button}
                                    startIcon={<SaveIcon />}
                                    disabled={loading}
                                    onClick={createOrgUnittSetup}
                                    
                                    >
                                    
                                    <span style={{textTransform: 'capitalize'}}>Save  {loading ? <Spinner /> : ""}</span>
                                </MatButton>
                                <MatButton
                                    variant='contained'
                                    color='default'
                                    onClick={closeModal}
                                    startIcon={<CancelIcon />}>
                                     <span style={{textTransform: 'capitalize'}}>Cancel</span>
                                </MatButton>
                            </CardBody>
                        </Card>
                    </Modal.Body>

                </Form>
            </Modal>
        </div>
    );
}

function RelativeList({
    relative,
    index,
    removeRelativeLocation,
  }) {
    function displayDetail (detailObj){

        return(
            <>
                  <List>
                    {detailObj.name!==null && detailObj.name!=="" ? (
                    <List.Item>
                    <List.Icon name='user' />
                    <List.Content>{detailObj.name}</List.Content>
                    </List.Item>
                    ) :
                    ""
                    }
                    {detailObj.address!==null && detailObj.address!=="" ? (
                    <List.Item>
                    <List.Icon name='marker' />
                    <List.Content> {detailObj.address}</List.Content>
                    </List.Item>
                    ) :
                    ""
                    }
                    {detailObj.email!==null && detailObj.email!==""? (
                    <List.Item>
                    <List.Icon name='mail' />
                    <List.Content>
                        {detailObj.email}
                    </List.Content>
                    </List.Item>
                    ) :
                    ""
                    }
                    {detailObj.phone!==null && detailObj.phone!==""? (
                    <List.Item>
                    <List.Icon name='phone' />
                    <List.Content>
                        {detailObj.phone}
                    </List.Content>
                    </List.Item>
                    ) :
                    ""
                    }
                </List>  
            </>
        )
    }
    return (
            <tr>
                <th>{relative.name}</th>
                <th>{relative.description}</th>
                <th>{displayDetail(relative.details)}</th>
                <th >
                    <IconButton aria-label="delete" size="small" color="error" onClick={() =>removeRelativeLocation(index)}>
                        <DeleteIcon fontSize="inherit" />
                    </IconButton>
                    
                </th>
            </tr> 
    );
  }


export default connect(null, { createOrgUnitLevel})(CreateOrgUnit);

