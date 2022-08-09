import React, {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import {url as baseUrl} from "./../../../api";
/// Image
import avatar from "../../../images/avatar/user-avatar-white.png";
import LogoutPage from './Logout';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authentication } from "./../../../_services/authentication";
import * as ACTION_TYPES from "./../../../actions/types";
import store from "./../../../store";
//import AssignFacilityModal from './../../components/Users/AssignFacilityModalFirst'

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';


const { dispatch } = store;

const Header = (props) => {
    const [user, setUser] = useState(null);
    //const [modal, setModal] = useState(false);
    const [roles, setRoles] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
    const [assignFacilityModal, setAssignFacilityModal] = useState(false);
    //TO ASSIGN FACILITIES
    const toggleAssignModal = () => {
        setAssignFacilityModal(!assignFacilityModal);
    }
    async function fetchMe() {
        if( authentication.currentUserValue != null ) {
            axios
                .get(`${baseUrl}account`)
                .then((response) => {
                    setUser(response.data);
                    // set user permissions in local storage for easy retrieval, when user logs out it will be removed from the local storage
                    localStorage.setItem('currentUser_Permission', JSON.stringify(response.data.permissions));
                    dispatch({
                        type: ACTION_TYPES.FETCH_PERMISSIONS,
                        payload: response.data.permissions,
                    });

                    if(response.data && response.data.currentOrganisationUnitId === null ){
                        toggleAssignModal()
                    }

                })
                .catch((error) => {
                    authentication.logout();
                    // console.log(error);
                });
        }
    }

    async function switchFacility (facility) {
        console.log(facility)
        await axios.post(`${baseUrl}users/organisationUnit/${facility}`, {})
            .then(response => {
                toast.success('Facility switched successfully!');
                fetchMe();
                //toggleAssignFacilityModal();
            }) .catch((error) => {
                toast.error('An error occurred, could not switch facility.');
            });

    }

    const currentUser = authentication.getCurrentUser();
    useEffect(() => {
        fetchMe();

    }, []);


    return (
        /*<div className="header" style={{ backgroundColor: '#303f9f', height:'55px' }}>*/
        <div className="header" style={{ backgroundColor: '#014d88', height:'65px' }}>
            <div className="header-content" style={{borderLeft: "solid 1px #fff"}}>
                <nav className="navbar navbar-expand">
                    <div className="collapse navbar-collapse justify-content-between">
                        <div className="header-left">
                            <div className="input-group search-area d-xl-inline-flex d-none" style={{color:'#d9fbff',fontSize:'18px', fontWeight:'bold',width:'auto'}}>
                                {/* Content can go here */}
                                {user && user.currentOrganisationUnitName?
                                    <div>
                                        <span style={{color:'#d9fbff',fontSize:'18px', fontWeight:'bold'}}>{'Welcome to' } </span><
                                        span>&nbsp;:</span>
                                        <span>&nbsp;</span>
                                        <span style={{color:'#fff',fontSize:'24px', fontWeight:'bold', marginLeft:'10px'}}>{user.currentOrganisationUnitName}</span>
                                    </div>

                                    :"No Default Facility"
                                }
                            </div>
                        </div>
                        <ul className="navbar-nav header-right main-notification">
                            <Dropdown as="li" className="nav-item dropdown header-profile">
                                <Dropdown.Toggle variant="" as="a" className="nav-link i-false c-pointer"
                                                 role="button" data-toggle="dropdown"
                                >
                                    <div className="header-info me-3">

                                        <small className="text-end fs-14 font-w400" style={{ color: '#ffffff' }}>{currentUser.name}</small>
                                    </div>
                                    <img src={avatar} alt="" style={{height:'45px',width:'45px'}} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="right" className="mt-2 dropdown-menu-end">
                                    <Link to="#" className="dropdown-item ai-icon" onClick={()=> window.open("https://datafinigeria.on.spiceworks.com/portal", "_blank")}>
                                        <i class="fa fa-bolt" aria-hidden="true"></i>
                                        <span className="ms-2">Help </span>
                                    </Link>
                                    <Link to={{pathname: "/account", state: { user: user, defRole: roles  }}} className="dropdown-item ai-icon">
                                        <svg
                                            id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary"
                                            width={18} height={18} viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth={2} strokeLinecap="round"strokeLinejoin="round"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx={12} cy={7} r={4} />
                                        </svg>
                                        <span className="ms-2">Account </span>
                                    </Link>




                                    <React.Fragment>
                                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center',marginLeft:'5px' }}>
                                            <Tooltip title="Account settings">
                                                <IconButton
                                                    onClick={handleClick}
                                                    size="small"
                                                    sx={{ ml: 2 }}
                                                    aria-controls={open ? 'account-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={open ? 'true' : undefined}
                                                >
                                                    <i className="fa fa-bolt" style={{color:'#992E62'}} aria-hidden="true"></i>
                                                    <span className="ms-2" style={{color:'#992E62'}}>Switch Facility</span>
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                        <Menu
                                            anchorEl={anchorEl}
                                            id="account-menu"
                                            open={open}
                                            onClose={handleClose}
                                            onClick={handleClose}
                                            PaperProps={{
                                                elevation: 0,
                                                sx: {
                                                    overflow: 'visible',
                                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                                    mt: 1.5,
                                                    '& .MuiAvatar-root': {
                                                        width: 32,
                                                        height: 32,
                                                        ml: -0.5,
                                                        mr: 1,
                                                    },
                                                    '&:before': {
                                                        content: '""',
                                                        display: 'block',
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 14,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: 'background.paper',
                                                        transform: 'translateY(-50%) rotate(45deg)',
                                                        zIndex: 0,
                                                    },
                                                },
                                            }}
                                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                        >
                                            {user && user.applicationUserOrganisationUnits.length > 0 ?
                                                user.applicationUserOrganisationUnits.map((organisation, index) => (
                                                    <MenuItem style={{color:'#014d88', fontWeight:'400',fontFamily:`'poppins', sans-serif`}} onClick={()=>switchFacility(organisation.organisationUnitId)}>
                                                        <i className="fa fa-hospital-o" aria-hidden="true" style={{color:'#992E62',marginRight:'5px'}}></i>
                                                        {organisation.organisationUnitName}
                                                    </MenuItem>
                                                ))
                                                :''}
                                        </Menu>
                                    </React.Fragment>
















                                    <LogoutPage />
                                </Dropdown.Menu>
                            </Dropdown>
                        </ul>
                    </div>
                </nav>
            </div>
            {/* <AssignFacilityModal showModal={assignFacilityModal} toggleModal={() => setAssignFacilityModal(!assignFacilityModal)} user={user}/> */}
        </div>
    );
};

export default Header;
