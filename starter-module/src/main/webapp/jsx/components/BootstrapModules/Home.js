import React, { useState, useEffect} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Dropdown} from 'react-bootstrap';
/// Bootstrap
import { Badge} from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";
import { useSelector, useDispatch } from 'react-redux';
import {  fetchAllBootstrapModule } from '../../../actions/bootstrapModule';
import UnIstallModal from './UnInstallModule'
import DeactivateModule from './DeactivateModule'
import ActivateModule from './ActivateModule'
import ViewModule from './ViewModule'
import UpdateModuleInformation from './UpdateModuleInformation'
import UpdateModuleMenuPosition from './UpdateModuleMenuPosition'
import {  FaPlus } from "react-icons/fa";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { Alert, AlertTitle } from '@material-ui/lab';
import CircularProgress from '@mui/material/CircularProgress';
import moment from "moment";
//import BootstrapSwitchButton from 'bootstrap-switch-button-react'


const useStyles = makeStyles((theme) => ({
    card: {
      margin: theme.spacing(20),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  }));

const PostPage = (props) => {
    let history = useHistory();
    const classes = useStyles();
    const [collectModal, setcollectModal] = useState([])
    const [viewInstallmodal, setViewInstallModal] = useState(false) //View Module Modal
    const toggleViewinstallModal = () => setViewInstallModal(!viewInstallmodal)
    const [updateModuleInfoModal, setUpdateModuleInfoModal] = useState(false) //View Module Modal
    const togglesetUpdateModuleInfoModal = () => setUpdateModuleInfoModal(!updateModuleInfoModal)
    const [updateModuleMenuModal, setUpdateModuleMenuModal] = useState(false) //View Module Menu Position Modal
    const togglesetUpdateModuleMenuModal = () => setUpdateModuleMenuModal(!updateModuleMenuModal)
    const [unInstallmodal, setUnInstallModal] = useState(false) //Modal 
    const toggleUninstallModal = () => setUnInstallModal(!unInstallmodal)
    const [deactivateModal, setDeactivateModal] = useState(false) //Modal
    const toggleDeactivateModal = () => setDeactivateModal(!deactivateModal)
    const [activateModal, setActivateModal] = useState(false) //Modal 
    const toggleActivateModal = () => setActivateModal(!activateModal)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();
    const listOfAllModule = useSelector(state => state.boostrapmodule.list);

    const [restartmodal, setRestartModal] = useState(false) //Modal
    const toggleRestartModal = () => setRestartModal(!restartmodal)

    useEffect(() => {
        loadModules()  
    }, []); //componentDidMount

    const loadModules =()=>{
        setLoading(true);
        const onSuccess = () => {
            setLoading(false)
            
        }
        const onError = () => {
            setLoading(false)     
        }
          const fetchAllModule = dispatch(fetchAllBootstrapModule(onSuccess,onError ));
    }
  
    const viewInstallModule = (row)=>{
        //fetchExternalMenu()
        setcollectModal({...collectModal, ...row});
        setViewInstallModal(!viewInstallmodal)
    }
    const unInstallModule = (row) => {
        setcollectModal({...collectModal, ...row});
        setUnInstallModal(!unInstallmodal) 
      }
    const restartingModule  = (row) => {

        setRestartModal(!restartmodal)
    }
    const updateModuleInformation = (row) => {
        setcollectModal({...collectModal, ...row});
        setUpdateModuleInfoModal(!updateModuleInfoModal)
    }
    const updateModuleMenuPosition = (row) => {
        setcollectModal({...collectModal, ...row});
        setUpdateModuleMenuModal(!updateModuleMenuModal)
    }
    const updateModuleJar = ()=>{
        history.push("/update-module")
    }
    const deactivatelModule = (row) => {  
        setcollectModal({...collectModal, ...row});
        setDeactivateModal(!deactivateModal) 
    }
  
    const activatelModule = (row) => {
      setcollectModal({...collectModal, ...row});
      setActivateModal(!activateModal) 
    }

    
    return(
        <>
            {loading ?
                <div style={{width:'100%', minHeight:'600px',justifyContent:'center',display:'flex',alignItems:'center'}}>
                    <CircularProgress size={200}  />
                </div>

                :
                <>

                    <PageTitle
                        motherMenu="Bootstrap"
                        activeMenu="Modules"
                        pageContent="Modules"
                    />
                    <Link to={"upload-module"} style={{marginTop:'-20px',marginRight:'30px'}} >
                        <Button
                            variant="contained"
                            className=" float-end"
                            startIcon={<FaPlus size="10"/>}
                            style={{backgroundColor:'#014d88',color:'#fff',marginTop:'-20px',marginRight:'10px', width:'110px'}}
                        >
                            <span style={{ textTransform: "capitalize",fontSize:"18px" }}>New</span>
                        </Button>
                    </Link>

                    <div className="mb-sm-5 mb-3 d-flex flex-wrap align-items-center text-head"></div>
                    <div className="row" style={{marginTop:'-25px',paddingRight:'10px',paddingLeft:'5px'}}>
                        {!loading && listOfAllModule.length > 0 ? (
                                <>
                                    {listOfAllModule.map((contact, index)=>(
                                        <div  className="col-xl-4 col-xxl-4 col-lg-6 col-md-6 col-sm-6" key={index} style={{minHeight:'300px'}}>
                                            <div  className="card " style={{borderRadius:"6px"}}>

                                                <div className="card-header align-items-start">
                                                    <div>
                                                        <h6 className="fs-18 font-w500 mb-3"><Link to={"#"}className="user-name" style={{color:'#014d88',fontSize:'20px'}}>{contact.name}</Link></h6>
                                                        <div className="fs-14 text-nowrap" style={{color:'#992E62', fontWeight:'bold'}}><i className="fa fa-calendar-o me-3" aria-hidden="true"></i>{moment(contact.buildTime).format("YYYY-MM-DD HH:mm")}</div>
                                                    </div>

                                                    {/*Action button -- Dropdown menu*/}
                                                    <Dropdown className="dropdown ms-auto"  >
                                                        <Dropdown.Toggle
                                                            as="button"
                                                            variant=""
                                                            drop="up"
                                                            className="btn sharp btn-primary "
                                                            id="tp-btn"
                                                            style={{ backgroundColor: '#014d88', borderColor:'#014d88', fontSize:"4", borderRadius:'5px',marginRight:'-25px',marginTop:'-25px'}}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                width="18px"
                                                                height="18px"
                                                                viewBox="0 0 24 24"
                                                                version="1.1"
                                                            >
                                                                <g
                                                                    stroke="none"
                                                                    strokeWidth="1"
                                                                    fill="none"
                                                                    fillRule="evenodd"
                                                                >
                                                                    <rect x="0" y="0" width="24" height="24" />
                                                                    <circle fill="#ffffff" cx="12" cy="5" r="2" />
                                                                    <circle fill="#ffffff" cx="12" cy="12" r="2" />
                                                                    <circle fill="#ffffff" cx="12" cy="19" r="2" />
                                                                </g>
                                                            </svg>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu alignRight={true} className="dropdown-menu-right">
                                                            <Dropdown.Item
                                                                onClick={()=>viewInstallModule(contact)}
                                                            >View Details
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={()=>updateModuleInformation(contact)}
                                                            >Update Module Details
                                                            </Dropdown.Item>

                                                            <Dropdown.Item

                                                            ><Link to={{pathname: "/module-menu", state: { datasample: contact }}}>Module Menu</Link>
                                                            </Dropdown.Item>

                                                            <Dropdown.Item
                                                                onClick={()=>updateModuleJar(contact)}
                                                            >Update Module Jar
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={()=>unInstallModule(contact)}
                                                            >Uninstall
                                                            </Dropdown.Item>
                                                            {/*<Dropdown.Item*/}
                                                            {/*    onClick={()=>restartingModule(contact)}*/}
                                                            {/*>Restart*/}
                                                            {/*</Dropdown.Item>*/}
                                                            {contact.active===true? (
                                                                    <>

                                                                        <Dropdown.Item className="text-danger"
                                                                                       onClick={()=>deactivatelModule(contact)}
                                                                        >Deactive
                                                                        </Dropdown.Item>
                                                                    </>
                                                                )

                                                                :

                                                                (
                                                                    <>
                                                                        <Dropdown.Item className="text-danger"
                                                                                       onClick={()=>activatelModule(contact)}
                                                                        >Activate
                                                                        </Dropdown.Item>

                                                                    </>
                                                                )
                                                            }
                                                        </Dropdown.Menu>
                                                    </Dropdown>

                                                </div>
                                                <div className="card-body p-0 pb-3">
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item" style={{minHeight:'200px'}}>
                                                            <span className="mb-0 title">Description</span> :
                                                            <span className="text-black ms-2">{contact.description}</span>
                                                        </li>

                                                        <li className="list-group-item">

                                                            <Badge variant="info badge-xs light" className="card-link float-end">Version {contact.version}</Badge>
                                                            <span className="mb-0 title">Status</span> :
                                                            <span className="text-black desc-text ms-2">
                                        <Badge variant={contact.active===true? "primary badge-xs": "danger badge-xs"}><i className="fa fa-check-square me-2 scale4" aria-hidden="true"></i> {contact.active===true? "Active": "Inactive"}</Badge>
                                                                {/*<BootstrapSwitchButton checked={true} size="xs" />*/}
                                        </span>
                                                        </li>

                                                    </ul>
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                </>
                            )
                            :
                            <>
                                <div className="row">
                                    <div  className="col-xl-12 col-xxl-12 col-lg-12 col-md-12 col-sm-12" >
                                        <br/><br/>
                                        <Alert severity="info">
                                            <AlertTitle>
                                                <strong>NO Module Found</strong>
                                            </AlertTitle>
                                        </Alert>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    <UnIstallModal modalstatus={unInstallmodal} togglestatus={toggleUninstallModal} datasample={collectModal} loadModules={loadModules}/>
                    <DeactivateModule modalstatus={deactivateModal} togglestatus={toggleDeactivateModal} datasample={collectModal} loadModules={loadModules}/>
                    <ActivateModule modalstatus={activateModal} togglestatus={toggleActivateModal} datasample={collectModal} loadModules={loadModules}/>
                    <ViewModule modalstatus={viewInstallmodal} togglestatus={toggleViewinstallModal} datasample={collectModal} loadModules={loadModules}/>
                    <UpdateModuleInformation modalstatus={updateModuleInfoModal} togglestatus={togglesetUpdateModuleInfoModal} datasample={collectModal} loadModules={loadModules}  />
                    <UpdateModuleMenuPosition modalstatus={updateModuleMenuModal} togglestatus={togglesetUpdateModuleMenuModal} datasample={collectModal} loadModules={loadModules} />
                    {/*<RestartingApp modalstatus={restartmodal} togglestatus={toggleRestartModal}  />*/}
                </>
            }
        </>

    );     
}

export default PostPage;