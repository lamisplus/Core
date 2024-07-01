import { authentication } from '../../../_services/authentication';


export const RoleCheck = (role) => {
    const hasRole = authentication?.userHasRole([role]);
    return (hasRole !== null && hasRole !== undefined && hasRole !== "") 
        ? hasRole : false;
}