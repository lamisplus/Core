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
//import EditIcon from "@material-ui/icons/EditIcon";
import {makeStyles} from "@material-ui/core/styles";
import {toast} from "react-toastify";
import SaveIcon from "@material-ui/icons/Save";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CancelIcon from "@material-ui/icons/Cancel";
import { getModuleMenus,  editModuleMenu} from '../../../actions/bootstrapModule';
import { connect } from 'react-redux';
import {useHistory} from "react-router-dom";

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
    let history = useHistory();
    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const datasample = props.datasample ? props.datasample : {};
    const [menList, setMenuList] = useState([])
    const [errors, setErrors] = useState({});
    const [details, setDetails] = useState(props.datasample);

    useEffect(() => {
        setDetails(props.datasample)
    }, [props.datasample]);

    //Function to get list of module menu
    useEffect(() => {
        async function getMenus() {
            axios
                .get(`${baseUrl}menus`)
                .then((response) => {
                    const filterMenuId=response.data.filter((x)=> x.id!==props.datasample.id)
                    setMenuList(
                        Object.entries(filterMenuId).map(([key, value]) => ({
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
    }, [props.datasample]);

    const handleOtherFieldInputChange = e => {
        setDetails ({ ...details, [e.target.name]: e.target.value });
    }
    const validate = () => {
        let temp = { ...errors }
        //temp.parentId = details.parentId ? "" : "This field is required"
        temp.url = details.url ? "" : "This field is required"
        temp.name = details.name ? "" : "This field is required"

        setErrors({
            ...temp
        })
        return Object.values(temp).every(x => x == "")
    }

    //Function to cancel the process
    const closeModal = ()=>{
        //resetForm()
        props.togglestatus()
        //setDetails(defaultDetailValues)
        //setErrors({})
    }

    //Method to update module menu
    const EditMenu = e => {
        e.preventDefault()
        if(validate()){
            setLoading(true);

            const onSuccess = () => {
                props.loadModuleMenus()
                props.togglestatus()
                setLoading(false)
            }
            const onError = () => {
                setLoading(false)

            }
            props.editModuleMenu(details.id, details, onSuccess, onError);
            return

        }

    }
    const CaretDownIcon = () => {
        return <ArrowDropDownIcon/>;
    };

    return (
        <div >

            <Modal show={props.modalstatus} toggle={props.togglestatus} className={props.className} size="xl" style={{padding:'0px'}}>
                <Modal.Header toggle={props.togglestatus} >
                    <Modal.Title style={{color:'#014d88', fontWeight:'bolder'}}>Edit  Menu </Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={props.togglestatus}
                    ></Button>
                </Modal.Header>
                <Modal.Body style={{padding:'0.875rem'}}>
                    <Card style={{padding:'0px'}}>
                        <CardBody style={{padding:'0px'}}>

                            <div className="col-xl-12 col-lg-12">
                                <div className="card" style={{padding:'0px'}}>
                                    <div className="card-header">
                                        <h5 className="card-title" style={{color:'#014d88',fontWeight:'bolder'}}>{datasample.name}</h5>
                                    </div>
                                    <div className="card-body">
                                        <div className="basic-form">
                                            <form onSubmit={(e) => e.preventDefault()}>

                                                <br/>
                                                <div className="row" style={{paddingBottom:"35px"}}>
                                                    <div className="form-group mb-3 col-md-4">
                                                        <label style={{color:'#014d88',fontWeight:'bolder'}}>Parent Menu</label>
                                                        <select
                                                            value={details.parentId}
                                                            id="parentId"
                                                            name="parentId"
                                                            className="form-control"
                                                            onChange={handleOtherFieldInputChange}
                                                            style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder',appearance:'auto'}}
                                                        >
                                                            <option value=" " >
                                                                Choose...
                                                            </option>
                                                            {menList.map(({ label, value }) => (
                                                                <option key={value} value={value} >
                                                                    {label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.parentId !=="" ? (
                                                            <span className={classes.error}>{errors.parentId}</span>
                                                        ) : "" }
                                                    </div>
                                                    {/*<div className="form-group mb-3 col-md-4">*/}
                                                    {/*    <label>Menu Type(Position)</label>*/}
                                                    {/*    <select*/}
                                                    {/*        value={details.type}*/}
                                                    {/*        id="type"*/}
                                                    {/*        name="type"*/}
                                                    {/*        className="form-control"*/}
                                                    {/*        onChange={handleOtherFieldInputChange}*/}
                                                    {/*    >*/}
                                                    {/*        <option value="" >Choose...</option>*/}
                                                    {/*        <option value="sidebar" >Sidebar</option>*/}
                                                    {/*        <option value="component" >Component</option>*/}
                                                    {/*        <option value="both" >Both</option>*/}
                                                    {/*    </select>*/}
                                                    {/*    {errors.type !=="" ? (*/}
                                                    {/*        <span className={classes.error}>{errors.type}</span>*/}
                                                    {/*    ) : "" }*/}
                                                    {/*</div>*/}
                                                    <div className="form-group col-md-4">
                                                        <label style={{color:'#014d88',fontWeight:'bolder'}}>Menu Name</label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            className="form-control"
                                                            value={details.name}
                                                            onChange={handleOtherFieldInputChange}
                                                            style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder'}}
                                                        />
                                                        {errors.name !=="" ? (
                                                            <span className={classes.error}>{errors.name}</span>
                                                        ) : "" }
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label style={{color:'#014d88',fontWeight:'bolder'}}>Menu Code</label>
                                                        <input
                                                            type="text"
                                                            name="code"
                                                            id="code"
                                                            className="form-control"
                                                            value={details.code}
                                                            onChange={handleOtherFieldInputChange}
                                                            style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder'}}
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-4">
                                                        <label style={{color:'#014d88',fontWeight:'bolder'}}>Menu Link/Url</label>
                                                        <input
                                                            type="text"
                                                            name="url"
                                                            id="url"
                                                            className="form-control"
                                                            value={details.url}
                                                            onChange={handleOtherFieldInputChange}
                                                            style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder'}}
                                                        />
                                                        {errors.url !=="" ? (
                                                            <span className={classes.error}>{errors.url}</span>
                                                        ) : "" }
                                                    </div>

                                                    {/*Second Row of the Field by Col */}
                                                    {/*<div className="form-group mb-3 col-md-4">*/}
                                                    {/*    <label>Breadcrumb</label>*/}
                                                    {/*    <input*/}
                                                    {/*        type="text"*/}
                                                    {/*        name="breadcrumb"*/}
                                                    {/*        id="breadcrumb"*/}
                                                    {/*        className="form-control"*/}
                                                    {/*        value={details.breadcrumb}*/}
                                                    {/*        onChange={handleOtherFieldInputChange}*/}
                                                    {/*    />*/}
                                                    {/*</div>*/}
                                                    <div className="form-group col-md-3">
                                                        <label style={{color:'#014d88',fontWeight:'bolder'}}> Icon</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="icon"
                                                            name="icon"
                                                            value={details.icon}
                                                            onChange={handleOtherFieldInputChange}
                                                            style={{height:"40px",border:'solid 1px #014d88',borderRadius:'5px', fontWeight:'bolder'}}
                                                        />
                                                    </div>
                                                    {/*<div className="form-group col-md-3">*/}
                                                    {/*    <label>Tooltip</label>*/}
                                                    {/*    <input*/}
                                                    {/*        type="text"*/}
                                                    {/*        name="tooltip"*/}
                                                    {/*        id="tooltip"*/}
                                                    {/*        className="form-control"*/}
                                                    {/*        value={details.tooltip}*/}
                                                    {/*        onChange={handleOtherFieldInputChange}*/}
                                                    {/*    />*/}
                                                    {/*</div>*/}

                                                </div>


                                                <MatButton
                                                    type='submit'
                                                    variant='contained'
                                                    color='primary'
                                                    className={classes.button}
                                                    startIcon={<SaveIcon />}
                                                    disabled={loading}
                                                    onClick={EditMenu}
                                                    style={{backgroundColor:'#014d88'}}

                                                >

                                                    <span style={{textTransform: 'capitalize'}}>Save  {loading ? <Spinner /> : ""}</span>
                                                </MatButton>
                                                <MatButton
                                                    variant='contained'
                                                    color='default'
                                                    onClick={closeModal}
                                                    startIcon={<CancelIcon style={{color:'#fff'}} />}
                                                    style={{backgroundColor:'#992E62'}}
                                                >
                                                    <span style={{textTransform: 'capitalize', color:'#fff'}}>Cancel</span>
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

const mapStateToProps = (state, ownProps) => {
    return {
        moduleMenuList: state.boostrapmodule.moduleMenuList,

    };
};

const mapActionToProps = {
    getModuleMenus: getModuleMenus,
    editModuleMenu: editModuleMenu
};
export default connect(mapStateToProps, mapActionToProps)(UpdateModuleMenu);;
