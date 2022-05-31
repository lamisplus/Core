import React, { useState } from "react";
import { Button, Dropdown, Menu } from "semantic-ui-react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
//import * as CODES from "api/codes";
import { ToastContainer, toast } from "react-toastify";
import {Link} from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    navItemText: {
        padding: theme.spacing(2),
    },
}));

function SubMenu(props) {
    const classes = useStyles();


    return (
        <React.Fragment>
            <Menu size="mini" color={"black"} inverted>
                <Dropdown text="Laboratory"   labeled simple    className='icon link item'>
                    <Dropdown.Menu >
                        <Dropdown.Item color={"black"}>
                            <Link style={{color:"#000000"}}>
                                Sample Collection
                            </Link>
                        </Dropdown.Item>

                        <Dropdown.Item style={{color:"#000000"}} >
                            <Link  style={{color:"#000000"}}>
                                Radiology
                            </Link>
                        </Dropdown.Item>


                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item>  <Link  >Covid 19 </Link></Menu.Item>
                <Menu.Item>  <Link  >Malaria</Link></Menu.Item>
                <Menu.Item>  <Link >Tuberculosis </Link></Menu.Item>
            </Menu>
            <ToastContainer />
        </React.Fragment>
    );
}

// const mapStateToProps = (state) => {
//     return {
//         patient: state.patients.patient,
//         relationships: state.applicationCodesets.relationships
//     };
// };

// const mapActionToProps = {
//     checkOutPatient: update,
//     fetchPatientByHospitalNumber: fetchByHospitalNumber,
//     fetchApplicationCodeSet: fetchApplicationCodeSet,
// };

export default connect(null, null)(SubMenu);
