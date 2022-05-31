import React, {useEffect } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card,  Badge, Table,} from "react-bootstrap";
import { Link} from 'react-router-dom';
import Button from "@material-ui/core/Button";
import {  BiRefresh } from "react-icons/bi";
import { connect } from "react-redux";
import {loggers} from "./../../../actions/systemInfo";

let newConfigList

const LogConfig = (props) => {
  useEffect(() => {
    fetchSystemEnv()
  }, []);
const fetchSystemEnv =()=>{
  const onSuccess = () => {

  };
  const onError = () => {

  };
  props.fetchLog(onSuccess, onError);
}
  const systemProperties = props.SystemInfo && props.SystemInfo.loggers ? props.SystemInfo.loggers : []
  //console.log(systemProperties)
  newConfigList=Object.entries(systemProperties).map(([key, value]) => ({
    label: key,
    value: value,
  }))

  console.log(newConfigList)

  return (
    <>
                    
      <PageTitle activeMenu="Log Configuration" motherMenu="Administration" pageContent="Log Configuration" />
      <Link to="/health-check">
              <Button
                variant="contained"
                color="primary"
                className="me-2 float-end"
                startIcon={<BiRefresh />}
              >
                <span style={{ textTransform: "capitalize" }}>Refresh</span>
              </Button>
            </Link>
            <br />
        
          <br />
     
      <Row>
      
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>Log Configuration 
                
      </Card.Title>
            </Card.Header>

            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <Table responsive striped bordered hover size="sm">
                    <thead>
                        <tr>
                        <th>Name</th>
                        <th>Configure Level</th>
                        <th>Efective Level</th>
                        </tr>
                    </thead>
                    <tbody>
                    { newConfigList.map((row) => (
                              <tr>
                              <td>{row.label}</td>
                              <td><Badge variant="success ">{row.value.configuredLevel}</Badge></td>
                              <td> <Badge variant="success ">{row.value.effectiveLevel}</Badge></td>
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
  fetchLog: loggers,
};

export default connect(mapStateToProps, mapActionToProps)(LogConfig);
