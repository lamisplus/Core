import React, { useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { useQuery, useQueries } from "react-query";
import Pie from "../charts/Pie";
import LineGraph from "../charts/LineGraph";
import GeneralSummaryView from "./GeneralSummaryView";
import { TabContext, TabPanel } from "@material-ui/lab";
import { fetchInstanceSetting } from "../../../_services/fetchInstanceSetting";
import { fetchChartData } from "../../../_services/fetchChartData";
import { fetchIndicatorValues } from "../../../_services/fetchIndicatorValues";
import { fetchCurrentOrganisationUnitId } from "../../../_services/fetchCurrentOrganisationUnitId";
import BarGraph from "../charts/BarGraph";
import ChartErrorBoundary from "./ChartErrorBoundary/ChartErrorBoundary";



const Home = () => {
  const [value, setValue] = React.useState("2");

  const { data: instance, isLoading: instanceLoading } = useQuery(
    "instanceSetting",
    fetchInstanceSetting,
    {
      staleTime: Infinity,
    }
  );

  const { data: currentOrganisationUnitId } = useQuery(
    "currentOrganisationUnitId",
    fetchCurrentOrganisationUnitId,
    {
      enabled: !instanceLoading,
    }
  );

  const { data: chartData, isLoading: chartDataLoading } = useQuery(
    "chartIndicators",
    fetchChartData,
    {
      enabled: !instanceLoading && !!currentOrganisationUnitId,
    }
  );

  const indicatorValuesQueries = useQueries(
    chartData?.map((indicator) => ({
      queryKey: ["indicatorValue", indicator.indicatorName, currentOrganisationUnitId],
      queryFn: () => fetchIndicatorValues(indicator, currentOrganisationUnitId),
      enabled: !!chartData && !!currentOrganisationUnitId,
    })) || []
  );

  const groupedIndicators = useMemo(() => {
    const groups = { line: [], pie: [], column: [], card: [] };

    if (chartData && indicatorValuesQueries.every(query => query.isSuccess)) {
      chartData.forEach((indicator, index) => {
        const value = indicatorValuesQueries?.[index]?.data;
        const updatedIndicator = { ...indicator, data: value };
        groups[updatedIndicator?.type]?.push?.(updatedIndicator);
      });
    }

    return groups;
  }, [chartData, indicatorValuesQueries]);

  const isServerInstance = instance?.value === "1";


  const isAnyQueryLoading = instanceLoading ||
    chartDataLoading ||
    indicatorValuesQueries.some(query => query.isLoading);


  const hasNoChartData = !isAnyQueryLoading &&
    Object.values(groupedIndicators).every(arr => arr.length === 0);

  return (
    <ChartErrorBoundary>
      {isAnyQueryLoading ? (
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
      ) : (
        <>
          {isServerInstance ? (
            <TabContext value={value}>
              <TabPanel value="2">
                <GeneralSummaryView />
              </TabPanel>
            </TabContext>
          ) : (
            <>
              {groupedIndicators?.card?.length > 0 && (
                <div className="row">
                  {groupedIndicators?.card
                    ?.sort?.((a, b) => a.position - b.position)
                    ?.map?.((indicator) => (
                      <div className="col-4">
                        <ChartErrorBoundary>
                          <IndicatorCard key={indicator?.indicatorName || ""} indicator={indicator} />
                        </ChartErrorBoundary>
                      </div>
                    ))}
                </div>
              )}

              <div className="row">
                {groupedIndicators?.pie?.length > 0 && (
                  <>
                    {groupedIndicators?.pie
                      .sort((a, b) => a.position - b.position)
                      .map((indicator) => (
                        <div className="col-6">
                          <ChartErrorBoundary>
                            <ChartContainer key={indicator?.indicatorName || ""}>
                              <Pie
                                chartData={indicator.data}
                                title={indicator?.displayName || ""}
                              />
                            </ChartContainer>
                          </ChartErrorBoundary>
                        </div>
                      ))}
                  </>
                )}

                {groupedIndicators?.line?.length > 0 && (
                  <>
                    {groupedIndicators?.line
                      .sort((a, b) => a.position - b.position)
                      .map((indicator) => (
                        <div className="col-6">
                          <ChartErrorBoundary>
                            <ChartContainer key={indicator?.indicatorName || ""}>
                              <LineGraph
                                chartData={indicator?.data}
                              />
                            </ChartContainer>
                          </ChartErrorBoundary>
                        </div>
                      ))}
                  </>
                )}

                {groupedIndicators?.column?.length > 0 && (
                  <>
                    {groupedIndicators?.column
                      .sort((a, b) => a.position - b.position)
                      .map((indicator) => (
                        <div className="col-6">
                          <ChartErrorBoundary>
                            <ChartContainer key={indicator?.indicatorName || ""}>
                              <BarGraph
                                chartData={indicator?.data}
                              />
                            </ChartContainer>
                          </ChartErrorBoundary>
                        </div>
                      ))}
                  </>
                )}

              </div>






              <div className="row">
                {hasNoChartData && <NoDataPlaceholder />}
              </div>
            </>
          )}
        </>
      )}
    </ChartErrorBoundary>
  );
};

const IndicatorCard = ({ indicator }) => (
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
);

const ChartContainer = ({ children }) => (
  <div style={{ padding: "10px" }}>
    <div className="card">
      <div className="card-body pt-0">{children}</div>
    </div>
  </div>
);

const NoDataPlaceholder = () => (
  <div className="card vh-100 d-flex align-items-center justify-content-center">
    <span>
      <i style={{ color: "#3d4465" }} className="fa-solid fa-exclamation-circle fa-4x"></i>
    </span>
    <span className="text-black fw-medium fs-14">
      No Chart Data Found. Kindly contact admin
    </span>
  </div>
);

export default Home;