import React, {useState, Fragment } from "react";

import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card,  Tab, Tabs, Table,} from "react-bootstrap";
import Notifications from "./Notifications";
import Flags from "./NotificationFlag";
import NotificationAppointment from "./NotificationAppointment"
// import SystemConfig from "./SystemConfig";
import ApplicationConfig from './ApplicationConfig'
// import SystemEnv from "./SystemEnv";
// import SystemProperty from "./SystemProperty";
import { MdImportExport } from "react-icons/md";
import SmsPage from "./SmsPage";

const  UiTab = () => {
    const [key, setKey] = useState('home');


  return (
    <Fragment>
      <PageTitle activeMenu="Notification Config" motherMenu="Notification" />
      <Row>
       
        <Col xl={10}>
          <Card>
            <Card.Header>
              <Card.Title>SYSTEM NOTIFICATION CONFIGURATION</Card.Title>
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
                    <Tab eventKey="notifications" title="Notification configuration">
                      <NotificationAppointment />
                    </Tab>
                    <Tab eventKey="patientFlags" title="Patient Flags Configuration" >
                    < Flags/>
                    </Tab>
                    <Tab eventKey="sms" title="SMS Configuration">
                    <SmsPage />
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
