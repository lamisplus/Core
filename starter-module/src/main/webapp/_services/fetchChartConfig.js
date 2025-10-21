import axios from "axios";
import { token, url } from "../api";

export const fetchChartConfig = async () => {
    const { data } = await axios.get(`${url}charts`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};