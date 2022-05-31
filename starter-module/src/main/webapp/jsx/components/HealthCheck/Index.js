import React, {useEffect } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card,  Badge, Table,} from "react-bootstrap";
import { Link} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import {  BiRefresh } from "react-icons/bi";
import { connect } from "react-redux";
import {health} from "./../../../actions/systemInfo";

let newConfigList

const HealthCheck = (props) => {
  useEffect(() => {
    fetchSystemEnv()
  }, []);
const fetchSystemEnv =()=>{
  const onSuccess = () => {

  };
  const onError = () => {

  };
  props.fetchHealth(onSuccess, onError);
}
  const systemProperties = props.SystemInfo && props.SystemInfo.components ? props.SystemInfo.components : []
  
  newConfigList=Object.entries(systemProperties).map(([key, value]) => ({
          label: key,
          value: value,
        }))

  const refresh = ()=>{
    fetchSystemEnv()
  }

  return (
    <>
                    
      <PageTitle activeMenu="Health Check" motherMenu="Administration" pageContent="Health Check" />
    
              <Button
                variant="contained"
                color="primary"
                className="me-2 float-end"
                startIcon={<BiRefresh />}
                onClick={()=>refresh()}
              >
                <span style={{ textTransform: "capitalize" }}>Refresh</span>
              </Button>
           
            <br />
        
          <br />
     
      <Row>
      
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>Health Check 
                
      </Card.Title>
            </Card.Header>

            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <Table responsive striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>Service Name</th>
                        <th>Status</th>
                        <th>Detail</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                         { newConfigList.map((row) => (
                              <tr>
                              <td>{row.label}</td>
                              <td><Badge variant="success ">{row.value.status}</Badge></td>
                              <td> <i className="fa fa-eye color-info float-center"></i></td>
                              </tr>
                          ))}
                        
                    </tbody>
                    </Table>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </>
  );
};


const mapStateToProps = (state) => {
  return {
      SystemInfo: state.SystemInfo.list,
  };
};

const mapActionToProps = {
  fetchHealth: health,
};

export default connect(mapStateToProps, mapActionToProps)(HealthCheck);
