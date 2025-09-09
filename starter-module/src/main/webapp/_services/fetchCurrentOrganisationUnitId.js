import { authentication } from "./authentication";


export const fetchCurrentOrganisationUnitId = async () => {
    return await authentication.fetchCurrentOrganisationUnitId();
  };