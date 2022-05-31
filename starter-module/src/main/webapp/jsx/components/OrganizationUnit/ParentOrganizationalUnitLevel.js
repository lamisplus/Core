import React from 'react'
import {Card, CardBody,CardHeader,Col,Row} from 'reactstrap'
import { useState, useEffect} from 'react'
import { TiPlus } from 'react-icons/ti'
import MatButton from '@material-ui/core/Button'
import 'react-datepicker/dist/react-datepicker.css'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { TiArrowBack} from 'react-icons/ti';
import 'react-widgets/dist/css/react-widgets.css'
//Date Picker
import Page from '../../Page'
//import { Spinner } from 'reactstrap';
import {Menu,MenuList,MenuButton,MenuItem,} from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import MaterialTable from 'material-table';
import {  MdDelete, MdModeEdit, MdRemoveRedEye } from "react-icons/md";
import DeleteModule from "./DeleteModule";
import CreateParentOrgUnit from "./CreateParentOrgUnit";
import { useSelector, useDispatch } from 'react-redux';
import {  fetchAllParentOrganizationalUnitlevel } from '../../../actions/organizationalUnit';



const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    container: {
        maxHeight: 440
    },
    td: { borderBottom :'#fff'}
})





  const ParentOrganizationUnit = (props) => {
    const parentOrganisationUnitId = props.location.state && props.location.state.parentOrganisationUnitId  ? props.location.state.parentOrganisationUnitId : {};
    const [collectModal, setcollectModal] = useState([])
    const [modal, setModal] = useState(false) // 
    const toggleModal = () => setModal(!modal)
    const [modal2, setModal2] = useState(false) //
    const toggleModal2 = () => setModal2(!modal2)
    const classes = useStyles()
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch();
    const listOfAllParentOrgUnitLevel = useSelector(state => state.organizationalUnitReducer.list);

    useEffect(() => {
      setLoading(true);
      const onSuccess = () => {
          setLoading(false)
          
      }
      const onError = () => {
          setLoading(false)     
      }
        const fetchAllOrgUnit = dispatch(fetchAllParentOrganizationalUnitlevel(parentOrganisationUnitId, onSuccess,onError ));

  }, []); //componentDidMount
    const deleteModule = (row) => {  
      setcollectModal({...collectModal, ...row});
      setModal(!modal) 
    }

    const createParentOrgUnit = () => {  
      setModal2(!modal2) 
    }
console.log(props.location.state)
    

return (
    <Page >
      
        <Row>
            <Col>
              <h1>Organization Unit
              <Link 
                  to ={{ 
                  pathname: "/organisation-unit"
                  }} 
                > 
                  <MatButton
                    type='submit'
                    variant='contained'
                    color='primary'
                    //className={classes.button}                        
                    className=" float-right mr-1"
                    
                  >
                    <TiArrowBack/>{" "} Back 
                  </MatButton>
                </Link>
                <MatButton
                  type='submit'
                  variant='contained'
                  color='primary'
                  //className={classes.button}                        
                  className=" float-right mr-1"
                  onClick={() => createParentOrgUnit()}
                >
                  <TiPlus/>{" "} New 
                </MatButton>
                </h1>
                <Card className="mb-12">
                
                <CardBody>

                <br />
                    <Row>
                        <Col>
                            <Card body>
                            
                               
                            <MaterialTable
                              title="Unit Levels"
                              columns={[
                                { title: 'Parent Name', field: 'name' },
                                { title: 'Description', field: 'description' },
                                
                                { title: 'Action', field: 'actions'},
                              ]}
                              isLoading={loading}
                                data={listOfAllParentOrgUnitLevel.map((row) => ({
                                      name: row.name,  
                                      description: row. description,
                                    
                                    actions: 
                                      <div>
                                        <Menu>
                                            <MenuButton style={{ backgroundColor:"#3F51B5", color:"#fff", border:"2px solid #3F51B5", borderRadius:"4px", }}>
                                              Actions <span aria-hidden>▾</span>
                                            </MenuButton>
                                                <MenuList style={{ color:"#000 !important"}} > 
                                                      <MenuItem style={{ color:"#000 !important"}}>
                                                     
                                                      </MenuItem> 
                                                      <MenuItem  style={{ color:"#000 !important"}} onSelect={() => deleteModule('module to delete')}>                      
                                                      
                                                            <MdDelete size="15" color="blue" />{" "}<span style={{color: '#000'}}>Delete </span>
                                                                                
                                                      </MenuItem>                                    
                                                      
                                              </MenuList>
                                        </Menu>
                                  </div>        
                                }))}
                              options={{
                                headerStyle: {
                                  
                                  color: "#000",
                                  margin: "auto"
                                  },
                                filtering: true
                              }}
                            />
                            </Card>
                        </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
        </Row>
       <DeleteModule modalstatus={modal} togglestatus={toggleModal} datasample={collectModal} />
       <CreateParentOrgUnit modalstatus={modal2} togglestatus={toggleModal2}  />

       
    </Page>
  )
  
}


export default ParentOrganizationUnit