import React, {useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card,  Tab, Tabs, Table,} from "react-bootstrap";
import PatientCard from './PatientCard'
const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(20),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  cardBottom: {
    marginBottom: 20,
  },
  Select: {
    height: 45,
    width: 300,
  },
  button: {
    margin: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.default,
  },
  inline: {
    display: "inline",
  },
  radius:{
    
    fontSize: "9 !important"
  }
  
}));

const divStyle = {
  borderRadius: "2px",
  fontSize: 11,
};

const Test = () => {
    const [key, setKey] = useState('home');
    const classes = useStyles();

  return (
    <Fragment>
      <PageTitle activeMenu="Patients" motherMenu="Patient" pageContent="Patient Detail" />
      <Row>
       
        <Col xl={12}>
          <Card style={divStyle}>
            
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                    >
                    <Tab eventKey="home" title="Patient Detail">
                    <Table striped bordered hover size="sm">
                      <PatientCard />
                    </Table>
                    </Tab>
                    <Tab eventKey="properties" title="History">
                    <p>History</p>
                    </Tab>
                    <Tab eventKey="environment" title="All encounters" >
                    <p>All encounters</p>
                    </Tab>
                    <Tab eventKey="config" title="Clinical" >
                    <p>Clinical</p>
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

export default Test;
