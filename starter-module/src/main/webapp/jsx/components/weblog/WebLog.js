import PageTitle from "./../../layouts/PageTitle";

const WebLog = () => {
    return (
        <div>
            <PageTitle activeMenu="Web Log" motherMenu="Administration" />
            <iframe
                src="https://central-demo.lamisplus.org"
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