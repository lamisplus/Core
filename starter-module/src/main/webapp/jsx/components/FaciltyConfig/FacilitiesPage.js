import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import PageTitle from "../../layouts/PageTitle";
import {Card, CardContent} from "@material-ui/core";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import {FaPlus} from "react-icons/fa";
import FacilitiesList from "./FacilitiesList";

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));

function FacilitiesPage(props) {
    const classes = useStyles();
    return (
        <div>
            <PageTitle activeMenu="List" motherMenu="Facility" />

            <Card className={classes.cardBottom}>
                <CardContent>
                    <Link to="/facility-config">
                        <Button
                            variant="contained"
                            color="primary"
                            className=" float-end ms-2"
                            startIcon={<FaPlus size="10" style={{color:'#fff'}}/>}
                            style={{backgroundColor:'#014d88'}}
                        >
                            <span style={{ textTransform: "capitalize" }}>Add Facility</span>
                        </Button>
                    </Link>
                    <br />

                    <br />
                    <FacilitiesList />
                </CardContent>
            </Card>
        </div>
    );
}

export default FacilitiesPage;