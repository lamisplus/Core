import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from 'react-router-dom';
import {Provider} from 'react-redux';
import store from './main/webapp/store';
import reportWebVitals from "./main/webapp/reportWebVitals";
import SimpleReactLightbox from "simple-react-lightbox";
import  ThemeContext  from "./main/webapp/context/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
	<React.StrictMode>
		<Provider store = {store}>
            <SimpleReactLightbox>
                <BrowserRouter basename='/'>
                    <ThemeContext>
                        <ToastContainer autoClose={3000} />
                        <App />
                    </ThemeContext>  
                </BrowserRouter>    
            </SimpleReactLightbox>
        </Provider>	
	</React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
