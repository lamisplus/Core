import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Card, CardContent } from "@material-ui/core";
import { FaPlus } from "react-icons/fa";
import { TiArrowBack } from 'react-icons/ti'
import { makeStyles } from "@material-ui/core/styles";
import RoleList from "./RolesList";
//import FilteringTable from "./RoleTable/FilteringTable"
import PageTitle from "./../../layouts/PageTitle";
import ImportRolesModal from "./ImportRolesModal";
import { fetchRoles } from "./../../../actions/role";



const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const RolePage = (props) => {
  const classes = useStyles();
  const [importModal, setImportModal] = useState(false)
  const toggleImportModal = () => {
    setImportModal(!importModal)
  }
  const openImportModal = () => {
    toggleImportModal()
  }

  const fetchRole =()=>{
    const onSuccess = () => {
      // setLoading(false);
    };
    const onError = () => {
      // setLoading(false);
    };
    fetchRoles(onSuccess, onError);
  }

  return (
    <div>
       <PageTitle activeMenu="Role List" motherMenu="Roles" />
       <ImportRolesModal showImportModal={importModal} toggleImportModal={toggleImportModal}/>

      <Card className={classes.cardBottom}>
        <CardContent>
          <div>
              <Button
                variant="contained"
                color="primary"
                className=" float-end ms-2"
                startIcon={<FaPlus size="10" style={{color:'#fff'}}/>}
                style={{backgroundColor:'#014d88'}}
                onClick={()=> openImportModal()}
              >
                <span style={{ textTransform: "capitalize" }}>Import Roles</span>
              </Button>
            <Link to="/add-role">
              <Button
                variant="contained"
                color="primary"
                className=" float-end ms-2"
                startIcon={<FaPlus size="10" style={{color:'#fff'}}/>}
                style={{backgroundColor:'#014d88'}}
              >
                <span style={{ textTransform: "capitalize" }}>New Role </span>
              </Button>
            </Link>
          </div>
            <br />

          <br />
          <RoleList />
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePage;
