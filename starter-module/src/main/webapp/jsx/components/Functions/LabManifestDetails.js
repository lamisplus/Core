import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import { Age } from "components/Functions/GetAge";
import { connect } from "react-redux";
import { Col, Row } from "reactstrap";
import { Label } from "semantic-ui-react";


const useStyles = makeStyles((theme) => ({
  root2: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    fontSize: 13,
    margin: "0px -2px",
    padding: "0px -2px",
  },
}));

function SamplesManifest(props) {
  const manifestDetail = props.manifestDetail ;
  console.log(manifestDetail)
  const classes = useStyles();

  return (
    <div className={classes.root2}>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <Row>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Manifest ID : <b>{manifestDetail.manifestId && manifestDetail.manifestId !==null ? manifestDetail.manifestId : ''}</b>
              </span>
            </Col>

            <Col md={4} className={classes.root2}>
              <span>
                Courier Name : <b>{manifestDetail.courierName}</b>
              </span>
            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Courier Phone Number : <b>{manifestDetail.courierPhoneNumber}</b>
              </span>
            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Receiving Laboratory  :{" "}
                <b>
                 {"LIMS Lab. "}
                </b>
              </span>
            </Col>
            <Col md={4}>
              <span>
                {" "}
                Total Shipment :{manifestDetail.totalSampleShipment}
                <b>{7}</b>
              </span>
            </Col>
            <Col md={4} className={classes.root2}>
              <span>
                {" "}
                Package By : <b>{manifestDetail.sampleDispatchedBy}</b>
              </span>
            </Col>
            
           
          </Row>
        </ExpansionPanelSummary>
      </ExpansionPanel>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    patient: state.patients.patient,
  };
};

export default connect(mapStateToProps, {})(SamplesManifest);
