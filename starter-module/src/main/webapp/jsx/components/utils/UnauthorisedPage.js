import { Typography } from "@material-ui/core";
import { MdErrorOutline } from "react-icons/md";

const Unauthorised = () => {
return (
    <div style={{padding:"20px", display: "flex", flexDirection:"column", width: "100%", height: "100%", justifyContent: "center", alignItems: "center"}}>
    <MdErrorOutline size={400} color="#b5b5b5" />
    <Typography style={{fontSize: "45px", fontWeight: 500, color: "#b5b5b5", maxWidth: "500px", textAlign: "center", whiteSpace: "pre-wrap"}}>
        403 Unauthorised
    </Typography>
    <Typography style={{fontSize: "18px", fontWeight: 500, color: "#b5b5b5", maxWidth: "500px", textAlign: "center", whiteSpace: "pre-wrap"}}>
        You do not have the right permissions to access this resource. Kindly contact your administrator.
    </Typography>
    </div>
)
}
export default Unauthorised;