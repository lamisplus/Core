// import React, { useState, useContext, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Dropdown, Spinner } from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";
// import { url as baseUrl, url, token } from "../../../api";
// import axios from "axios";
// import Pie from "../charts/Pie";
// import LineGraph from "../charts/LineGraph";

// //Import
// import { ThemeContext } from "../../../context/ThemeContext";
// import GeneralSummaryView from "./GeneralSummaryView";
// import { TabContext, TabList, TabPanel } from "@material-ui/lab";
// import { systemSettingsHelper } from "../../../_services/SystemSettingsHelper";
// import { authentication } from "../../../_services/authentication";

// const Home = () => {
//   const listOfAllModule = useSelector((state) => state.boostrapmodule.list);
//   const instance = systemSettingsHelper.getSingleSystemSetting("instance")
//   const [isServerInstance, setIsServerInstance] = useState(true);
//   const [value, setValue] = React.useState("2");
//   const [loading, setLoading] = useState(true);
//   const [dashboardDataLoading, setDashboardDataLoading] = useState(false);
//   const [patientCount, setPatientCount] = useState(0);
//   const [patientBiometricCount, setPatientBiometricCount] = useState(0);
//   const [patientNoBiometricCount, setPatientNoBiometricCount] = useState(0);

//   const [sexCount, setSexCount] = useState([]);

//   const [sexYearCount, setSexYearCount] = useState([]);

//   const handleTabsChange = (event, newValue) => {
//     setValue(newValue);
//   };
//   const { changeBackground, background } = useContext(ThemeContext);

//   const getPatientCount = () => {
//     axios
//       .get(`${url}patient?searchParam=*&pageNo=0&pageSize=10`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         if (typeof(response.data) === 'object'){
//           setPatientCount(response.data)
//         }
//       });
//   };

//   const getPatientWithBiometricsCount = () => {
//     axios
//       .get(
//         `${url}patient/getall-patients-with-biometric?searchParam=*&pageNo=0&pageSize=10`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then((response) => {
//         if (typeof(response.data) === 'object'){
//           setPatientBiometricCount(response.data)
//         }
//       });
//     };

//     const getPatientWithNoBiometricsCount = () => {
//       axios
//       .get(
//         `${url}patient/getall-patients-with-no-biometric?searchParam=*&pageNo=0&pageSize=10`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )
//       .then((response) => {
//         if (typeof(response.data) === 'object'){
//           setPatientNoBiometricCount(response.data);
//         }
//       });
//     };

//     const getSexCount = () => {
//       axios
//       .get(`${url}patient/count-by-sex`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         if (typeof(response.data) === 'object'){
//           setSexCount(response.data);
//         }
//       })
//       .catch((error) => {
//         console.log(error)
//         setSexCount([]);
//       });
//     };

//     const getSexYearCount = () => {
//       axios
//       .get(`${url}patient/count-by-year-and-sex`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((response) => {
//         if (typeof(response.data) === 'object'){
//           const sortByYear = (a, b) => {
//             return a.year - b.year;
//           };

//           setSexYearCount(
//             response.data.sort(sortByYear).filter((entry) => entry.year >= 2010)
//           );
//         }
//       })
//       // .then((response) => {
//       //   const sortByYear = (a, b) => {
//       //     return a.year - b.year;
//       //   };

//       //   setSexYearCount(
//       //     response.data.sort(sortByYear).filter((entry) => entry.year >= 2010)
//       //   );
//       // })
//       .catch((error) => {
//         console.log(error);
//         setSexYearCount([]);
//       });
//   };

//   const fetchDashboardData = () =>{
//     setDashboardDataLoading(true);
//     getPatientCount();
//     getPatientWithBiometricsCount();
//     getPatientWithNoBiometricsCount();
//     getSexCount();
//     getSexYearCount();
//     setDashboardDataLoading(false);
//   }

//   // useEffect(() => {
//   //   changeBackground({ value: "light", label: "Light" });

//   //   if (listOfAllModule) {
//   //     if (listOfAllModule.length > 0) {
//   //       listOfAllModule.map((item) => {
//   //         if (item.name === "ServerSyncModule") {
//   //           setIsServerInstance(true);
//   //         }
//   //       });
//   //     }
//   //     setLoading(false);
//   //   }
//   //   // if (!patientCount?.totalRecords) {
//   //   //   getPatientCount();
//   //   // }

//   //   // if (!patientBiometricCount?.totalRecords) {
//   //   //   getPatientWithBiometricsCount();
//   //   // }

//   //   // if (!patientNoBiometricCount?.totalRecords) {
//   //   //   getPatientWithNoBiometricsCount();
//   //   // }

//   //   // if (!sexCount[0]?.name) {
//   //   //   getSexCount();
//   //   // }

//   //   // if (!sexYearCount[0]?.year) {
//   //   //   getSexYearCount();
//   //   // }

//   // }, [listOfAllModule]);

//   useEffect(async ()=> {
//     if (instance !== null && instance !== undefined) {
//       const serverInstance = instance.value === "1"
//       setIsServerInstance(serverInstance)
//       setLoading(false)
//     } else {
//       await systemSettingsHelper.fetchAllSystemSettings()
//       const newInstance = systemSettingsHelper.getSingleSystemSetting("instance")
//       const newServerInstance = newInstance.value === "1"
//       setIsServerInstance(newServerInstance)
//       setLoading(false)

//     }
//     setLoading(false)
//   },[instance])

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   return (
//     <>
//       {(!loading && !dashboardDataLoading) ? (
//         <>
//           {isServerInstance ? (
//             <TabContext value={value}>
//               <TabPanel value="2">
//                 <GeneralSummaryView />
//               </TabPanel>
//             </TabContext>
//           ) : (
//             <div className="row" st>
//               <div className="col-xl-12">
//                 <div className="row">
//                   {/* <img
//                     src={landingPageImage}
//                     width={10}
//                     alt=""
//                     style={{ width: "100%" }}
//                   /> */}
//                 </div>
//                 <div className="container-fluid">
//                   <div className="row">
//                     <div className="col-xl-4 col-xxl-4 col-sm-6 ">
//                       <div className="card">
//                         <div className="card-header border-1 pb-0">
//                           <div className="d-flex align-items-center">
//                             <h2 className="chart-num font-w800 mb-0">
//                               {patientCount?.totalRecords}
//                             </h2>
//                           </div>
//                           <div>
//                             <span>
//                               <i className="fa-solid fa-person fa-4x"></i>
//                             </span>
//                           </div>
//                         </div>
//                         <div className="card-body pt-0 chart-body-wrapper">
//                           <h4 className="text-black font-w400 mb-0 m-4">
//                             Total Patients
//                           </h4>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-xl-4 col-xxl-4 col-sm-6 ">
//                       <div className="card">
//                         <div className="card-header border-1 pb-0">
//                           <div className="d-flex align-items-center">
//                             <h2 className="chart-num font-w800 mb-0">
//                               {patientBiometricCount?.totalRecords}
//                             </h2>
//                           </div>
//                           <span>
//                             <i class="fa-solid fa-fingerprint fa-4x "></i>
//                           </span>
//                         </div>
//                         <div className="card-body pt-0 chart-body-wrapper">
//                           <h4 className="text-black font-w400 mb-0 m-4">
//                             Patients With Biometrics
//                           </h4>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-xl-4 col-xxl-4 col-sm-6 ">
//                       <div className="card">
//                         <div className="card-header border-1 pb-0">
//                           <div className="d-flex align-items-center">
//                             <h2 className="chart-num font-w800 mb-0">
//                               {patientNoBiometricCount?.totalRecords}
//                             </h2>
//                           </div>
//                           <span>
//                             <i class="fa-solid fa-fingerprint fa-4x text-danger"></i>
//                           </span>
//                         </div>
//                         <div className="card-body pt-0 chart-body-wrapper">
//                           <h4 className="text-black font-w400 mb-0 m-4">
//                             Patients with no Biometrics
//                           </h4>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="row">
//                     <div className="col-xl-6 col-xxl-6 col-sm-6 ">
//                       <div className="card">
//                         <div className="card-body pt-0 chart-body-wrapper">
//                           <Pie
//                             plotData={sexCount}
//                             title="Patient Enrollment by Sex"
//                             seriesName="Active patients"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     <div className="col-xl-6 col-xxl-6 col-sm-6 ">
//                       <div className="card">
//                         <div className="card-body pt-0 chart-body-wrapper">
//                           <LineGraph
//                             LineGraphData={sexYearCount}
//                             title={`Patient Enrollment Trends by Year and Sex`}
//                             xName={`Year`}
//                             yName={`Patient`}
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div
//           style={{
//             marginTop: "200px",
//             height: "100%",
//             width: "100%",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Spinner size="lg" animation="border" />
//         </div>
//       )}
//     </>
//   );
// };
// export default Home;

import React, { useState, useContext, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { url, token } from "../../../api";
import axios from "axios";
import Pie from "../charts/Pie";
import LineGraph from "../charts/LineGraph";
import GeneralSummaryView from "./GeneralSummaryView";
import { TabContext, TabPanel } from "@material-ui/lab";
import { systemSettingsHelper } from "../../../_services/SystemSettingsHelper";
import { authentication } from "../../../_services/authentication";

const Home = () => {
  const instance = systemSettingsHelper.getSingleSystemSetting("instance")
  const [isServerInstance, setIsServerInstance] = useState(true);
  const [value, setValue] = React.useState("2");
    const handleTabsChange = (event, newValue) => {
    setValue(newValue);
  };
  const [loading, setLoading] = useState(true);
  const [currentOrganisationUnitId, setCurrentOrganisationUnitId] = useState(null);

  useEffect(async () => {
    if (instance !== null && instance !== undefined) {
      const serverInstance = instance.value === "1"
      setIsServerInstance(serverInstance)
      setLoading(false)
    } else {
      await systemSettingsHelper.fetchAllSystemSettings()
      const newInstance = systemSettingsHelper.getSingleSystemSetting("instance")
      const newServerInstance = newInstance.value === "1"
      setIsServerInstance(newServerInstance)
      setLoading(false)

    }
    setLoading(false)
  }, [instance])

  const [chartData, setChartData] = useState([]);

  const fetchChartData = async () => {
    axios.get(`${url}charts/indicators?location=${'core'}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        setChartData(response.data);
      })

  }

  const [groupedIndicators, setGroupedIndicators] = useState({ line: [], pie: [], bar: [], card: [] });

  const fetchIndicatorValues = async (indicator) => {
    // const value = await axios.get(`${url}charts/dashboard/values?tableName=${indicator.tableName}&indicatorName=${indicator.indicatorName}&facilityId=${currentOrganisationUnitId}`, {
    const value = await axios.get(`${url}charts/dashboard/values?indicatorName=${indicator.indicatorName}&facilityId=${currentOrganisationUnitId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        console.log("Value: ", response.data.value);
        
        return response.data.value ? response.data.value : null;
      })

    return value;
  }

  const fetchAndSaveCurrentOrganisationUnitId = async () => {
    const currentOrg = await authentication.fetchCurrentOrganisationUnitId();
    setCurrentOrganisationUnitId(currentOrg)
  }

  useEffect(() => {
    const fetchAndGroup = async () => {
      for (const indicator of chartData) {
        try {
          const response = await fetchIndicatorValues(indicator);
          const updatedIndicator = { ...indicator, data: response };

          // Update state incrementally
          setGroupedIndicators((prevGroups) => {
            const groupType = updatedIndicator.type;
            const existingGroup = prevGroups[groupType] || [];

            return {
              ...prevGroups,
              [groupType]: [...existingGroup, updatedIndicator],
            };
          });
        } catch (err) {
          console.error(`Failed to fetch for ${indicator.indicatorName}`, err);
        }
      }
    };

    fetchAndGroup();
  }, [chartData]);

  useEffect(() => {
    fetchChartData();
    fetchAndSaveCurrentOrganisationUnitId()
  }, [])



  return (
    <>
      {(!loading) ? (
        <>
          {isServerInstance ? (
            <TabContext value={value}>
              <TabPanel value="2">
                <GeneralSummaryView />
              </TabPanel>
            </TabContext>
          ) : (
            <div className="row" st>
              <div className="col-xl-12">
                <div className="row">
                </div>
                {groupedIndicators.card.length > 0 &&
                  <div class="d-flex flex-wrap">
                    {groupedIndicators.card.sort((a,b) => a.position - b.position).map((indicator) => (
                      <div
                        className="card text-white mb-3"
                        style={{
                          width: "300px",
                          maxWidth: "400px",
                          height: "100px",
                          margin: "1rem",
                          borderRadius: "0.75rem",
                        }}
                      >
                        <div className="card-header border-1 pb-0 d-flex justify-content-between align-items-center">
                          <div>
                            <h2 className="font-w700 mb-0">{indicator.data}</h2>
                          </div>
                          <div>
                            <i style={{ color: "#3d4465" }} className={`fa-solid ${indicator.icon} fa-2x`}></i>
                          </div>
                        </div>
                        <div className="card-body pt-0 chart-body-wrapper">
                          <h5 className="mt-2">{indicator.displayName}</h5>
                        </div>
                      </div>
                    ))}

                  </div>}

                {groupedIndicators.pie.length > 0 &&
                  <div class="d-flex flex-wrap">
                    {groupedIndicators.pie.sort((a,b) => a.position - b.position).map((indicator) => (
                      <div style={{ padding: "1rem" }}>
                        <div className="card">
                          <div className="card-body pt-0 chart-body-wrapper">
                            <Pie
                              plotData={[{ male: 20, female: 30 }]}
                              title={`${indicator.displayName}`}
                            // seriesName="Active patients"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>}

                {groupedIndicators.line.length > 0 &&
                  <div class="d-flex flex-wrap">
                    {groupedIndicators.line.sort((a,b) => a.position - b.position).map((indicator) => (
                      <div style={{ padding: "1rem" }}>
                        <div className="card">
                          <div className="card-body pt-0 chart-body-wrapper">
                            <LineGraph
                              LineGraphData={[]}
                              title={`${indicator.displayName}`}
                              xName={`Year`}
                              yName={`Patient`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>}

                {groupedIndicators.bar.length > 0 &&
                  <div class="d-flex flex-wrap">
                    {groupedIndicators.bar.sort((a,b) => a.position - b.position).map((indicator) => (
                      <div style={{ padding: "1rem" }}>
                        <div className="card">
                          <div className="card-body pt-0 chart-body-wrapper">
                            <LineGraph
                              LineGraphData={[]}
                              title={`${indicator.displayName}`}
                              xName={`Year`}
                              yName={`Patient`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>}
                {(groupedIndicators.card.length < 1
                  && groupedIndicators.line.length < 1
                  && groupedIndicators.pie.length < 1
                  && groupedIndicators.bar.length < 1)
                  &&
                  (<div className="card vh-100 d-flex align-items-center justify-content-center">
                    <span>
                      <i style={{ color: "#3d4465" }} className="fa-solid fa-exclamation-circle fa-4x"></i>
                    </span>
                    <span className="text-black fw-medium fs-14">No Chart Data Found. Kindly contact admin</span>
                  </div>)
                }
              </div>
            </div>)}
        </>
      ) : (
        <>
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
        </>)}
    </>
  )
};
export default Home;