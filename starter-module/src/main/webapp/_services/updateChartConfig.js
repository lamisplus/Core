import axios from "axios";
import { token, url } from "../api";

export const updateChartConfig = async (payload) => {
    const { data } = await axios.put(
        `${url}charts/update-chart?indicatorName=${payload?.indicatorName}`,
        {
            description: payload.description,
            displayName: payload.displayName,
            icon: payload.icon,
            location: payload.location,
            module: payload.module,
            position: payload.position,
            type: payload.type,
        },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return data;
};
