import axios from "axios";
import { url as baseUrl } from "./../../../api";
import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import {Link, useHistory} from "react-router-dom";
import { fetchRoles, deleteRole, updateRole } from "./../../../actions/role";
import { makeStyles } from "@material-ui/core/styles";
import "./RolesList.css";
import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import MatButton from "@material-ui/core/Button";

import "@reach/menu-button/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import {  Modal } from "react-bootstrap";
import { Icon, Label} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { forwardRef } from 'react';
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
let roleId = 0;

const RoleList = (props) => {
  let history = useHistory();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
 
  useEffect(() => {
    fetchRole()
  }, []);
const fetchRole =()=>{
  const onSuccess = () => {
    setLoading(false);
  };
  const onError = () => {
    setLoading(false);
  };
  props.fetchAllRoles(onSuccess, onError);
}
  /* Get list of Permissions from the server */

  const deleteRoleModal = (id) => {
    roleId = id;
    setModal(!modal);

  };

  const onDelete = (id) => {
    const onSuccess = () => {
      setModal(false)
      fetchRole()
      toast.success("Role Deleted Successfully");          
      history.push("/roles")
      //return;
    };
    const onError = () => {
      toast.error("Something went wrong");
      //return;
    };
    props.deleteRole(id, onSuccess,onError);  
      
      
  };

  
  return (
    <div>
      <ToastContainer autoClose={3000} hideProgressBar />
      <MaterialTable
      icons={tableIcons}
        title="Role List"
        columns={[
          { title: "Id", field: "id", filtering: false },
          { title: "Name", field: "name" },
         
          { title: "Actions", field: "actions", filtering: false },
        ]}
        isLoading={loading}
        data={props.rolesList.map((row) => ({
          id: row.id,
          name: row.name,
         
          actions: (
            <div>
              <Link to={{pathname: "/edit-role", state: { row: row }}}
              >
              <Label as='a' color='blue' className="ms-1" size='mini'>
                <Icon name='pencil' /> Edit
              </Label>
              </Link>
              <Label as='a' color='red' onClick={() =>  deleteRoleModal(row.id)}  size='mini'>
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
            width: "150%",
            margingLeft: "150px",
          },
          filtering: false,
          exportButton: false,
          searchFieldAlignment: "left",
        }}
      />
        <Modal show={modal} >

        <Modal.Header>
          <Modal.Title>Delete Role</Modal.Title>
          <Button
              variant=""
              className="btn-close"
              onClick={() => setModal(false)}
          >

          </Button>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete Role</p>
        </Modal.Body>
        <Modal.Footer>
          <MatButton
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            startIcon={<SaveIcon />}
            
            onClick={() => onDelete(roleId)}
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
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    rolesList: state.roles.list,
    //rolesList: [],
  };
};

const mapActionToProps = {
  fetchAllRoles: fetchRoles,
  deleteRole: deleteRole,
  updateRole: updateRole
};

export default connect(mapStateToProps, mapActionToProps)(RoleList);
