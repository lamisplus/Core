import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { url as baseUrl, url, token } from "../../../api";
import axios from "axios";

const LineGraph = ({ LineGraphData, title, xName, yName }) => {
  const seriesData = {
    male: LineGraphData.map((item) => [item.year, item.male]),
    female: LineGraphData.map((item) => [item.year, item.female]),
  };

  const options = {
    chart: {
      type: "line",
    },
    title: {
      text: title,
      style: {
        fontSize: "18px",
      },
    },
    xAxis: {
      title: {
        text: xName,
        style: {
          fontSize: "14px",
        },
      },
      labels: {
        style: {
          fontSize: "14px",
        },
      },
      categories: LineGraphData.map((item) => item.year),
    },
    yAxis: {
      title: {
        text: yName,
        style: {
          fontSize: "14px",
        },
      },
      labels: {
        style: {
          fontSize: "14px",
        },
      },
    },
    series: [
      { name: "Female", data: seriesData.female },
      { name: "Male", data: seriesData.male },
    ],
    legend: {
      itemStyle: {
        fontSize: "14px",
      },
    },
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineGraph;
