import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { url as baseUrl, url, token } from "../../../api";
import axios from "axios";

const Pie = ({ plotData, title, seriesName }) => {
  const options = {
    chart: {
      type: "pie",
    },
    title: {
      text: title,
    },
    plotOptions: {
      pie: {
        dataLabels: {
          style: {
            fontSize: "14px",
          },
        },
      },
    },
    legend: {
      itemStyle: {
        fontSize: "14px",
      },
    },
    series: [
      {
        name: seriesName,
        data: plotData,
      },
    ],
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Pie;
