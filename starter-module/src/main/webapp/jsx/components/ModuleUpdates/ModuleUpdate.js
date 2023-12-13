import React, {useEffect, forwardRef} from 'react';
import MaterialTable from 'material-table';
import { connect } from "react-redux";
import { fetchAll, deleteApplicationCodeset} from "./../../../actions/applicationCodeset";
import {
    Card,
    CardBody,  Spinner,
} from 'reactstrap';
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link } from 'react-router-dom'
import ButtonMui from "@material-ui/core/Button";
import {FaEye, FaPlus} from "react-icons/fa";
//import NewApplicationCodeset from "./NewApplicationCodeset";
import SaveIcon from "@material-ui/icons/Delete";
import CancelIcon from "@material-ui/icons/Cancel";
import {makeStyles} from "@material-ui/core/styles";
import { ToastContainer, toast } from "react-toastify";
import PageTitle from "./../../layouts/PageTitle";
import { Button, Modal} from "react-bootstrap";

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {Icon, Label} from "semantic-ui-react";
import {MdModeEdit, MdPerson, MdDelete} from "react-icons/md";
import SplitActionButton from "../Button/SplitActionButton";
// import EditIcon from "@material-ui/icons/Edit";
// import DeleteIcon from "@material-ui/icons/Delete";

const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles(theme => ({
    button: {
        margin: theme.spacing(1)
    }
}))
const ApplicationCodesetSearch = (props) => {
    const [loading, setLoading] = React.useState(true);
    const [deleting, setDeleting] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [currentCodeset, setCurrentCodeset] = React.useState(null);
    const toggleModal = () => setShowModal(!showModal)
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal)
    const classes = useStyles()

    useEffect(() => {
        loadApplicationCodeset()
    }, []); //componentDidMount

 const loadApplicationCodeset = () => {
     const onSuccess = () => {
         setLoading(false);
     };
     const onError = () => {
         setLoading(false);
     };
     props.fetchAll(onSuccess, onError);
    }

const processDelete = (id) => {
     setDeleting(true);
    const onSuccess = () => {
        setDeleting(false);
        toggleDeleteModal();
        toast.success("Application codeset deleted successfully!");
        loadApplicationCodeset();
    };
    const onError = () => {
        setDeleting(false);
        toast.error("Something went wrong, please contact administration");
    };
    props.delete(id, onSuccess, onError);
    }
    const openApplicationCodeset = (row) => {
        setCurrentCodeset(row);
        toggleModal();
    }

    const deleteApplicationCodeset = (row) => {
        setCurrentCodeset(row);
        toggleDeleteModal();
    }
    function actionItems(row){
        return  [
            {
                type:'link',
                name:'View',
                icon:<FaEye  size="22"/>,
                to:{}
            },
            {
                type:'button',
                name:'Edit',
                icon:<MdModeEdit size="20" color='#014d88' />,
                onClick:(() => openApplicationCodeset(row))
            },
            {
                type:'button',
                name:'Delete',
                icon:<MdDelete size="20" color='#014d88' />,
                onClick:(() => deleteApplicationCodeset( row))
            }
        ]
    }

    const update= [
        {
            "name":"HIV/ART",
            "version":"2.1.5",
            "dateReleased":"11/02/2023",
            "currentVersion":"2.1.4"

        },
        {
            "name":"Report",
            "version":"2.1.5",
            "dateReleased":"11/02/2023",
            "currentVersion":"2.1.4"

        }
    ]
    return (
        <div>
        <PageTitle activeMenu="Module Update" motherMenu="Module Update" />
            <Card>
                <ToastContainer />
              <CardBody>
                   <div className={"d-flex justify-content-end pb-2"}>
                       
                        <ButtonMui variant="contained"
                          color="primary"
                          startIcon={<FaPlus size="10"/>}
                          onClick={() => openApplicationCodeset(null)}
                                   style={{backgroundColor:'#014d88'}}
                        >
                            <span style={{textTransform: 'capitalize'}}>Refresh</span>
                        </ButtonMui>

                    </div>
                    <MaterialTable
                    icons={tableIcons}
                        title="LAMISPlus Module Update"
                        columns={[
                            {
                                title: "Module Name",
                                field: "name",
                            },
                            { title: "Latest Version", field: "version" },
                            { title: "Date Released", field: "dateReleased" },
                            { title: "Current Version", field: "currentVersion" },
                            { title: "Action", field: "action" },
                        ]}
                        isLoading={loading}
                        data={update.map((row) => ({
                            name: row.name,
                            
                            version: row.version,
                            dateReleased: row.dateReleased,
                            currentVersion: row.currentVersion,
                            action:
                            <div>
                                {/*<SplitActionButton actions={actionItems(row)} />*/}
                               <Label as='a' color='blue' className="ms-1" size='mini' onClick={() => openApplicationCodeset(row)}>
                                    <Icon name='pencil' /> Download
                                </Label>

                                <Label as='a' color='red' onClick={() => deleteApplicationCodeset( row)} size='mini'>
                                    <Icon name='eye' /> Release Note
                                </Label>

                            </div>

                        }))}

                        
                        //overriding action menu with props.actions
                        components={props.actions}
                        options={{
                            headerStyle: {
                                backgroundColor: "#014d88",
                                color: "#fff",
                                fontSize:'16px',
                                padding:'10px',
                                zIndex:'3',
                            },
                            searchFieldStyle: {
                                width : '250%',
                                margingLeft: '250px',
                            },
                            filtering: false,
                            exportButton: false,
                            searchFieldAlignment: 'left',
                            actionsColumnIndex: -1
                        }}
                    />
            </CardBody>

        </Card>
    </div>
    );
}

const mapStateToProps = state => {

    return {
        applicationCodesetList: state.applicationCodesets.applicationCodesetList
    };
};

const mapActionToProps = {
    fetchAll: fetchAll,
    delete: deleteApplicationCodeset
};

export default connect(mapStateToProps, mapActionToProps)(ApplicationCodesetSearch);