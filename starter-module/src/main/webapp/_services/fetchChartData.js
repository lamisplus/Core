import axios from "axios";
import { token, url } from "../api";

export const fetchChartData = async () => {
    const { data } = await axios.get(`${url}charts/indicators?location=core`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};