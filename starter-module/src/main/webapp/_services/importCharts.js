import axios from "axios";
import { token, url } from "../api";
import { toast } from "react-toastify";

export const importCharts = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${url}charts/import-charts`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        toast.success("Chart configuration imported successfully");
        return response.data;
    } catch (error) {
        console.error("Failed to import chart:", error);
        const errorMessage = error.response?.data?.message || "Failed to import chart configuration";
        toast.error(errorMessage);
        throw error;
    }
};