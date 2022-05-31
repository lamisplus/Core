
import React, { useState, useEffect } from "react";
import axios from "axios";
import MatButton from "@material-ui/core/Button";
import {
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Alert,
} from "reactstrap";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardContent } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { connect } from "react-redux";
import { addRole } from "./../../../actions/role";
import { url as baseUrl } from "./../../../api";
import useForm from "./../Functions/UseForm";
import { Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { TiArrowBack } from 'react-icons/ti'
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import PageTitle from "./../../layouts/PageTitle";
import { useHistory } from "react-router-dom";


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
}));

const AddRole = (props) => {
  let history = useHistory();
  const classes = useStyles();
  const { values, setValues, handleInputChange, resetForm } = useForm({
    name: "",
    permissions: [],
  });
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setselectedPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  /* Get list of Permissions from the server */
  useEffect(() => {
    async function getCharacters() {
      axios
        .get(`${baseUrl}permissions`)
        .then((response) => {
          //console.log(Object.entries(response.data));
          setPermissions(
            Object.entries(response.data).map(([key, value]) => ({
              label: value.description,
              value: value.name,
            }))
          );
        })
        .catch((error) => {
          console.log(error);
        });
    }
    getCharacters();
  }, []);

  const onPermissionSelect = (selectedValues) => {
    setselectedPermissions(selectedValues);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let permissions = [];
    selectedPermissions.map((p) => {
      const permission = { name: null };
      permission.name = p;
      permissions.push(permission);
    });
    values["permissions"] = permissions;
    setSaving(true);
    const onSuccess = () => {
      setSaving(false);
      resetForm();
      history.push("/roles")
    };
    const onError = () => {
      setSaving(false);

    };
    props.addRole(values, onSuccess, onError);
  };

  return (
    <div>
        <PageTitle activeMenu="New Role" motherMenu="Role" />
        <Link to="/roles">
          <Button
            variant="contained"
            color="primary"
            className=" float-end ms-2"
            startIcon={<TiArrowBack />}
          >
            <span style={{ textTransform: "capitalize" }}>Back </span>
          </Button>
        </Link>
        <br />
     
      <br />

      <Alert color="primary">
        All Information with Asterisks(*) are compulsory
      </Alert>

      <Form onSubmit={handleSubmit}>
        <Col xl={12} lg={12} md={12}>
          <Card className={classes.cardBottom}>
            <CardContent>
              {/* <Title>Add Role</Title> */}
              <br />
              <Row form>
                <Col md={12}>
                  <FormGroup>
                    <Label for="name">Name *</Label>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      value={values.name}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md={12}>
                  <FormGroup>
                    <Label for="permissions">Permissions</Label>
                    <DualListBox
                      canFilter
                      options={permissions}
                      onChange={onPermissionSelect}
                      selected={selectedPermissions}
                    />
                  </FormGroup>
                </Col>
              </Row>
              {saving ? <Spinner /> : ""}
              <br />
              <MatButton
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<SaveIcon />}
                disabled={saving}
              >
                {!saving ? (
                  <span style={{ textTransform: "capitalize" }}>Save</span>
                ) : (
                  <span style={{ textTransform: "capitalize" }}>Saving...</span>
                )}
              </MatButton>
              
              <MatButton
                variant="contained"
                className={classes.button}
                startIcon={<CancelIcon />}
                onClick={resetForm}
              >
                <span style={{ textTransform: "capitalize" }}>Cancel</span>
              </MatButton>
              
            </CardContent>
          </Card>
        </Col>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  //role: state.roles.role,
  role: [],
});

export default connect(mapStateToProps, { addRole })(AddRole);
