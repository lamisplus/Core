import React,{useState,useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import loadable from "@loadable/component";
import pMinDelay from "p-min-delay";
import {Dropdown, Spinner} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

//Import
import { ThemeContext } from "../../../context/ThemeContext";
import BestSellingTab from '../Ventic/Home/Tab/BestSellingTab';
import RecentEvenList from '../Ventic/Home/RecentEvenList';
import Latestsaleblog from '../Ventic/Home/Latestsaleblog';
import SalesRevenueTab from '../Ventic/Home/Revenue/SalesRevenueTab';
import UpcomingEventSection from '../Ventic/Home/UpcomingEventSection';
import landingPageImage from '../../../images/lamisPlus/emr-landingpage.jpg'
import avatar from "../../../images/avatar/1.jpg";
import GeneralSummaryView from './GeneralSummaryView';
import { Box, Tab, Tabs } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

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
	const listOfAllModule = useSelector(state => state.boostrapmodule.list);
	const [hasServerInstalled, setHasServerInstalled] = useState(false);
	const [value, setValue] = React.useState('2');
	const [loading, setLoading] = useState(true);
	const handleTabsChange = (event, newValue) => {
		setValue(newValue);
	}
	const { changeBackground, background } = useContext(ThemeContext);
	  useEffect(() => {
		changeBackground({ value: "light", label: "Light" });
	}, []);
	console.log(listOfAllModule);

	useEffect(() => {
		if (listOfAllModule) {
			if(listOfAllModule.length > 0){
				listOfAllModule.map((item) => {
					if(item.name === 'ServerSyncModule'){
						setHasServerInstalled(true);
					}
				});
			}
			setLoading(false);
		}

	},[listOfAllModule]);


	
	

	return(
		<>
		{!loading ? (<>
		{hasServerInstalled ? (<TabContext value={value}>
        {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabsChange} aria-label="lab API tabs example">
            <Tab label="Dashboard" value="1" />
            <Tab label="Server Dashboard" value="2" />
          </TabList>
        </Box> */}
        <TabPanel style={{margin: "0px", padding:"0px"}} value="1"><div className="row" st>
				<div className="col-xl-12">
					<div className="row">
						<img src={landingPageImage} width={10} alt="" style={{width:'100%'}} />
					</div>
				</div>
			</div>
		</TabPanel>
        <TabPanel value="2"><GeneralSummaryView /></TabPanel>
      </TabContext>) : (<div className="row" st>
				<div className="col-xl-12">
					<div className="row">
						<img src={landingPageImage} width={10} alt="" style={{width:'100%'}} />
					</div>
				</div>
			</div>)}
		</>
		) : (
			<div style={{marginTop: "200px", height:"100%", width:"100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
				<Spinner size="lg" animation="border" />
			</div>
		)}
		</>
	)
}
export default Home;