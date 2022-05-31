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
import CancelIcon from "@material-ui/icons/Cancel";
import { getModuleMenus, updateModuleMenu, addModuleMenu} from '../../../actions/bootstrapModule';
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
    const defaultValues = { }
    const menuItems = { parentId: "", name:"", url:"", breadcrumb: "", tooltip:"", icon:"", type:"", level:"",state:"", disabled: true,}
    const [details, setDetails] = useState(menuItems);

    //Function to get list of module menu
    useEffect(() => {
        async function getMenus() {
            axios
                .get(`${baseUrl}menus`)
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

    //Function to cancel the process
    const closeModal = ()=>{
        //resetForm()
        props.togglestatus()
        //setDetails(defaultDetailValues)
        //setErrors({})
    }

    //Method to update module menu
    const AddMenu = e => {
        e.preventDefault()
        if(validate()){
            details["moduleId"] = datasample.id

            setLoading(true);
            const onSuccess = () => {
                props.loadModuleMenus()
                props.togglestatus()
                setLoading(false)
            }
            const onError = () => {
                setLoading(false)
            }
            props.addModuleMenu(details, onSuccess, onError);
            return

        }

    }

    return (
        <div >

            <Modal show={props.modalstatus} toggle={props.togglestatus} className={props.className} size="xl">
                <Modal.Header toggle={props.togglestatus}>
                    <Modal.Title>Add Module Menu </Modal.Title>
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
                                                    <div className="form-group mb-3 col-md-4">
                                                        <label>Menu Type(Position)</label>
                                                        <select
                                                            value={details.type}
                                                            id="type"
                                                            name="type"
                                                            className="form-control"
                                                            onChange={handleOtherFieldInputChange}
                                                        >
                                                            <option value="" >Choose...</option>
                                                            <option value="sidebar" >Sidebar</option>
                                                            <option value="component" >Component</option>
                                                            <option value="both" >Both</option>
                                                        </select>
                                                        {errors.type !=="" ? (
                                                            <span className={classes.error}>{errors.type}</span>
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
                                                            id="icon"
                                                            name="icon"
                                                            value={details.icon}
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

                                                </div>


                                                <MatButton
                                                    type='submit'
                                                    variant='contained'
                                                    color='primary'
                                                    className={classes.button}
                                                    startIcon={<SaveIcon />}
                                                    disabled={loading}
                                                    onClick={AddMenu}

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

const mapStateToProps = (state, ownProps) => {
    return {
        moduleMenuList: state.boostrapmodule.moduleMenuList,

    };
};

const mapActionToProps = {
    getModuleMenus: getModuleMenus,
    addModuleMenu: addModuleMenu
};
export default connect(mapStateToProps, mapActionToProps)(UpdateModuleMenu);;
