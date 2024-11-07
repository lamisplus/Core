import { useEffect, useState } from "react";
import PageTitle from "./../../layouts/PageTitle";
import { systemSettingsHelper } from "../../../_services/SystemSettingsHelper";

const WebLog = () => {
    const [weblogUrl, setWeblogUrl] = useState("")
    const [loading, setLoading] = useState(true)
    const fetchedWeblogUrl = systemSettingsHelper.getSingleSystemSetting("weblog")

    useEffect(async ()=> {
        if (fetchedWeblogUrl !== null && fetchedWeblogUrl !== undefined && fetchedWeblogUrl !== "") {
          setWeblogUrl(fetchedWeblogUrl)
          setLoading(false)
        } else {
          await systemSettingsHelper.fetchAllSystemSettings()
          const newWeblogUrl = systemSettingsHelper.getSingleSystemSetting("weblog")
          setWeblogUrl(newWeblogUrl)
          setLoading(false)
        }
        setLoading(false)
      },[fetchedWeblogUrl])

    return (
        <div>
            <PageTitle activeMenu="Web Log" motherMenu="Administration" />
            <iframe
                // src="https://central-demo.lamisplus.org"
                src={weblogUrl}
                width="100%"
                height="700"
                allowfullscreen
                sandbox>
                <p>
                <a href="/en-US/docs/Glossary">
                    Fallback link for browsers that don't support iframes
                </a>
                </p>
            </iframe>

{/* <embed src="http://localhost:9091/login"
            width="100%"
            height="100%"
                   onLoad={"Loading please wait..."}
            onerror="alert('URL invalid !!');"
            /> */}
        </div>
    );
}
export default WebLog;