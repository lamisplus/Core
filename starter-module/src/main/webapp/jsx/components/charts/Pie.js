import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const Pie = ({ chartData }) => {

  if (!chartData || !chartData.series) {
    return (
      <div style={{ padding: '20px', color: '#6c757d', textAlign: 'center' }}>
        Invalid chart data
      </div>
    );
  }


  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={chartData} />
    </div>
  );
};

export default Pie;



