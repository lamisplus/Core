import React, { useRef, useState } from "react";
import { Card, CardContent, Button as MuiButton, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "./../../layouts/PageTitle";
import { ToastContainer } from "react-toastify";
import "semantic-ui-css/semantic.min.css";
import "@reach/menu-button/styles.css";
import { FaDownload, FaUpload, FaUserPlus } from "react-icons/fa";
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { forwardRef } from "react";
import MaterialTable from "material-table";
import { useMutation, useQuery } from "react-query";
import { fetchChartConfig } from "../../../_services/fetchChartConfig";
import { toast } from "react-toastify";
import { queryClient } from "../../../_helpers/queryClient";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { Formik, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import ButtonMui from "@material-ui/core/Button";
import { MdSaveAlt } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import { updateChartConfig } from "../../../_services/updateChartConfig";
import { deleteChartConfig } from "../../../_services/deleteChartConfig";
import { exportChart } from "../../../_services/exportChartConfig";
import { importCharts } from "../../../_services/importCharts";

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    errorText: {
        color: 'red',
        fontSize: '12px',
        marginTop: '5px'
    }
}));


const validationSchema = Yup.object().shape({
    indicatorName: Yup.string()
        .required('Indicator Name is required')
        .min(2, 'Indicator Name must be at least 2 characters'),
    type: Yup.string()
        .required('Type is required'),
    description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
    displayName: Yup.string()
        .required('Display Name is required'),
    module: Yup.string()
        .required('Module is required'),
    icon: Yup.string()
        .required('Icon is required'),
    position: Yup.number()
        .required('Position is required')
        .positive('Position must be a positive number')
        .integer('Position must be an integer'),
    location: Yup.string()
        .required('Location is required')
});

const ChartConfigPage = (props) => {
    const classes = useStyles();
    const fileInputRef = useRef(null);

    const [query, setQueryParams] = useState({
        page: 0,
        pageSize: 10,
        search: "",
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [importing, setImporting] = useState(false);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);


    const importMutation = useMutation(importCharts, {
        onSuccess: () => {
            queryClient.invalidateQueries(["FETCH_CHATS"]);
            setImporting(false);
            setImportModalOpen(false);
            setSelectedFile(null);
        },
        onError: () => {
            setImporting(false);
        }
    });

    const handleImportClick = () => {
        setImportModalOpen(true);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check if file is JSON
            if (file.type !== "application/json" && !file.name.endsWith('.json')) {
                toast.error("Please select a JSON file");
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) {
            toast.error("Please select a file first");
            return;
        }

        setImporting(true);
        importMutation.mutate(selectedFile);
    };



    const updateMutation = useMutation(updateChartConfig, {
        onSuccess: () => {
            queryClient.invalidateQueries(["FETCH_CHATS"]);
            toast.success("Chart configuration updated successfully");
            setEditModalOpen(false);
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.apierror?.message || "Something went wrong";
            toast.error(errorMessage);
        }
    });

    const deleteMutation = useMutation(deleteChartConfig, {
        onSuccess: () => {
            queryClient.invalidateQueries(["FETCH_CHATS"]);
            toast.success("Chart configuration deleted successfully");
            setDeleteModalOpen(false);
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.apierror?.message || "Something went wrong";
            toast.error(errorMessage);
        }
    });

    const handleEdit = (row) => {
        setSelectedItem(row);
        setEditModalOpen(true);
    };

    const handleDelete = (row) => {
        setSelectedItem(row);
        setDeleteModalOpen(true);
    };

    const handleEditSubmit = (values) => {
        updateMutation.mutate({
            ...values,
            indicatorName: selectedItem.indicatorName
        });
    };

    const handleDeleteConfirm = () => {
        deleteMutation.mutate(selectedItem.indicatorName);
    };

    const prefetchNextPage = async () => {
        const nextPage = query.page + 1;
        const queryKey = ["FETCH_CHATS", { ...query, page: nextPage }];
        await queryClient.prefetchQuery(queryKey, () =>
            fetchChartConfig({ ...query, page: nextPage })
        );
    };

    const { data, isLoading, refetch } = useQuery(
        ["FETCH_CHATS", query],
        () => fetchChartConfig(query),
        {
            onSuccess: () => {
                prefetchNextPage();
            },
            onError: (error) => {
                if (error.response && error.response.data) {
                    let errorMessage =
                        error.response.data.apierror &&
                            error.response.data.apierror.message !== ""
                            ? error.response.data.apierror.message
                            : "Something went wrong, please try again";
                    toast.error(errorMessage);
                } else {
                    toast.error("Something went wrong. Please try again...");
                }
            },
        }
    );




    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: 'none' }}
            />

            <ToastContainer autoClose={3000} hideProgressBar />
            <PageTitle activeMenu="Chart Config" motherMenu="Chart Config" />


            <Dialog open={importModalOpen} onClose={() => setImportModalOpen(false)}>
                <DialogTitle>Import Chart Configuration</DialogTitle>
                <DialogContent>
                    <p>Select a JSON file to import chart configurations:</p>
                    <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => fileInputRef.current.click()}
                            disabled={importing}
                        >
                            Select File
                        </Button>
                        {selectedFile && (
                            <p style={{ marginTop: '8px' }}>
                                Selected file: {selectedFile.name}
                            </p>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <MuiButton
                        onClick={() => {
                            setImportModalOpen(false);
                            setSelectedFile(null);
                        }}
                        color="primary"
                        disabled={importing}
                    >
                        Cancel
                    </MuiButton>
                    <MuiButton
                        onClick={handleUpload}
                        color="primary"
                        variant="contained"
                        disabled={!selectedFile || importing}
                    >
                        {importing ? 'Uploading...' : 'Upload'}
                    </MuiButton>
                </DialogActions>
            </Dialog>

            <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
                <Formik
                    initialValues={{
                        indicatorName: selectedItem?.indicatorName || '',
                        type: selectedItem?.type || '',
                        description: selectedItem?.description || '',
                        displayName: selectedItem?.displayName || '',
                        module: selectedItem?.module || '',
                        icon: selectedItem?.icon || '',
                        position: selectedItem?.position || 0,
                        location: selectedItem?.location || ''
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleEditSubmit}
                    enableReinitialize
                >
                    {({ handleSubmit, handleChange, handleBlur, values, errors, touched, submitForm }) => (
                        <>
                            <DialogTitle>Edit Chart Configuration</DialogTitle>
                            <DialogContent>
                                <ChartConfigForm
                                    handleSubmit={handleSubmit}
                                    values={values}
                                    errors={errors}
                                    touched={touched}
                                    handleChange={handleChange}
                                    handleBlur={handleBlur}
                                />
                            </DialogContent>
                            <DialogActions>
                                <MuiButton onClick={() => setEditModalOpen(false)} color="primary">
                                    Cancel
                                </MuiButton>
                                <MuiButton
                                    onClick={submitForm}
                                    color="primary"
                                    variant="contained"
                                    disabled={updateMutation.isLoading}
                                >
                                    {updateMutation.isLoading ? 'Updating...' : 'Save Changes'}
                                </MuiButton>
                            </DialogActions>
                        </>
                    )}
                </Formik>
            </Dialog>

            <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to delete the chart configuration for "{selectedItem?.indicatorName}"?</p>
                    <p>This action cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={() => setDeleteModalOpen(false)} color="primary">
                        Cancel
                    </MuiButton>
                    <MuiButton
                        onClick={handleDeleteConfirm}
                        color="secondary"
                        variant="contained"
                        disabled={deleteMutation.isLoading}
                    >
                        {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                    </MuiButton>
                </DialogActions>
            </Dialog>

            <Card className={classes.cardBottom}>
                <CardContent>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <ButtonMui variant="contained"
                            color="primary"
                            startIcon={<FaUpload size="10" />}
                            onClick={handleImportClick}
                            disable={importing}
                            style={{ backgroundColor: '#014d88', margin: '10px' }}
                        >
                            <span style={{ textTransform: "capitalize", color: '#fff', fontWeight: 'bolder' }}>
                                Import config
                            </span>
                        </ButtonMui>

                        <ButtonMui variant="contained"
                            color="primary"
                            startIcon={<FaDownload size="10" />}
                            onClick={exportChart}
                            style={{ backgroundColor: '#014d88', margin: '10px' }}
                        >
                            <span style={{ textTransform: "capitalize", color: '#fff', fontWeight: 'bolder' }}>Export config</span>
                        </ButtonMui>
                    </div>
                   

                    <div>
                        <MaterialTable
                            icons={tableIcons}
                            title="Chart Config"
                            columns={[
                                {
                                    title: "Indicator Name",
                                    field: "indicatorName",
                                },
                                {
                                    title: "Type",
                                    field: "type",
                                    filtering: false,
                                },
                                {
                                    title: "Description",
                                    field: "description",
                                    filtering: false,
                                },
                                {
                                    title: "Display Name",
                                    field: "displayName",
                                },
                                {
                                    title: "Module",
                                    field: "module",
                                },
                                {
                                    title: "Icon",
                                    field: "icon",
                                    filtering: false,
                                },
                                {
                                    title: "Position",
                                    field: "position",
                                    type: "numeric",
                                    filtering: false,
                                },
                                {
                                    title: "Archived",
                                    field: "archived",
                                    type: "boolean",
                                    filtering: false,
                                },
                                {
                                    title: "ID",
                                    field: "id",
                                    filtering: false,
                                },
                                {
                                    title: "Location",
                                    field: "location",
                                },
                                {
                                    title: "Created Date",
                                    field: "createdDate",
                                    type: "datetime",
                                },
                                {
                                    title: "Created By",
                                    field: "createdBy",
                                },
                                {
                                    title: "Last Modified Date",
                                    field: "lastModifiedDate",
                                    type: "datetime",
                                },
                                {
                                    title: "Last Modified By",
                                    field: "lastModifiedBy",
                                },
                                {
                                    title: "Actions",
                                    field: "actions",
                                    filtering: false,
                                    sorting: false,
                                    render: (row) => (
                                        <div>
                                            <ButtonGroup variant="contained" aria-label="split button">
                                                <MuiButton
                                                    size="small"
                                                    onClick={() => handleEdit(row)}
                                                    style={{ marginRight: '5px', backgroundColor: '#1976d2' }}
                                                >
                                                    <Edit fontSize="small" style={{ color: '#fff', marginRight: '5px' }} />
                                                    <span style={{ color: '#fff', fontSize: '12px' }}>Edit</span>
                                                </MuiButton>
                                                <MuiButton
                                                    size="small"
                                                    onClick={() => handleDelete(row)}
                                                    style={{ backgroundColor: '#d32f2f' }}
                                                >
                                                    <DeleteOutline fontSize="small" style={{ color: '#fff', marginRight: '5px' }} />
                                                    <span style={{ color: '#fff', fontSize: '12px' }}>Delete</span>
                                                </MuiButton>
                                            </ButtonGroup>
                                        </div>
                                    )
                                }
                            ]}
                            data={data}
                            isLoading={isLoading}
                            options={{
                                headerStyle: {
                                    backgroundColor: "#014d88",
                                    color: "#fff",
                                },
                                searchFieldStyle: {
                                    width: "200%",
                                    margingLeft: "250px",
                                },
                                filtering: false,
                                paging: true,
                                exportButton: false,
                                searchFieldAlignment: "left",
                                pageSizeOptions: [10, 20, 100],
                                pageSize: query?.pageSize || 10,
                                debounceInterval: 400,
                            }}
                            totalCount={data?.length}
                            onChangePage={(newPage) => {
                                setQueryParams((prevFilters) => ({ ...prevFilters, page: newPage }));
                                refetch(query);
                            }}
                            onSearchChange={(searchTerm) => {
                                setQueryParams((prevFilters) => ({ ...prevFilters, page: 0, pageSize: 10, search: searchTerm }));
                                refetch(query);
                            }}
                            onChangeRowsPerPage={(newPageSize) => {
                                setQueryParams((prevFilters) => ({
                                    ...prevFilters,
                                    pageSize: newPageSize,
                                }));
                                refetch(query);
                            }}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChartConfigPage;




const ChartConfigForm = React.forwardRef(({ handleSubmit, values, errors, touched, handleChange, handleBlur }, ref) => {
    const classes = useStyles();

    return (
        <Form id="editChartForm" onSubmit={handleSubmit} ref={ref}>
            <FormGroup>
                <Label for="indicatorName">Indicator Name</Label>
                <Input
                    type="text"
                    name="indicatorName"
                    id="indicatorName"
                    value={values.indicatorName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled
                    invalid={touched.indicatorName && !!errors.indicatorName}
                />
                <ErrorMessage name="indicatorName" component="div" className={classes.errorText} />
            </FormGroup>

            <FormGroup>
                <Label for="type">Type</Label>
                <Input
                    type="select"
                    name="type"
                    id="type"
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.type && !!errors.type}
                >
                    <option value="">Select Type</option>
                    <option value="pie">Pie Chart</option>
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                </Input>
                <ErrorMessage name="type" component="div" className={classes.errorText} />
            </FormGroup>

            <FormGroup>
                <Label for="description">Description</Label>
                <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.description && !!errors.description}
                    rows={3}
                />
                <ErrorMessage name="description" component="div" className={classes.errorText} />
            </FormGroup>

            <FormGroup>
                <Label for="displayName">Display Name</Label>
                <Input
                    type="text"
                    name="displayName"
                    id="displayName"
                    value={values.displayName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.displayName && !!errors.displayName}
                />
                <ErrorMessage name="displayName" component="div" className={classes.errorText} />
            </FormGroup>

            <FormGroup>
                <Label for="module">Module</Label>
                <Input
                    type="text"
                    name="module"
                    id="module"
                    value={values.module}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.module && !!errors.module}
                />
                <ErrorMessage name="module" component="div" className={classes.errorText} />
            </FormGroup>

            <FormGroup>
                <Label for="icon">Icon</Label>
                <Input
                    type="text"
                    name="icon"
                    id="icon"
                    value={values.icon}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.icon && !!errors.icon}
                />
                <ErrorMessage name="icon" component="div" className={classes.errorText} />
            </FormGroup>

            <FormGroup>
                <Label for="position">Position</Label>
                <Input
                    type="number"
                    name="position"
                    id="position"
                    value={values.position}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.position && !!errors.position}
                />
                <ErrorMessage name="position" component="div" className={classes.errorText} />
            </FormGroup>

            <FormGroup>
                <Label for="location">Location</Label>
                <Input
                    type="select"
                    name="location"
                    id="location"
                    value={values.location}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.location && !!errors.location}
                >
                    <option value="">Select Location</option>
                    <option value="core">Core</option>
                    <option value="dashboard">Dashboard</option>
                    <option value="reports">Reports</option>
                </Input>
                <ErrorMessage name="location" component="div" className={classes.errorText} />
            </FormGroup>
        </Form>
    );
});


const SubmitButton = ({ isLoading }) => {
    const { submitForm } = useFormikContext();

    return (
        <MuiButton
            onClick={submitForm}
            color="primary"
            variant="contained"
            disabled={isLoading}
        >
            {isLoading ? 'Updating...' : 'Save Changes'}
        </MuiButton>
    );
};