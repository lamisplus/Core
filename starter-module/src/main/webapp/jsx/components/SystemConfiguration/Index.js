import React, {useState, Fragment } from "react";

import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card,  Tab, Tabs, Table,} from "react-bootstrap";
import SystemConfig from "./SystemConfig";
import ApplicationConfig from './ApplicationConfig'
import SystemEnv from "./SystemEnv";
import SystemProperty from "./SystemProperty";

const UiTab = () => {
    const [key, setKey] = useState('home');


  return (
    <Fragment>
      <PageTitle activeMenu="System Configurations" motherMenu="Administration" pageContent="System Configurations" />
      <Row>
       
        <Col xl={12}>
          <Card>
            <Card.Header>
              <Card.Title>SYSTEM CONFIGURATION</Card.Title>
            </Card.Header>
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                    >
                    <Tab eventKey="home" title="Spring configuration">
                      <SystemConfig />
                    </Tab>
                    <Tab eventKey="properties" title="System Properties">
                    <SystemProperty />
                    </Tab>
                    <Tab eventKey="environment" title="System Environment" >
                    <SystemEnv />
                    </Tab>
                    <Tab eventKey="config" title="Application Config" >
                    <ApplicationConfig />
                    </Tab>
                    
                   
                    </Tabs>


              </div>
            </Card.Body>
          </Card>
        </Col>
        
      </Row>
    </Fragment>
  );
};

export default UiTab;
