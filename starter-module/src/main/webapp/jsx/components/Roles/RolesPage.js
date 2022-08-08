import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Card, CardContent } from "@material-ui/core";
import { FaPlus } from "react-icons/fa";
import { TiArrowBack } from 'react-icons/ti'
import { makeStyles } from "@material-ui/core/styles";
import RoleList from "./RolesList";
//import FilteringTable from "./RoleTable/FilteringTable"
import PageTitle from "./../../layouts/PageTitle";



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

  return (
    <div>
       <PageTitle activeMenu="Role List" motherMenu="Roles" />

      <Card className={classes.cardBottom}>
        <CardContent>
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
            <br />

          <br />
          <RoleList />
        </CardContent>
      </Card>
    </div>
  );
};

export default RolePage;
