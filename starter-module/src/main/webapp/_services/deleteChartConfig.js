import axios from "axios";
import { token, url } from "../api";

export const deleteChartConfig = async (indicatorName) => {
  const { data } = await axios.delete(
    `${url}charts/delete-chart`,
    {
      params: { indicatorName },
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};
