import React, { useState, useContext, useEffect } from 'react';
//import {Link} from 'react-router-dom';
// import loadable from "@loadable/component";
// import pMinDelay from "p-min-delay";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
//Import
import { toast } from "react-toastify";
import { ThemeContext } from "../../../context/ThemeContext";
import axios from "axios";
import { url as baseUrl } from "../../../api";
import { Progress, Spinner } from 'reactstrap';
import { GetPercentage, Varient } from '../../Utils/Utils';
import ProgressBar from "react-bootstrap/ProgressBar";
import DashboardDataFilter from '../utils/DashboardDataFilter';
import moment from 'moment';
// Load Highcharts modules
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/drilldown")(Highcharts);


// Make monochrome colors
var pieColors = (function () {
  var colors = []
  var base = Highcharts.getOptions().colors[0],
    i;

  for (i = 0; i < 10; i += 1) {
    // Start out with a darkened base color (negative brighten), and end
    // up with a much brighter color
    colors.push(Highcharts.color(base).brighten((i - 3) / 7).get());
  }
  return colors;
}());

const GeneralSummaryView = () => {
  const { changeBackground, background } = useContext(ThemeContext);
  const [loading, setLoading] = useState(false);
  const [totalIPs, setTotalIps] = useState("");
  const [totalFacilities, setTotalFacilities] = useState("")
  const [totalPatients, setToTalPatients] = useState("")
  const [patientsIpsAndHealthFacilitiesData, setPatientsIpsAndHealthFacilitiesData] = useState(null);
  const [reportingRateData, setReportingRateData] = useState(null);
  const [totalSyncdata, setTotalSyncData] = useState(null);
  const [patientBarChart, setPatientBarChart] = useState([]);
  //const [drilldownValue, setDrilldownValue]= useState([]);
  const [patientBarChart2, setPatientBarChart2] = useState(null);
  const [patientPieChartBySex, setPieChartBySex] = useState(null);
  const [totalPatientsBiometric, setToTalPatientsBiometric] = useState("")
  const [chartController, setChartController] = useState({
    chartTitle: "Ever Enrolled per IP",
    chartSubtitle: "Click to view facility ever enrolled",
    yAxisText: "Number of Patients",
    xAxisText: "Implementing Partners",
  });
  const [reported, setReported] = useState({
    reportedFacilities: 0,
    reportedPercentage: 0,
    totalFacilities: 0
  });
  const [totalSync, setTotalSync] = useState({
    totalProcessed: 0,
    totalSynced: 0,
    totalPending: 0
  })
  const [reportedIps, setReportedIps] = useState("")
  const [dateRange, setDateRange] = useState([moment().day(5).subtract(6, 'day').format("DD-MM-YYYY"), moment().day(5).format("DD-MM-YYYY")]);

  useEffect( async () => {
    changeBackground({ value: "light", label: "Light" });
    setLoading(true);
    // PatientsIpsAndHealthFacilities();
    // ReportingRate();
    // TotalSync();
    // TotalPatientBarChart();

    await fetchDashboardData();


    // TotalIP()
    // TotalFacility()
    // TotalPatientPieChartSex()
    // TotalPatient()
    // TotalBiometric()
    // TotalPatientBarChart2();
    // GetFacilityReportInfo();
    // ReportedIps();
    setLoading(false);
  }, [dateRange]);

  const fetchDashboardData = async () => {
    PatientsIpsAndHealthFacilities();
    ReportingRate();
    TotalSync();
    TotalPatientBarChart();
  }


  const ReportingRate = async () => {//Sync status record
    axios
      .get(`${baseUrl}sync-server-dashboard/facility-status/date-range?start=${dateRange[0]}&end=${dateRange[1]}`)
      .then((response) => {
        setReportingRateData(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const PatientsIpsAndHealthFacilities = async () => {//Sync status record
    axios
      .get(`${baseUrl}sync-server-dashboard/ip/facility/patient-count`)
      .then((response) => {
        setPatientsIpsAndHealthFacilitiesData(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const TotalSync = () => {//Sync status record
    axios
      .get(`${baseUrl}sync-server-dashboard/sync-status/date-range?start=${dateRange[0]}&end=${dateRange[1]}`)
      .then((response) => {
        setTotalSyncData(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const TotalPatientPieChartSex = () => {//Get registered patient by Sex 
    axios
      .get(`${baseUrl}central-lamisplus/get-pie-chart-male-female-patients`)
      .then((response) => {
        setPieChartBySex(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const GetFacilityReportInfo = () => {//Get registered patient by Sex 
    axios
      .get(`${baseUrl}central-lamisplus/get-facility-report-info`)
      .then((response) => {
        setReported(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const TotalIP = () => {//GET TOTAL NUMBER OF IMPLEMENTING PARNERS
    axios
      .get(`${baseUrl}central-lamisplus/get-total-ips`)
      .then((response) => {
        setTotalIps(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const ReportedIps = () => {//GET TOTAL NUMBER OF IMPLEMENTING PARNERS
    axios
      .get(`${baseUrl}central-lamisplus/reported-ips`)
      .then((response) => {
        setReportedIps(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const TotalBiometric = () => {//GET TOTAL NUMBER OF BIOMETRIC
    axios
      .get(`${baseUrl}central-lamisplus/get-total-biometric-captured`)
      .then((response) => {
        setToTalPatientsBiometric(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const TotalPatient = () => {//TOTAL NUMBER OF PATIENT
    axios
      .get(`${baseUrl}central-lamisplus/get-total-patients`)
      .then((response) => {
        setToTalPatients(response.data);
        setToTalPatients(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const TotalFacility = () => {//TOTAL NUMBER OF FACILITY
    axios
      .get(`${baseUrl}central-lamisplus/get-total-facilities`)
      .then((response) => {
        setTotalFacilities(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const TotalPatientBarChart = () => {// Bar chart with drilldown
    axios
      .get(`${baseUrl}sync-server-dashboard/patient-count/ip/`)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setPatientBarChart(response.data);
        } else {
          setPatientBarChart([]);
        }
        //console.log(response.data.drillDowns)
        //manipulation of the drilldowns
        // const result = response.data.drillDowns.map((obj2) => {
        //   const resultobj = Object.keys(obj2.data).map((key) =>[key, obj2.data[key]]);
        //   obj2.data=resultobj  
        //   return obj2
        // });
        // //setDrilldownValue(result)
        // patientBarChart.drillDowns=result
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const TotalPatientBarChart2 = () => {//Bar chart by IP and patients
    axios
      .get(`${baseUrl}central-lamisplus/get-bar-chart`)
      .then((response) => {
        setPatientBarChart2(response.data);
      })
      .catch((error) => {
        //console.log(error);
      });

  }
  const drilldownBarChartByIPAvtivePatients = {//Highchart object for Drill down bar chart
    chart: {
      type: 'column'
    },
    title: {
      align: 'center',
      text: 'Registered Patient Per IP '
    },
    subtitle: {
      align: 'center',
      text: 'Click to view facilities registered patients'
    },
    accessibility: {
      announceNewData: {
        enabled: true
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Number of Patients'
      }

    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}'
        }
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>'
    },

    series: [
      {
        name: 'Implementing Partners',
        colorByPoint: true,
        data: patientBarChart.data
      }
    ],
    drilldown: {
      breadcrumbs: {
        position: {
          align: 'left'
        }
      },
      series: patientBarChart.drillDowns

    }
  }
  // const barChartByIPActivePatients = {// Highchart onject for bar chart of registered patient
  //     chart: {
  //       type: 'column'
  //   },
  //   title: {
  //       text: 'Number of registered patients per IP'
  //   },
  //   subtitle: {
  //       text: ''
  //   },
  //   xAxis: {
  //       categories: patientBarChart2 && patientBarChart2.xaxis ? patientBarChart2.xaxis.categories :[
  //           'ACE1',
  //           'ACE2',
  //           'ACE3',
  //           'ACE4',
  //           'ACE5',
  //           'ACE6',
  //           'TMEC RISE',
  //           'KP CARE 1',
  //           'KP Care 2',
  //       ],
  //       crosshair: true
  //   },
  //   yAxis: {
  //       min: 0,
  //       title: {
  //           text: 'Total Patients'
  //       }
  //   },
  //
  //   plotOptions: {
  //       column: {
  //           pointPadding: 0.2,
  //           borderWidth: 0
  //       }
  //   },
  //
  //   series: [{
  //     colorByPoint: true,
  //       name: 'Implementing Partners',
  //       data: patientBarChart2 && patientBarChart2.series ? patientBarChart2.series[0].data : []
  //
  //   }]
  // }
  const pieChartBySex2 = {//Highchart object for pie CHart by SEX
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: 'Number of Patients By SEX',
      align: 'center'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        colors: pieColors,
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
          distance: -50,
          filter: {
            property: 'percentage',
            operator: '>',
            value: 4
          }
        }
      }
    },
    series: [{
      name: 'Share',
      data: patientPieChartBySex
    }]
  }

  const getPercentage = (reportingRateData) => {
    if (reportingRateData) {
      return GetPercentage(reportingRateData.syncedFacilities || 0, reportingRateData.expectedFacilities || 0).toFixed(2);
    }
    return 0;
  }

  const drilldown = (event) => {
    // console.log(event);
    // setChartController({
    //   chartTitle: "Registered Patients per Facility",
    //   chartSubtitle: "Click to view patient details",
    //   yAxisText: "Number of Patients",
    //   xAxisText: "Facilities",
    // });
  }

  const barChartOptions = {
    title: {
      text: chartController.chartTitle,
      align: 'center'
    },
    subtitle: {
      align: 'center',
      text: chartController.chartSubtitle
    },
    chart: {
      type: 'column'
    },
    series: [
      {
        name: chartController.xAxisText,
        colorByPoint: true,
        data: patientBarChart ? patientBarChart.map(each => each.patientCount || 0) : []
      }
    ],
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b> of total<br/>',
      formatter: function () {
        // Format the tooltip to display whole numbers
        return `<b>${this.x}</b>: ${Math.round(this.y)}`;
      },
    },
    xAxis: {
      categories: patientBarChart.length > 0 ? patientBarChart.map(each => each.orgUnit || 0) : [],
    },
    yAxis: {
      title: {
        text: chartController.yAxisText
      },
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}'
        },
        events: {
          click: drilldown,
        }
      }
    },
  }

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
  };

  // Debounced version of setDateRange with a delay. this prevents the API from DoS attacks 
  const debouncedSetDateRange = debounce((range) => {
    setDateRange(range);
  }, 700);

  // Original function
  const fetchDashboardDataForSelectedWeek = (range) => {
    debouncedSetDateRange(range);
  };

  return (
    <div className="m-2 mt-0">
      <div className="form-head mb-4 d-flex flex-wrap align-items-center">
        <div className="me-auto">
          <h2 className="font-w600 mb-0">Dashboard</h2>
        </div>
      </div>
      <div>
        <DashboardDataFilter callBackFunction={fetchDashboardDataForSelectedWeek} disabled={false} />
      </div>
      <>
        {!loading ? <><div className="row" >
          <div className="col-xl-12">
            <div className="row">

              <div className=" col-md-4 ">
                <div className="widget-stat card">
                  <div className="card-body p-4">
                    <div className="media ai-icon">
                      <span className="me-3 bgl-primary">
                        <i className="la la-users"></i>
                      </span>
                      <div className="media-body">
                        <p className="mb-1">Ever Enrolled</p>
                        <h4 className="mb-0">{patientsIpsAndHealthFacilitiesData ? (patientsIpsAndHealthFacilitiesData.patientCount ? patientsIpsAndHealthFacilitiesData.patientCount.toLocaleString() : 0) : 0}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-4 ">
                <div className="widget-stat card">
                  <div className="card-body p-4">
                    <div className="media ai-icon">
                      <span className="me-3 bgl-secondary">
                        <i className="la la-folder"></i>
                      </span>
                      <div className="media-body">
                        <p className="mb-1">Implementing Partners</p>
                        <h4 className="mb-0">{patientsIpsAndHealthFacilitiesData ? (patientsIpsAndHealthFacilitiesData.ipCount ? patientsIpsAndHealthFacilitiesData.ipCount.toLocaleString() : 0) : 0}</h4>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" col-md-4">
                <div className="widget-stat card">
                  <div className="card-body  p-4">
                    <div className="media ai-icon">
                      <span className="me-3 bgl-info">
                        <i className="la la-hospital"></i>
                      </span>
                      <div className="media-body">
                        <p className="mb-1">Health Facilities</p>
                        <h4 className="mb-0">{patientsIpsAndHealthFacilitiesData ? (patientsIpsAndHealthFacilitiesData.facilitiesCount ? patientsIpsAndHealthFacilitiesData.facilitiesCount : 0) : 0}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          <div className='row'>
            <div className="col-xl-12">
              <div className="card bg-white" style={{ backgroundColor: '#0D3068', borderRadius: "0.2rem", color: '#0D3068' }}>
                <div className="card-body">
                  <div className="d-sm-flex d-block  align-items-end ">
                    <div className="me-auto pe-3 mb-sm-0">
                      <span className=""><h3>Reporting Rate</h3> </span>
                      <br />
                      <p>Facility Reported </p>
                      <h2 className="chart-num-3  mb-0">{reportingRateData ? (reportingRateData.syncedFacilities ? reportingRateData.syncedFacilities : 0) : 0} of {reportingRateData ? (reportingRateData.expectedFacilities ? reportingRateData.expectedFacilities : 0) : 0}<span className="fs-18 me-2 ms-3"></span></h2>
                      <p>{`Reporting by Percentage (${getPercentage(reportingRateData)}%)`}</p>
                    </div>
                  </div>
                  <ProgressBar
                    now={getPercentage(reportingRateData)}
                    variant={Varient(getPercentage(reportingRateData))}
                    style={{ width: "100%", marginTop: "10px", marginBottom: "10px" }}
                  // label={`${reportingRateData ? GetPercentage(reportingRateData.syncedFacilities || 0, reportingRateData.expectedFacilities || 0) : 0}%`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 mb-3">
              <div className="div bg-primary">
                <div className="card-body">
                  <div className="d-sm-flex d-block pb-sm-3 align-items-end mb-2">
                    <div className="me-auto pe-3 mb-3 mb-sm-0">
                      <span className="chart-num-3 font-w200 d-block mb-sm-3 mb-2 text-white">Records Synced </span>
                      <h2 className="chart-num-2 text-white mb-0">{totalSyncdata ? (totalSyncdata.filesSynced ? totalSyncdata.filesSynced : 0) : 0}<span className="fs-18 me-2 ms-3"></span></h2>
                    </div>

                  </div>
                  <div className="progress style-1" style={{ height: "15px" }}>
                    <div className="progress-bar bg-white progress-animated" style={{ width: "100%", height: "15px" }} role="progressbar">

                      <span className="bg-white arrow"></span>
                      {/* <span className="font-w600 counter-bx text-black"><strong className="counter font-w400">985 Left</strong></span> */}
                    </div>
                  </div>
                  <p className=" text-white pt-2">Number of record(s) synced</p>

                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="div bg-info">
                <div className="card-body">
                  <div className="d-sm-flex d-block pb-sm-3 align-items-end mb-2">
                    <div className="me-auto pe-3 mb-3 mb-sm-0">
                      <span className="chart-num-3 font-w200 d-block mb-sm-3 mb-2 text-white">Records Processed</span>
                      <h2 className="chart-num-2 text-white mb-0">{totalSyncdata ? (totalSyncdata.filesProcessed ? totalSyncdata.filesProcessed : 0) : 0}<span className="fs-18 me-2 ms-3"></span></h2>
                    </div>

                  </div>
                  <div className="progress style-1" style={{ height: "15px" }}>
                    <div className="progress-bar bg-white progress-animated" style={{ width: "100%", height: "15px" }} role="progressbar">

                      <span className="bg-white arrow"></span>

                    </div>
                  </div>
                  <p className=" text-white pt-2">Number of record(s) processed</p>

                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="div bg-warning">
                <div className="card-body">
                  <div className="d-sm-flex d-block pb-sm-3 align-items-end mb-2">
                    <div className="me-auto pe-3 mb-3 mb-sm-0">
                      <span className="chart-num-3 font-w200 d-block mb-sm-3 mb-2 text-white">Records Pending</span>
                      <h2 className="chart-num-2 text-white mb-0">{totalSyncdata ? (totalSyncdata.filesPending ? totalSyncdata.filesPending : 0) : 0}<span className="fs-18 me-2 ms-3"></span></h2>
                    </div>

                  </div>
                  <div className="progress style-1" style={{ height: "15px" }}>
                    <div className="progress-bar bg-white progress-animated" style={{ width: "100%", height: "15px" }} role="progressbar">
                      <span className="bg-white arrow"></span>

                    </div>
                  </div>
                  <p className=" text-white pt-2">Number of record(s)  pending </p>

                </div>
              </div>
            </div>

            {/* <div className="col-xl-12 mb-3">
					<div className="row">		
						<div className="col-xl-6">
              <HighchartsReact
              highcharts={Highcharts}
              options={barChartByIPActivePatients}
              />
						</div>	
						<div className="col-xl-6">
              <HighchartsReact
              highcharts={Highcharts}
              options={pieChartBySex2}
              />
						</div>
					</div>
				</div>	 */}
            <div className="col-xl-12 col-xxl-12">
              <div className="row">

                <div className="col-xl-12 col-xxl-12">
                  <HighchartsReact
                    highcharts={Highcharts}
                    // options={drilldownBarChartByIPAvtivePatients}
                    options={barChartOptions}
                  />
                </div>
              </div>
            </div>

          </div>
          </> : <div className="text-center mt-5" ><Spinner /> </div>}
      </>
    </div>
  )
}
export default GeneralSummaryView;