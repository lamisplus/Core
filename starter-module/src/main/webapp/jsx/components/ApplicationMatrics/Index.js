import React, {useEffect } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card,  Badge, Table,} from "react-bootstrap";
import { Link} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import {  BiRefresh } from "react-icons/bi";
import { connect } from "react-redux";
import {metrics} from "./../../../actions/systemInfo";

let newConfigList

const ApplicationMatrics = (props) => {
  useEffect(() => {
    fetchSystemEnv()
  }, []);
const fetchSystemEnv =()=>{
  const onSuccess = () => {

  };
  const onError = () => {

  };
  props.fetchMetrics(onSuccess, onError);
}

const refresh = ()=>{
  fetchSystemEnv()
}
  const systemProperties = props.SystemInfo && props.SystemInfo.names ? props.SystemInfo.names : []
  
  newConfigList=Object.entries(systemProperties).map(([key, value]) => ({
          label: key,
          value: value,
        }))


  return (
    <>
                    
      <PageTitle activeMenu="Application Matrics" motherMenu="Administration" pageContent="Application Matrics" />
  
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
              <Card.Title>Application Matrics
                
      </Card.Title>
            </Card.Header>

            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <Table responsive striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>ID</th>
                       
                        <th>Deatils</th>
                        </tr>
                    </thead>
                    <tbody>
                       
                         { newConfigList.map((row) => (
                              <tr>
                              <td>{row.label}</td>
                              <td>{row.value}</td>
                             
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
  fetchMetrics: metrics,
};

export default connect(mapStateToProps, mapActionToProps)(ApplicationMatrics);
