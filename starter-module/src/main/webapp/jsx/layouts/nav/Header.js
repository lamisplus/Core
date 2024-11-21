import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { url as baseUrl, token } from "./../../../api";
/// Image
import avatar from "../../../images/avatar/user-avatar-white.png";
import belle from "../../../images/lamisPlus/notification-belle.png";
import LogoutPage from './Logout';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authentication } from "./../../../_services/authentication";
import * as ACTION_TYPES from "./../../../actions/types";
import store from "./../../../store";
import Swal from "sweetalert2";
import moment from "moment";
//import AssignFacilityModal from './../../components/Users/AssignFacilityModalFirst'

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
// import CircleNotificationsIcon from '@mui/material/CircleNotifications';
// import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllBootstrapModule } from '../../../actions/bootstrapModule';
import {
    Modal, ModalHeader, ModalBody, Form, FormFeedback,
    Row, Col, Card, CardBody, FormGroup, Label, Input
} from 'reactstrap';
import ServerInstalled from "../../Utils/ServerInstalled";
import { FaBell } from "react-icons/fa";
import { systemSettingsHelper } from "../../../_services/SystemSettingsHelper";



const { dispatch } = store;

const Header = (props) => {
    const instance = systemSettingsHelper.getSingleSystemSetting("instance");
    const [isServerInstance, setIsServerInstance] = useState(true);
    const isAuthorised = window.location.pathname !== '/unauthorised';
    const [user, setUser] = useState(null);
    const [notificationConfigList, setNotificationConfigList] = useState([]);
    const [appointmentList, setAppointmentList] = useState([]);
    //const [modal, setModal] = useState(false);
    const [roles, setRoles] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const listOfAllModule = useSelector(state => state.boostrapmodule.list);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const serverInstalled = ServerInstalled();
    useEffect(() => { }, [ServerInstalled])

    useEffect(async ()=> {
        if (instance !== null && instance !== undefined) {
          const serverInstance = instance.value === "1"
          setIsServerInstance(serverInstance)
        } else {
            await systemSettingsHelper.fetchAllSystemSettings()
            const newInstance = systemSettingsHelper.getSingleSystemSetting("instance")
            const newServerInstance = newInstance.value === "1"
            setIsServerInstance(newServerInstance)
          }
      },[instance])

    useEffect(() => {
        if(isAuthorised) {

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
        }
    }, []);
    const [assignFacilityModal, setAssignFacilityModal] = useState(false);
    //TO ASSIGN FACILITIES
    const toggleAssignModal = () => {
        setAssignFacilityModal(!assignFacilityModal);
    }
    async function fetchMe() {
        if (authentication.currentUserValue != null) {
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

                    if (response.data && response.data.currentOrganisationUnitId === null) {
                        toggleAssignModal()
                    }

                })
                .catch((error) => {
                    // authentication.logout();
                    console.log(error);
                });
        }
    }

    async function switchFacility(facility) {
        await axios.post(`${baseUrl}users/organisationUnit/${facility}`, {})
            .then(response => {
                toast.success('Facility switched successfully!');
                fetchMe();
                //toggleAssignFacilityModal();
                window.location.reload();
            }).catch((error) => {
                toast.error('An error occurred, could not switch facility.');
            });

    }

    const loadModules = async () => {
        const onSuccess = (data) => {
            checkAndShowModal(data);

        }
        const onError = () => {
            // setLoading(false)     
        }
        await dispatch(fetchAllBootstrapModule(onSuccess, onError));
    }
    
    useEffect(() => {
        if(isAuthorised && isServerInstance === false) {
            const intervalId = setInterval(() => {
                // loadModules();
                // const interval = 30 * 60 * 1000; // 30 minutes in milliseconds

            }, 30 * 60 * 1000); // 30 seconds in milliseconds

            return () => {
              clearInterval(intervalId); // Cleanup the interval on component unmount
            };
        }
      }, []);
    // }
    const currentUser = authentication.getCurrentUser();
    useEffect(() => {
        fetchMe();
        if(isAuthorised && isServerInstance === false) {
            console.log("Is not server instance, so Loading modules");
            loadModules();
        }
    }, [isServerInstance]);


    const fetchNotificationConfigs = () => {
        axios.get(`${baseUrl}notification/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            setNotificationConfigList(typeof response.data === 'object' ? response.data : []);
        })
    }

    const fetchAppointment = () => {
        axios.get(`${baseUrl}notification/appointments`, {
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => { setAppointmentList(response.data); }
        )
    }

    useEffect(() => {
        if (isAuthorised) {
            fetchAppointment();
            fetchNotificationConfigs();
        }
        // notificationConfigList.length()
    },[])

    useEffect(()=>{
        // notificationConfigList.length
    },[notificationConfigList])
   

    const handleAppointment = () => {
        if (!Array.isArray(appointmentList)) {
            console.error('appointmentList is not an array');
            return;
        }

        let csvContent = 'ID,First Name,Surname,Age,Sex,Hospital Number,Regimen,Last Visit,Refill Duration,Appointment Date, Case Manager Name\n';
 
        appointmentList.forEach(appointment => {
            // Clean up field values to remove commas and newline characters
            const cleanFields = {
                id: appointment.id,
                firstName: appointment.firstName.replace(/,/g, ''),
                surname: appointment.surname.replace(/,/g, ''),
                age: appointment.age,
                sex: appointment.sex,
                hospitalNumber: appointment.hospitalNumber.replace(/,/g, ''),
                regimen: appointment.regimen.replace(/,/g, ''),
                lastVisit: appointment.lastVisit,
                refillPeriod: appointment.refillPeriod,
                appointmentDate: appointment.appointmentDate,
                caseManagerName:appointment.caseManagerName
            };

            // Concatenate fields with commas
            const row = Object.values(cleanFields).join(',');

            // Append row to CSV content with newline
            csvContent += row + '\n';
        });

        // Create a blob containing the CSV content
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Create a temporary anchor element to trigger download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'appointments.csv'; // File name for the CSV file
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };


    const [dataChanged, setDataChanged] = useState(false);


    // Call this function when you want to reload with additional data
    const reloadWithAdditionalData = () => {
        setDataChanged(true);
    };




    const history = useHistory();

    const checkAndShowModal = (listOfModules) => {
        for (let index = 0; index < listOfModules.length; index++) {
            const module = listOfModules[index];

            // var installedVersion = Number(module.version.split('.').join('').substring(0, 3));
            // var latestVersion = module.latestVersion ? Number(module.latestVersion.split('.').join('').substring(0, 3)) : 0;
            if (
                module.gitHubLink === null
                || module.gitHubLink === undefined
                || !module.gitHubLink.startsWith("http")
                || module.latestVersion === null
                || module.latestVersion === undefined
                || module.version !== module.latestVersion
            ) {
                // swal('Update available!', 'Kindly download it here...', "info");
                Swal.fire({
                    title: "<strong>Module Updates Available</strong>",
                    icon: "info",
                    html: `Module Updates are available. 
                    Please click 
                    <a style="cursor: pointer; text-decoration: underline; color:blue;" id="navigateButton">here</a>
                    to view them.
                    `,
                    showCloseButton: true,
                    showCancelButton: false,
                    showConfirmButton: false,
                    focusConfirm: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                        // Attach a click event to the button inside the modal
                        document.getElementById('navigateButton').addEventListener('click', () => {
                            history.push('/bootstrap-modules');
                            Swal.close();
                        });
                    },
                });

                break;
            }
        }
    }


    return (
        /*<div className="header" style={{ backgroundColor: '#303f9f', height:'55px' }}>*/
        <div className="header" style={{ backgroundColor: '#014d88', height:'65px', zIndex: 130 }}>
            <div className="header-content" style={{borderLeft: "solid 1px #fff"}}>
                <nav className="navbar navbar-expand">
                    <div className="collapse navbar-collapse justify-content-between">
                        <div className="header-left">
                            <div className="input-group search-area d-xl-inline-flex d-none" style={{ color: '#d9fbff', fontSize: '18px', fontWeight: 'bold', width: 'auto' }}>
                                {/* Content can go here */}
                                {user && user.currentOrganisationUnitName ?
                                    <div>
                                        <span style={{ color: '#d9fbff', fontSize: '18px', fontWeight: 'bold' }}>{'Welcome'} </span><
                                            span>&nbsp;:</span>
                                        <span>&nbsp;</span>
                                        <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', marginLeft: '10px' }}>{user.currentOrganisationUnitName}</span>
                                    </div>

                                    : "No Default Facility"
                                }
                            </div>
                        </div>

                        <ul className="navbar-nav header-right main-notification">
                            <Dropdown as="li" className="nav-item dropdown header-profile">
                                <Dropdown.Toggle variant="" as="a" className="nav-link i-false c-pointer"
                                    role="button" data-toggle="dropdown"
                                >
                                    {/* <div className="header-info me-3">

                                        <small className="text-end fs-14 font-w400" style={{ color: '#ffffff' }}>{currentUser.name}</small>
                                    </div> */}
                                    <Badge color="secondary" badgeContent={notificationConfigList.length} showZero>
                                    {/* <img src={belle} alt="" style={{ height: '45px', width: '45px' }} onClick={reloadWithAdditionalData} /> */}
                                    <FaBell size={35} style={{color: 'white' }} onClick={reloadWithAdditionalData}/>
                                    </Badge>
                                </Dropdown.Toggle>

                                {/* <Dropdown.Menu align="right" className="mt-2 dropdown-menu-end">
                                {notificationConfigList.map(() => ({
                            period,

                        indicator,
                        }))} */}

                                <Dropdown.Menu align="right" className="mt-2 dropdown-menu-end">
                                    {notificationConfigList.map(({ period, indicator }) => (
                                        <Dropdown.Item key={`${period}-${indicator}`} onClick={handleAppointment}>
                                            {/* Render content for each dropdown menu item */}
                                            Your {indicator} for this {period}, {appointmentList.length}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>

                            <Dropdown as="li" className="nav-item dropdown header-profile">
                                <Dropdown.Toggle variant="" as="a" className="nav-link i-false c-pointer"
                                    role="button" data-toggle="dropdown"
                                >
                                    <div className="header-info me-3">

                                        <small className="text-end fs-14 font-w400" style={{ color: '#ffffff' }}>{currentUser.name}</small>
                                    </div>
                                    <img src={avatar} alt="" style={{ height: '45px', width: '45px' }} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu align="right" className="mt-2 dropdown-menu-end">
                                    <Link to="#" className="dropdown-item ai-icon" onClick={() => window.open("https://thepalladiumgroup.atlassian.net/servicedesk/customer/portal/20", "_blank")}>
                                        <i class="fa fa-bolt" aria-hidden="true"></i>
                                        <span className="ms-2">Help </span>
                                    </Link>
                                    <Link to={{ pathname: "/account", state: { user: user, defRole: roles } }} className="dropdown-item ai-icon">
                                        <svg
                                            id="icon-user1" xmlns="http://www.w3.org/2000/svg" className="text-primary"
                                            width={18} height={18} viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                                        >
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx={12} cy={7} r={4} />
                                        </svg>
                                        <span className="ms-2">Account </span>
                                    </Link>




                                    <React.Fragment>
                                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center',marginLeft:'5px' }}>
                                            {/* <Tooltip title="Account settings"> */}
                                                <IconButton
                                                    onClick={handleClick}
                                                    size="small"
                                                    sx={{ ml: 2 }}
                                                    aria-controls={open ? 'account-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={open ? 'true' : undefined}
                                                >
                                                    <i className="fa fa-bolt" style={{ color: '#992E62' }} aria-hidden="true"></i>
                                                    <span className="ms-2" style={{ color: '#992E62' }}>Switch Facility</span>
                                                </IconButton>
                                            {/* </Tooltip> */}
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
                                            {user && user?.applicationUserOrganisationUnits?.length > 0 ?
                                                user.applicationUserOrganisationUnits.map((organisation, index) => (
                                                    <MenuItem style={{ color: '#014d88', fontWeight: '400', fontFamily: `'poppins', sans-serif` }} onClick={() => switchFacility(organisation.organisationUnitId)}>
                                                        <i className="fa fa-hospital-o" aria-hidden="true" style={{ color: '#992E62', marginRight: '5px' }}></i>
                                                        {organisation.organisationUnitName}
                                                    </MenuItem>
                                                ))
                                                : ''}
                                        </Menu>
                                    </React.Fragment>
















                                    <LogoutPage />
                                </Dropdown.Menu>
                            </Dropdown>
                        </ul>
                    </div>
                </nav>
            </div >
            {/* <AssignFacilityModal showModal={assignFacilityModal} toggleModal={() => setAssignFacilityModal(!assignFacilityModal)} user={user}/> */}

        </div >
    );
};

export default Header;
