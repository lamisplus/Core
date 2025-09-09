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

    "chart": {
      "type": "line"
    },
    "title": {
      "text": "sync_queue_over_time"
    },
    "series": [{
      name: 'Installation & Developers',
      data: [
        43934, 48656, 65165, 81827, 112143, 142383,
        171533, 165174, 155157, 161454, 154610, 168960, 171558
      ]
    }, {
      name: 'Manufacturing',
      data: [
        24916, 37941, 29742, 29851, 32490, 30282,
        38121, 36885, 33726, 34243, 31050, 33099, 33473
      ]
    }, {
      name: 'Sales & Distribution',
      data: [
        11744, 30000, 16005, 19771, 20185, 24377,
        32147, 30912, 29243, 29213, 25663, 28978, 30618
      ]
    }, {
      name: 'Operations & Maintenance',
      data: [
        null, null, null, null, null, null, null,
        null, 11164, 11218, 10077, 12530, 16585
      ]
    }, {
      name: 'Other',
      data: [
        21908, 5548, 8105, 11248, 8989, 11816, 18274,
        17300, 13053, 11906, 10073, 11471, 11648
      ]
    }],
    "yaxis": {
      "title": {
        "text": "file_count"
      }
    },
    "xaxis": null

  }

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default LineGraph;
