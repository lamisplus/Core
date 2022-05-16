import React, {useEffect, useState}   from 'react';
import {
    Row, Col, Card, CardBody, Table, Spinner
} from 'reactstrap';
import MatButton from '@material-ui/core/Button';
import {Modal, Button} from 'react-bootstrap';
import { Badge} from "react-bootstrap";
import axios from "axios";
import {url as baseUrl} from "../../../api";
import {Icon, Label as LabelSui, List} from "semantic-ui-react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {makeStyles} from "@material-ui/core/styles";
import {toast} from "react-toastify";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import {fetchAllBootstrapModule, getModuleMenus, updateModuleMenu} from '../../../actions/bootstrapModule';
import { connect } from 'react-redux';

let menuobj=[];
const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    },
    error: {
        color: "#f85032",
        fontSize: "12.8px",
    },
}))

const UpdateModuleMenu = (props) => {

    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const datasample = props.datasample ? props.datasample : {};
    const [menList, setMenuList] = useState([])
    const [errors, setErrors] = useState({});
    const defaultValues = { }
    const menuItems = { parentId: "", name:"", url:"", breadcrumb: "", tootip:"", iconvalue:""}
    //const defaultDetailValuesOtherDetails = { name: "", email:"", address:"", phone:""}
    //const [otherDetailFields, setOtherDetailFields] = useState(false);
    //const [locationList, setLocationList] = useState({ stateName:"", lga:""})
    const [otherDetails, setOtherDetails] = useState(datasample);
    const [details, setDetails] = useState(menuItems);
    //const [otherDetailsFields, setOtherDetailsFields] = useState(defaultDetailValuesOtherDetails);
    const [relativesLocation, setRelativesLocation] = useState(props.moduleMenuList ? props.moduleMenuList : []);
    const [locationListArray2, setLocationListArray2] = useState()

    //Function to get list of module menu
    useEffect(() => {
        async function getMenus() {
            axios
                .get(`${baseUrl}menu`)
                .then((response) => {
                    //console.log(response)
                    setMenuList(
                        Object.entries(response.data).map(([key, value]) => ({
                            label: value.name,
                            value: value.id,
                        }))
                    );
                    menuobj = menList
                })
                .catch((error) => {
                    //console.log(error);
                });
        }
        getMenus();
    }, []);
    useEffect(() => {
        loadModuleMenus()
    }, [datasample.id]); //componentDidMount to get module menus
    //Method to load module menus
    const loadModuleMenus =()=>{
        setLoading(true);
        const onSuccess = () => {
            setLoading(false)
            //setRelativesLocation([props.moduleMenuList])
        }
        const onError = () => {
            setLoading(false)
        }
        props.getModuleMenus(datasample.id,onSuccess,onError );
    }
    const handleOtherFieldInputChange = e => {
        setDetails ({ ...details, [e.target.name]: e.target.value });
    }
    const validate = () => {
        let temp = { ...errors }
        temp.parentId = details.parentId ? "" : "This field is required"
        temp.url = details.url ? "" : "This field is required"
        temp.name = details.name ? "" : "This field is required"

        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }
    const addLocations2 = e => {
        if(validate()){

            //details['parentOrganisationUnitId']= otherfields.parentOrganisationUnitId
            details['details']= otherDetails
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
    //Assign menuList to MenuObj
    menuobj = menList
    //Function to cancel the process
    const closeModal = ()=>{
        //resetForm()
        props.togglestatus()
        //setDetails(defaultDetailValues)
        //setErrors({})
    }

    //Method to update module menu
    const UpdateModuleMenu = e => {
        e.preventDefault()
        if(relativesLocation.length >0 && validate()){
            //const parentOrganisationUnitId = otherfields.parentOrganisationUnitId
            // const orgUnitIDParam = props.orgUnitID.id
            // console.log(orgUnitIDParam)
            // console.log(parentOrganisationUnitId)
            // console.log(relativesLocation)

            setLoading(true);
            // const onSuccess = () => {
            //     props.loadOrgUnit()
            //     setLoading(false)
            //     setDetails(defaultDetailValues)
            //     setOtherDetails(defaultValues)
            //     setLocationListArray2([])
            //     props.togglestatus()
            //
            //     resetForm()
            //
            // }
            // const onError = () => {
            //     setLoading(false)
            //     setOtherDetails(defaultValues)
            //     setDetails(defaultDetailValues)
            //     setLocationListArray2([])
            //     props.togglestatus()
            // }
            //props.createOrgUnitLevel(relativesLocation,parentOrganisationUnitId,orgUnitIDParam, onSuccess, onError);
            return

        }else if(!validate()){
            return
        }else{
            toast.error("Organisation Unit can't be empty")
        }

    }
    console.log(props.moduleMenuList)
    console.log(relativesLocation)
    return (
        <div >

            <Modal show={props.modalstatus} toggle={props.togglestatus} className={props.className} size="xl">
                <Modal.Header toggle={props.togglestatus}>
                    <Modal.Title>Update Module Menu </Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={props.togglestatus}
                    ></Button>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <CardBody>

                            <div className="col-xl-12 col-lg-12">
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">{datasample.name}</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="basic-form">
                                            <form onSubmit={(e) => e.preventDefault()}>
                                                <h5 className="card-title">Module Menu </h5>
                                                <br/>
                                                <div className="row">
                                                    <div className="form-group mb-3 col-md-4">
                                                        <label>Parent Menu</label>
                                                        <select
                                                            value={details.parentId}
                                                            id="parentId"
                                                            name="parentId"
                                                            className="form-control"
                                                            onChange={handleOtherFieldInputChange}
                                                        >
                                                            <option value="" disabled>
                                                                Choose...
                                                            </option>
                                                            {menList.map(({ label, value }) => (
                                                                <option key={value} value={value}>
                                                                    {label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.parentId !=="" ? (
                                                            <span className={classes.error}>{errors.parentId}</span>
                                                        ) : "" }
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label>Menu Name</label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            className="form-control"
                                                            value={details.name}
                                                            onChange={handleOtherFieldInputChange}
                                                        />
                                                        {errors.name !=="" ? (
                                                            <span className={classes.error}>{errors.name}</span>
                                                        ) : "" }
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label>Menu Link/Url</label>
                                                        <input
                                                            type="text"
                                                            name="url"
                                                            id="url"
                                                            className="form-control"
                                                            value={details.url}
                                                            onChange={handleOtherFieldInputChange}
                                                        />
                                                        {errors.url !=="" ? (
                                                            <span className={classes.error}>{errors.url}</span>
                                                        ) : "" }
                                                    </div>

                                                    {/*Second Row of the Field by Col */}
                                                    <div className="form-group mb-3 col-md-4">
                                                        <label>Breadcrumb</label>
                                                        <input
                                                            type="text"
                                                            name="breadcrumb"
                                                            id="breadcrumb"
                                                            className="form-control"
                                                            value={details.breadcrumb}
                                                            onChange={handleOtherFieldInputChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label> Icon</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="iconvalue"
                                                            name="iconvalue"
                                                            value={details.iconvalue}
                                                            onChange={handleOtherFieldInputChange}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-3">
                                                        <label>Tooltip</label>
                                                        <input
                                                            type="text"
                                                            name="tooltip"
                                                            id="tooltip"
                                                            className="form-control"
                                                            value={details.tooltip}
                                                            onChange={handleOtherFieldInputChange}
                                                        />
                                                    </div>

                                                    <div className="form-group col-md-2">

                                                        <LabelSui as='a' color='black'  onClick={addLocations2} size='' style={{ marginTop:35}}>
                                                            <Icon name='plus' /> Add
                                                        </LabelSui>
                                                    </div>
                                                </div>

                                            {/*    array addition list when click on the Add button*/}
                                                <Col md={12}>
                                                    <div className="">
                                                        {relativesLocation.length >0
                                                            ?
                                                            <List>
                                                                <Table  striped responsive>
                                                                    <thead >
                                                                    <tr>
                                                                        <th>Parent Menu</th>
                                                                        <th>Menu Name</th>
                                                                        <th >Menu Link</th>
                                                                        <th>Menu Icon</th>
                                                                        <th>Menu Breadcrumb</th>
                                                                        <th >Menu Tooltip</th>
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
                                            {/*End of the Menu List Array */}
                                                <MatButton
                                                    type='submit'
                                                    variant='contained'
                                                    color='primary'
                                                    className={classes.button}
                                                    startIcon={<SaveIcon />}
                                                    disabled={loading}
                                                    onClick={UpdateModuleMenu}

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
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Modal.Body>
            </Modal>
        </div>
    );
}

function RelativeList({
                          relative,
                          index,
                          removeRelativeLocation,
                      }) {

    function ParentName (parentID){
        console.log(parentID)
        if(parentID!=="") {
            const getactualmenu = menuobj.filter(x => x.value === parseInt(parentID))

            //return getactualmenu[0].label
        }
    }

    return (
        <tr>
            <th>{ParentName(relative.parentId!==null ? relative.parentId :" ")}</th>
            <th>{relative.name}</th>
            <th>{relative.url}</th>
            <th><i className={relative.iconvalue} /></th>
            <th>{relative.breadcrumb}</th>
            <th>{relative.tooltip}</th>
            <th >
                <IconButton aria-label="delete" size="small" color="error" onClick={() =>removeRelativeLocation(index)}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton>

            </th>
        </tr>
    );
}

const mapStateToProps = (state, ownProps) => {
    return {
        moduleMenuList: state.boostrapmodule.moduleMenuList,

    };
};

const mapActionToProps = {
    getModuleMenus: getModuleMenus,
    updateModuleMenu: updateModuleMenu
};
export default connect(mapStateToProps, mapActionToProps)(UpdateModuleMenu);;
