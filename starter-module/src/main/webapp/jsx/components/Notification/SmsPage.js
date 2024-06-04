import React, { Fragment, useEffect, useState } from "react";
import { connect } from "react-redux";
import {env} from "../../../actions/systemInfo";
import { Row, Col, Card,  Tab, Tabs, Table,} from "react-bootstrap";
import { CardBody } from "reactstrap";
import SmsSetUp from "./SmsSetUp";
import SendSms from "./SendSms"

// let newConfigList=[]

// const SmsPage = () => {

   
  const SmsPage = () => {
    const [key, setKey] = useState('home');
  return (
         <Fragment>      
            {/* <Table striped bordered hover size="sm">
            
            </Table> */}
              <Card Col>
                <CardBody>
                <div className="custom-tab-1">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                    >
                    <Tab eventKey="sms" title="Sms Setup">
                      <SmsSetUp />
                    </Tab>
                    <Tab eventKey="send-sms" title="Send Sms" >
                    < SendSms/>
                    </Tab>
                                       
                   
                    </Tabs>
                    </div>
                </CardBody>
                </Card>     
     
    </Fragment>
  );
};


  
export default SmsPage;

