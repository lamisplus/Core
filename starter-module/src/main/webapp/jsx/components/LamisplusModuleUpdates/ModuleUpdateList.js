import React, {forwardRef, useEffect, useState} from 'react';
import axios from "axios";
import {url as baseUrl} from "../../../api";
import {Link} from "react-router-dom";
import Button from "@material-ui/core/Button";
import AddBox from "@material-ui/icons/AddBox";
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Edit from "@material-ui/icons/Edit";
import SaveAlt from "@material-ui/icons/SaveAlt";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import Search from "@material-ui/icons/Search";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Remove from "@material-ui/icons/Remove";
import ViewColumn from "@material-ui/icons/ViewColumn";
import {ToastContainer} from "react-toastify";
import MaterialTable from "material-table";
// import SplitActionButton from "../Button/SplitActionButton";
// import {FaEye} from "react-icons/fa";
// import {MdModeEdit, MdPerson} from "react-icons/md";


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};
function OrganizationList(props) {

    const [loading, setLoading] = useState(false);
    const [organizationList, setOrganizationList] = useState([]);
    useEffect(() => {
        OrganizationList();
	}, []);
    const OrganizationList =()=>{//Organization API
        setLoading(true)
        axios
            .get(`${baseUrl}central-lamisplus/get-all-organisations
            `)
            .then((response) => {
                setLoading(false)
                setOrganizationList(response.data);
            })
            .catch((error) => {
                setLoading(false)
            });
        
    }


    return (
        <div>
            <ToastContainer autoClose={3000} hideProgressBar />
            
            <MaterialTable
                icons={tableIcons}
                title="LAMISPlus Modules Update"
                columns={[
                    { title: "Module Name", field: "id", filtering: false, hidden:true },
                    { title: "Latest version", field: "name",filtering: true  },
                    { title: "Release Date", field: "description",filtering: true  },
                    { title: "Previous version", field: "description",filtering: true  },
                    { title: "Actions", field: "actions", filtering: false },
                ]}
                isLoading={loading}
                data={[].map((row) => ({
                    id: row.id,
                    name: row.name,
                    description: row.description,
                    actions: ""
                }))}
                options={{
                    headerStyle: {
                        backgroundColor: "#014d88",
                        color: "#fff",
                        fontSize:'14px',
                    },

                    searchFieldStyle: {
                        width: "150%",
                        margingLeft: "150px",
                    },
                    filtering: false,
                    exportButton: false,
                    searchFieldAlignment: "left",
                }}
            />
        </div>
    );
}

export default OrganizationList;