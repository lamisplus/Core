import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { url as baseUrl, url, token } from "../../../api";
import axios from "axios";
import Pie from "../charts/Pie";
import LineGraph from "../charts/LineGraph";

//Import
import { ThemeContext } from "../../../context/ThemeContext";
import GeneralSummaryView from "./GeneralSummaryView";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";

const Home = () => {
  const listOfAllModule = useSelector((state) => state.boostrapmodule.list);
  const [hasServerInstalled, setHasServerInstalled] = useState(false);
  const [value, setValue] = React.useState("2");
  const [loading, setLoading] = useState(true);
  const [patientCount, setPatientCount] = useState(0);
  const [patientBiometricCount, setPatientBiometricCount] = useState(0);
  const [patientNoBiometricCount, setPatientNoBiometricCount] = useState(0);
  const handleTabsChange = (event, newValue) => {
    setValue(newValue);
  };
  const { changeBackground, background } = useContext(ThemeContext);

  const getPatientCount = () => {
    axios
      .get(`${url}patient?searchParam=*&pageNo=0&pageSize=10`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPatientCount(response.data.totalRecords));
  };

  const getPatientWithBiometricsCount = () => {
    axios
      .get(
        `${url}patient/getall-patients-with-biometric?searchParam=*&pageNo=0&pageSize=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => setPatientBiometricCount(response.data.totalRecords));
  };

  const getPatientWithNoBiometricsCount = () => {
    axios
      .get(
        `${url}patient/getall-patients-with-no-biometric?searchParam=*&pageNo=0&pageSize=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) =>
        setPatientNoBiometricCount(response.data.totalRecords)
      );
  };

  useEffect(() => {
    changeBackground({ value: "light", label: "Light" });
    getPatientCount();
    getPatientWithBiometricsCount();
    getPatientWithNoBiometricsCount();
  }, []);
  // console.log(listOfAllModule);

  useEffect(() => {
    if (listOfAllModule) {
      if (listOfAllModule.length > 0) {
        listOfAllModule.map((item) => {
          if (item.name === "ServerSyncModule") {
            setHasServerInstalled(true);
          }
        });
      }
      setLoading(false);
    }
  }, [listOfAllModule]);

  return (
    <>
      {!loading ? (
        <>
          {hasServerInstalled ? (
            <TabContext value={value}>
              {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabsChange} aria-label="lab API tabs example">
            <Tab label="Dashboard" value="1" />
            <Tab label="Server Dashboard" value="2" />
          </TabList>
        </Box> */}
              {/* <TabPanel style={{ margin: "0px", padding: "0px" }} value="1">
                <div classNameName="row" st>
                  <div className="col-xl-12">
                    <div className="row">
                      <img
                        src={landingPageImage}
                        width={10}
                        alt=""
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              </TabPanel> */}
              <TabPanel value="2">
                <GeneralSummaryView />
              </TabPanel>
            </TabContext>
          ) : (
            <div className="row" st>
              <div className="col-xl-12">
                <div className="row">
                  {/* <img
                    src={landingPageImage}
                    width={10}
                    alt=""
                    style={{ width: "100%" }}
                  /> */}
                </div>
                <div className="container">
                  <div className="row">
                    <div className="col-xl-4 col-xxl-4 col-sm-6 ">
                      <div className="card">
                        <div className="card-header border-1 pb-0">
                          <div className="d-flex align-items-center">
                            <h2 className="chart-num font-w800 mb-0">
                              {patientCount}
                            </h2>
                          </div>
                          <div>
                            <span>
                              <i className="fa-solid fa-person fa-4x"></i>
                            </span>
                          </div>
                        </div>
                        <div className="card-body pt-0 chart-body-wrapper">
                          <h4 className="text-black font-w400 mb-0 m-4">
                            Active Patients
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-xxl-4 col-sm-6 ">
                      <div className="card">
                        <div className="card-header border-1 pb-0">
                          <div className="d-flex align-items-center">
                            <h2 className="chart-num font-w800 mb-0">
                              {patientBiometricCount}
                            </h2>
                          </div>
                          <span>
                            <i class="fa-solid fa-fingerprint fa-4x"></i>
                          </span>
                        </div>
                        <div className="card-body pt-0 chart-body-wrapper">
                          <h4 className="text-black font-w400 mb-0 m-4">
                            Patients With Biometrics
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-xxl-4 col-sm-6 ">
                      <div className="card">
                        <div className="card-header border-1 pb-0">
                          <div className="d-flex align-items-center">
                            <h2 className="chart-num font-w800 mb-0">
                              {patientNoBiometricCount}
                            </h2>
                          </div>
                          <span>
                            <i class="fa-solid fa-fingerprint fa-4x text-danger"></i>
                          </span>
                        </div>
                        <div className="card-body pt-0 chart-body-wrapper">
                          <h4 className="text-black font-w400 mb-0 m-4">
                            Patients with no Biometrics
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-6 col-xxl-6 col-sm-6 ">
                      <div className="card">
                        <div className="card-body pt-0 chart-body-wrapper">
                          <Pie />
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-xxl-6 col-sm-6 ">
                      <div className="card">
                        <div className="card-body pt-0 chart-body-wrapper">
                          <LineGraph />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            marginTop: "200px",
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner size="lg" animation="border" />
        </div>
      )}
    </>
  );
};
export default Home;
