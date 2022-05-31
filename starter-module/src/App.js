import { lazy, Suspense, useEffect } from 'react';

/// Components
import Index from "./main/webapp/jsx";
import { connect, useDispatch } from 'react-redux';
import {  Route, Switch, withRouter } from 'react-router-dom';
// action
/// Style
import "./main/webapp/vendor/bootstrap-select/dist/css/bootstrap-select.min.css";
import "./main/webapp/css/style.css";
import { BehaviorSubject } from 'rxjs';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
//console.log(currentUserSubject)

const Login = lazy(() => {
    return new Promise(resolve => {
    setTimeout(() => resolve(import('./main/webapp/jsx/pages/LoginPage')), 500);
  });
});

function App (props) {
   
    const dispatch = useDispatch();
    // useEffect(() => {
    //    // checkAutoLogin(dispatch, props.history);
    //    if (currentUserSubject._value!==null) {
    //         window.location.href = "/login";
    //    }
    // }, [currentUserSubject._value]); 
    
    let routes = (  
        <Switch>
            <Route path='/login' exact component={Login} />

        </Switch>
    );
    if (currentUserSubject._value!==null) {
		return (
			<>
                <Suspense fallback={
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
	
	}else{
		return (
			<div className="vh-100">
                <Suspense fallback={
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
};



export default withRouter(connect(null)(App)); 

