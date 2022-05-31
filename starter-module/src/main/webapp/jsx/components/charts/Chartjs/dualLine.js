import React, { Component } from "react";
import { Line } from "react-chartjs-2";

const data = {
	defaultFontFamily: "Poppins",
	labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
	datasets: [
		{
		  label: "My First dataset",
		  data: [33, 53, 85, 41, 44, 65],
		  fill: false,
		  backgroundColor: "rgba(251,62,122,0.2)",
		  borderColor: "rgba(251,62,122,1)"
		},
		{
		  label: "My Second dataset",
		  data: [33, 25, 35, 51, 54, 76],
		  fill: true,
		  borderColor: "#0E8A74"
		}
	]
};


const options = {
	legend: false,
	tooltips: {
		intersect: false,
	},
	hover: {
    // mode: "nearest",
		intersect: true,
	},
	scales: {
		yAxes: [
		  {
			ticks: {
			  beginAtZero: true,
			  max: 100,
			  min: 0,
			  stepSize: 20,
			  padding: 10,
			},
		  },
		],
		xAxes: [
			{
				ticks: {
					padding: 5,
				},
			},
		],
    },
};
class DualLine extends Component {
	render() {
		return <Line data={data} options={options} height={150} />;
	}
}

export default DualLine;
