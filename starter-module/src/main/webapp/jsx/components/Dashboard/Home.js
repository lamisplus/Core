import React,{useState,useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import {Dropdown} from 'react-bootstrap';

//Import
import { ThemeContext } from "../../../context/ThemeContext";
import BestSellingTab from '../Ventic/Home/Tab/BestSellingTab';
import RecentEvenList from '../Ventic/Home/RecentEvenList';
import Latestsaleblog from '../Ventic/Home/Latestsaleblog';
import SalesRevenueTab from '../Ventic/Home/Revenue/SalesRevenueTab';
import UpcomingEventSection from '../Ventic/Home/UpcomingEventSection';


const TicketsLineApex = loadable(() =>
	pMinDelay(import("../Ventic/Home/TicketsLineApex"), 1000)
);
const RevenueLineApex = loadable(() =>
	pMinDelay(import("../Ventic/Home/RevenueLineApex"), 1000)
);
const SalesCanvas = loadable(() =>
	pMinDelay(import("../Ventic/Home/SalesCanvas"), 1000)
);
const Donut = loadable(() =>
	pMinDelay(import("../Ventic/Home/Donut"), 1000)
);

const Home = () => {
	const { changeBackground, background } = useContext(ThemeContext);
	  useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);
	

	return(
		<>
			<div className="form-head mb-4 d-flex flex-wrap align-items-center">
				<div className="me-auto">
					<h2 className="font-w600 mb-0">Dashboard</h2>
					{/* <p className="text-light">Lorem ipsum  dolor sit amet </p> */}
				</div>	
				
				
			</div>
			
			<div className="row">
				<div className="col-xl-12">
					<div className="row">
					
						<div className="col-xl-3 col-xxl-6 col-sm-6 " >
							<div className="card" style={{borderRadius:"6px"}}>
								<div className="card-header border-0 pb-0">
									<div className="d-flex align-items-center">
										<h2 className="chart-num font-w600 mb-0">60</h2>
										<svg className="ms-2 primary-icon" width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M2.00401 11.1924C0.222201 11.1924 -0.670134 9.0381 0.589795 7.77817L7.78218 0.585786C8.56323 -0.195262 9.82956 -0.195262 10.6106 0.585786L17.803 7.77817C19.0629 9.0381 18.1706 11.1924 16.3888 11.1924H2.00401Z" fill="#0E8A74"/>
										</svg>
									</div>
									<div>
										<h5 className="text-black font-w500 mb-0">Facilities</h5>
									</div>
								</div>
								<div className="card-body pt-0">
									<SalesCanvas />
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-xxl-6 col-sm-6 ">
							<div className="card" style={{borderRadius:"6px"}}>
								<div className="card-body pt-sm-4 pt-3 d-flex align-items-center justify-content-between">
									<div className="me-3">
										<div className="d-flex align-items-center">
											<h2 className="chart-num font-w600 mb-0">5</h2>
										</div>
										<div>
											<h5 className="text-black font-w500 mb-3 mt-2">Modules</h5>
										</div>
										<div>
											<p className="text-primary fs-14 mb-0">
												<svg className="me-2 primary-icon" width="19" height="12" viewBox="0 0 19 12" fill="none" xmlns=	"http://www.w3.org/2000/svg">
													<path d="M2.00401 11.1924C0.222201 11.1924 -0.670134 9.0381 0.589795 7.77817L7.78218 0.585786C8.56323 -0.195262 9.82956 -0.195262 10.6106 0.585786L17.803 7.77817C19.0629 9.0381 18.1706 11.1924 16.3888 11.1924H2.00401Z" fill="#0E8A74"/>
												</svg>
												8.9%
												<span className="op-6 text-light">Iactive</span>
											</p>
										</div>
									</div>
									<div>
										<div className="d-inline-block position-relative donut-chart-sale">									 
											{background.value === "dark" ? (
											  <Donut
												value={90}
												backgroundColor="#FF6826"
												backgroundColor2="#F0F0F0"
											  />
											) : (
											  <Donut value={66} backgroundColor="rgb(14, 138, 116,1)" />
											)}
											<small>66%</small>
										</div>
									</div>	
								</div>
							</div>
						</div>
						
					</div>
				</div>
				
				
			</div>	
		</>
	)
}
export default Home;