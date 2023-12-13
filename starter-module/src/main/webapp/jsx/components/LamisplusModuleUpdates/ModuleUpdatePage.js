import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import PageTitle from "../../layouts/PageTitle";
import {Card, CardContent} from "@material-ui/core";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {FaPlus} from "react-icons/fa";
import ModuleUpdateList from "./ModuleUpdateList";

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

function OrganizationPage(props) {
    const classes = useStyles();
    return (
        <div>
            <PageTitle activeMenu="List" motherMenu="LAMISPlus Module Update" />

            <Card className={classes.cardBottom}>
                <CardContent>
                    <Link to="/add-module-update">
                        <Button
                            variant="contained"
                            color="primary"
                            className=" float-end ms-2"
                            startIcon={<FaPlus size="10" style={{color:'#fff'}}/>}
                            style={{backgroundColor:'#014d88'}}
                        >
                            <span style={{ textTransform: "capitalize" }}>Add Module </span>
                        </Button>
                    </Link>
                    <br />

                    <br />
                    {/* conponentto show the organc=isation list */}
                    <ModuleUpdateList />
                </CardContent>
            </Card>
        </div>
    );
}

export default OrganizationPage;