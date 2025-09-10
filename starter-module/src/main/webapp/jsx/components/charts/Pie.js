import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Pie = ({ plotData, title, seriesName }) => {
  const options = {
    "chart": {
      "type": "pie"
    },
    "title": {
      "text": "sync_queue_status_example"
    },
    "series": [
      {
        "name": "Sync_Queue_Status",
        "data": [
          {
            "name": "Error while processing",
            "y": 24
          },
          {
            "name": "Incomplete Uploads",
            "y": 37
          }
        ]
      }
    ],
    "yaxis": null,
    "xaxis": null
  }

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default Pie;



