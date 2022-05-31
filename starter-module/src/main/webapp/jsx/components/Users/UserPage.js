import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Card, CardContent } from "@material-ui/core";
import {  FaUserPlus } from "react-icons/fa";
import { makeStyles } from "@material-ui/core/styles";
import UserList from "./UserList";
//import FilteringTable from "./FilteringTable/FilteringTable"
import PageTitle from "./../../layouts/PageTitle";
//import UiModal from "./modaltest"
import { ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const UserPage = (props) => {
  const classes = useStyles();

  return (
    <div>
    <ToastContainer autoClose={3000} hideProgressBar />
      <PageTitle activeMenu="User List" motherMenu="Users" />
      <Card className={classes.cardBottom}>
        <CardContent>
            <Link to="/user-registration">
              <Button
                variant="contained"
                color="primary"
                className="me-2 float-end"
                startIcon={<FaUserPlus />}
              >
                <span style={{ textTransform: "capitalize" }}>New User</span>
              </Button>
            </Link>
            <br />
         
          <br />
          <UserList />
      </CardContent>
      </Card>  
    </div>
  );
};

export default UserPage;
