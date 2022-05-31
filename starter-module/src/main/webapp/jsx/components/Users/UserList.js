import axios from "axios";
import { url as baseUrl } from "./../../../api";
import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { fetchUsers, deleteUser } from "./../../../actions/user";
import "./UserList.css";
import "@reach/menu-button/styles.css";
import { ToastContainer, toast } from "react-toastify";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import MatButton from "@material-ui/core/Button";
import {  Badge} from "react-bootstrap";

import { makeStyles } from "@material-ui/core/styles";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import AssignFacilityModal from "./AssignFacilityModal";
import { forwardRef } from 'react';
import {  Modal } from "react-bootstrap";
import {  Icon, Label} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import {Link, useHistory} from 'react-router-dom'
import { Button} from "react-bootstrap";

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

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

let userId = 0;
let currentUser = {};

const UserList = (props) => {
    let history = useHistory();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [assignFacilityModal, setAssignFacilityModal] = useState(false);
  const [roles, setRoles] = useState([]);


  useEffect(() => {
    fetchUsers()
  }, []);
    const handleClose = () => setModal(false);
  const fetchUsers = ()=> {
    const onSuccess = () => {
      setLoading(false);
    };
    const onError = () => {
      setLoading(false);
    };
    props.fetchAllUsers(onSuccess, onError);
  }
  /* Get list of Roles from the server */
  useEffect(() => {
    async function getCharacters() {
      axios
        .get(`${baseUrl}roles`)
        .then((response) => {
          setRoles(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.name,
              value: value.name,
            }))
          );
        })
        .catch((error) => {

        });
    }
    getCharacters();
  }, []);

  const deleteUserModal = (id) => {
    userId = id;
    setModal(!modal);

  };

  const onDelete = (id) => {
    const onSuccess = () => {
      fetchUsers()
      toast.success("User Deleted Successfully");
      setModal(false)
      history.push("/users")
      return;
    };
    const onError = () => {
      //toast.error("Something went wrong");
      return;
    };
    props.deleteUser(id, onSuccess,onError);  
      
      
  };

  return (
    <div>
      <ToastContainer autoClose={3000} hideProgressBar />
      <MaterialTable
      icons={tableIcons}
        title="Users"
        columns={[
          { title: "Name", field: "name" },
          { title: "Username", field: "userName", filtering: false },
          //{ title: "Gender", field: "gender", filtering: false },
          { title: "Roles", field: "roles", filtering: false },
          { title: "Actions", field: "actions", filtering: false },
        ]}
        isLoading={loading}
        data={props.usersList.map((row) => ({
          name: row.firstName + " " + row.lastName,
          userName: row.userName,
          //gender: row.gender,
          roles: ( <Badge variant="primary badge-xs light">{row.roles.toString()}</Badge>),
          actions: (
            <div>
                <Link to={{pathname: "/edit-user", state: { user: row, defRole: roles  }}}
                >
                <Label as='a' color='blue' className="ms-1" size='mini'>
                    <Icon name='pencil' /> Edit
                </Label>
                </Link>
                <Label as='a' color='red' onClick={() => deleteUserModal( row.id)} size='mini'>
                    <Icon name='trash' /> Delete
                </Label>

             
            </div>

          ),
        }))}
        options={{
          headerStyle: {
            
            color: "#000",
          },
          searchFieldStyle: {
            width: "300%",
            margingLeft: "250px",
          },
          filtering: false,
          exportButton: false,
          searchFieldAlignment: "left",
        }}
      />
       <Modal show={modal}>

          <Modal.Header>
              <Modal.Title>Delete User</Modal.Title>
              <Button
                  variant=""
                  className="btn-close"
                  onClick={() => setModal(false)}
              >

              </Button>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete User</p>
          </Modal.Body>
          <Modal.Footer>
            <MatButton
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<SaveIcon />}
              
              onClick={() => onDelete(userId)}
            >
            Yes
            </MatButton>
            <MatButton
              variant="contained"
              className={classes.button}
              startIcon={<CancelIcon />}
              onClick={() => setModal(false)}
            >
              <span style={{ textTransform: "capitalize" }}>
                Cancel
              </span>
            </MatButton>
          </Modal.Footer>
          </Modal>
      <AssignFacilityModal
          showModal={assignFacilityModal} toggleModal={() => setAssignFacilityModal(!assignFacilityModal)} user={currentUser}/>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    usersList: state.users.list,
    //usersList: [],
  };
};

const mapActionToProps = {
  fetchAllUsers: fetchUsers,
  //updateUserRole: updateUserRole,
  deleteUser: deleteUser,
};

export default connect(mapStateToProps, mapActionToProps)(UserList);
