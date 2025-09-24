import axios from "axios";
import { token, url } from "../api";



export const fetchIndicatorValues = async (indicator, currentOrganisationUnitId) => {
    const { data } = await axios.get(
        `${url}charts/dashboard/values?indicatorName=${indicator.indicatorName}&facilityId=${currentOrganisationUnitId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return data.value || null;
};