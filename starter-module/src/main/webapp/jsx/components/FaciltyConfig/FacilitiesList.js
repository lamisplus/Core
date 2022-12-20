import React, {forwardRef, useEffect, useState} from 'react';
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
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import MaterialTable from "material-table";
import SplitActionButton from "../Button/SplitActionButton";
import {FaEye} from "react-icons/fa";
import {MdModeEdit, MdPerson} from "react-icons/md";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
}));
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
function FacilitiesList(props) {
    let history = useHistory();
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [rolesList, setRolesList] = useState([]);

    function actionItems(row){
        return  [
            {
                type:'link',
                name:'View',
                icon:<FaEye  size="22"/>,
                to:{
                    pathname: "/edit-role",
                    state: { row: row }
                }
            },
            {
                type:'link',
                name:'Edit',
                icon:<MdPerson size="20" color='#014d88' />,
                to:{
                    pathname: "/edit-role",
                    state: { row: row }
                }
            },
/*            {
                type:'button',
                name:'Delete',
                icon:<MdModeEdit size="20" color='#014d88' />,
                onClick:(() =>  deleteRoleModal(row.id))
            }*/
        ]
    }
    return (
        <div>
            <ToastContainer autoClose={3000} hideProgressBar />
            <MaterialTable
                icons={tableIcons}
                title="Facilities"
                columns={[
                    { title: "Id", field: "id", filtering: false, hidden:true },
                    { title: "State", field: "state",filtering: true  },
                    { title: "LGA", field: "lga",filtering: true  },
                    { title: "Facility", field: "facility_name",filtering: true  },
                    { title: "MFL Code", field: "mfl_code",filtering: true  },
                    { title: "Datim UID", field: "datim_uid",filtering: true },
                    { title: "Actions", field: "actions", filtering: false },
                ]}
                isLoading={loading}
                data={rolesList.map((row) => ({
                    id: row.id,
                    name: row.name,

                    actions: (
                        <div>
                            <SplitActionButton actions={actionItems(row)} />
                        </div>
                    ),
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

export default FacilitiesList;