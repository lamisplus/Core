import { lazy, Suspense } from "react";

/// Components
import Index from "./main/webapp/jsx";
import { connect, useDispatch } from "react-redux";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Policy from "./main/webapp/jsx/pages/Policy";
import "./main/webapp/vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./main/webapp/css/style.css";
import { BehaviorSubject } from "rxjs";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { queryClient } from "./main/webapp/_helpers/queryClient";

const currentUserSubject = new BehaviorSubject(
  JSON.parse(localStorage.getItem("currentUser"))
);

const Login = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./main/webapp/jsx/pages/LoginPage")), 500);
  });
});

function App(props) {
  const dispatch = useDispatch();

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
        <QueryClientProvider client={queryClient}>
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
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </>
    );
  } else {
    return (
      <div className="vh-100">
        <QueryClientProvider client={queryClient}>
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
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </div>
    );
  }
}

export default withRouter(connect(null)(App));
