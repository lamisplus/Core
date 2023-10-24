import { lazy, Suspense, useEffect, useState, useRef } from "react";
import moment from "moment";

/// Components
import Index from "./main/webapp/jsx";
import { connect, useDispatch } from "react-redux";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Policy from "./main/webapp/jsx/pages/Policy";
// action
/// Style
import "./main/webapp/vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./main/webapp/css/style.css";
import { BehaviorSubject } from "rxjs";

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser"))
);
//console.log(currentUserSubject)

const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./main/webapp/jsx/pages/LoginPage")), 500);
  });
});

function App(props) {
  const dispatch = useDispatch();
  //  const [events, setEvents] = useState(["click", "load", "scroll"]);
  //
  //  let timeStamp;
  //  let startTimerInterval = useRef();
  //  let warningInactiveInterval = useRef();
  //
  //  const timerCheck = () => {
  //    startTimerInterval.current = setTimeout(() => {
  //      timeStamp = sessionStorage.getItem("lastTimeStamp");
  //      logOff(timeStamp);
  //    }, 60000);
  //  };
  //
  //  const setTimestamp = () => {
  //    clearTimeout(startTimerInterval.current);
  //    clearInterval(warningInactiveInterval.current);
  //
  //    if (currentUserSubject._value !== null) {
  //      let currentTimestamp = moment();
  //      sessionStorage.setItem("lastTimeStamp", currentTimestamp);
  //      timerCheck();
  //    } else {
  //      clearInterval(warningInactiveInterval.current);
  //      sessionStorage.removeItem("lastTimeStamp");
  //    }
  //  };
  //
  //  const logOff = (timeString) => {
  //    clearTimeout(startTimerInterval.current);
  //
  //    warningInactiveInterval.current = setInterval(() => {
  //      const maxTime = 10;
  //
  //      const diff = moment.duration(moment().diff(moment(timeString)));
  //      const minPast = diff.minutes();
  //      const leftSecond = 60 - diff.seconds();
  //
  //      if (minPast === maxTime) {
  //        console.log("logout");
  //        clearInterval(warningInactiveInterval.current);
  //        sessionStorage.removeItem("lastTimeStamp");
  //        //localStorage.clear();
  //        //window.location.href = "/login";
  //      }
  //    }, 1000);
  //  };

  //  useEffect(() => {
  //    events.forEach((event) => {
  //      window.addEventListener(event, setTimestamp);
  //    });
  //
  //    timerCheck();
  //    return () => {
  //      clearTimeout(startTimerInterval.current);
  //    };
  //  }, [setTimestamp, events, timerCheck]);

  // useEffect(() => {
  //    // checkAutoLogin(dispatch, props.history);
  //    if (currentUserSubject._value!==null) {
  //         window.location.href = "/login";
  //    }
  // }, [currentUserSubject._value]);

  let routes = (
    <Switch>
      <Route path="/login" exact component={Login} />
      <Route path="/policy" component={Policy} />
      <Redirect from="/*" to="/login" />
    </Switch>
  );
  if (currentUserSubject._value !== null) {
    return (
      <>
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          <Index />
        </Suspense>
      </>
    );
  } else {
    return (
      <div className="vh-100">
        <Suspense
          fallback={
            <div id="preloader">
              <div className="sk-three-bounce">
                <div className="sk-child sk-bounce1"></div>
                <div className="sk-child sk-bounce2"></div>
                <div className="sk-child sk-bounce3"></div>
              </div>
            </div>
          }
        >
          {routes}
        </Suspense>
      </div>
    );
  }
}

export default withRouter(connect(null)(App));
