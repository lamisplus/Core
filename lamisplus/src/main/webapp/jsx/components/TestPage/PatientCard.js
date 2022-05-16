import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import Chip from '@material-ui/core/Chip';
import profile from "./../../../images/profile/profile.png";
import Divider from '@material-ui/core/Divider';
import { Dropdown, } from "react-bootstrap";
import { Button } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import SubMenu from './../Patients/SubMenu'
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '20.33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

function PatientCard(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <SubMenu />
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        
        <div className="col-md-12">
          <div className="profile card card-body px-3 pt-3 pb-0">
            <div className="profile-head">
              
              <div className="profile-info">
                <div className="profile-photo">
                  <img
                    src={profile}
                    className="img-fluid rounded-circle"
                    alt="profile"
                  />
                </div>
                <div className="profile-details">
                  <div className="profile-name px-3 pt-2">
                    <h6 className="text-primary mb-0">Name: Amos M. Emeka</h6>
                    
                  </div>
                  <div className="profile-email px-2 pt-2">
                    <h6 className="text-muted mb-0" >Address:Waksur Street Wuse Zone 5, Abuja Nigeria</h6>
                   
                  </div>
                  <div className="profile-email px-2 pt-2">
                    <h6 className="text-muted mb-0">Phone:08172306578</h6>
                   
                  </div>
                  <Dropdown className="dropdown ms-auto">
                    <Dropdown.Toggle
                      variant="primary"
                      className="btn btn-primary light sharp i-false"
                      data-toggle="dropdown"
                      aria-expanded="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        //    xmlns:xlink="http://www.w3.org/1999/xlink"
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
                          <rect x="0" y="0" width="24" height="24"></rect>
                          <circle fill="#000000" cx="5" cy="12" r="2"></circle>
                          <circle fill="#000000" cx="12" cy="12" r="2"></circle>
                          <circle fill="#000000" cx="19" cy="12" r="2"></circle>
                        </g>
                      </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu dropdown-menu-right">
                      <Dropdown.Item className="dropdown-item">
                        <i className="fa fa-user-circle text-primary me-2" />
                        View profile
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item">
                        <i className="fa fa-users text-primary me-2" />
                        Add to close friends
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item">
                        <i className="fa fa-plus text-primary me-2" />
                        Add to group
                      </Dropdown.Item>
                      <Dropdown.Item className="dropdown-item">
                        <i className="fa fa-ban text-primary me-2" />
                        Block
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
    
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.column} >
            <Button
                    color='red'
                    content='BloodType'
                    //icon='heart'
                    label={{ basic: true, color: 'red', pointing: 'left', content: 'AB+' }}
                    />
                    
            </div>
          <div className={classes.column}>
          <Button
                    basic
                    color='blue'
                    content='Height'
                    icon='fork'
                    label={{
                        as: 'a',
                        basic: true,
                        color: 'blue',
                        pointing: 'left',
                        content: '74.5 in',
                    }}
                    />
          </div>
          <div className={classes.column}>
          <Button
                    basic
                    color='blue'
                    content='Weight'
                    icon='fork'
                    label={{
                        as: 'a',
                        basic: true,
                        color: 'blue',
                        pointing: 'left',
                        content: '74.5 in',
                    }}
                    />
          </div>
          <div className={classNames(classes.column, classes.helper)}>
            <Typography variant="caption">
              Biometric Status
              <br />
              <a href="#sub-labels-and-columns" className={classes.link}>
                Patient Status
              </a>
            </Typography>
          </div>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions expandIcon={<ExpandMoreIcon />}>
          
        </ExpansionPanelActions>
      </ExpansionPanel>

    </div>
  );
}

PatientCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PatientCard);
