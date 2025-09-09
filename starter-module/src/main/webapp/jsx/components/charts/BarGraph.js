import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const BarGraph = ({ barGraphData, title, xName, yName, categories, series }) => {
  // Default options structure for the bar chart
  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: title || 'Bar Chart'
    },
    xAxis: {
      categories: categories || barGraphData?.map(item => item.category) || [],
      title: {
        text: xName || 'Categories'
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: yName || 'Values'
      }
    },
    legend: {
      enabled: true
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.y}</b>'
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false
        },
        enableMouseTracking: true
      }
    },
    series: series || [
      {
        name: 'Data',
        data: barGraphData?.map(item => item.value) || []
      }
    ]
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarGraph;