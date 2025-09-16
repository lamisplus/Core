import axios from "axios";
import { token, url } from "../api";
import { toast } from "react-toastify";

export const exportChart = async () => {
    try {
        const response = await axios.get(`${url}charts/export-charts`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
        });

        // Try to get filename from Content-Disposition header
        let filename = "Charts.json"; // Default filename
        const contentDisposition = response.headers['content-disposition'];
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
            }
        }

        const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        link.remove();
        window.URL.revokeObjectURL(fileUrl);
        
        // Show success message
        toast.success("Chart configuration exported successfully");
    } catch (error) {
        console.error("Failed to export chart:", error);
        toast.error("Failed to export chart configuration");
    }
};