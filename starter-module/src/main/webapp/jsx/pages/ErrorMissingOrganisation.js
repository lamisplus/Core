import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { authentication } from "../../_services/authentication";

const ErrorMissingOrganisation = () => {
  /*   useEffect(()=>{

      },[]);*/
  const handleClick = () => {
    console.log("mew mew mew");
    authentication.logout();
  };
  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        {" "}
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-12">
            <div className="form-input-content text-center error-page">
              <p
                className="error-text font-weight-bold"
                style={{ fontSize: "70px" }}
              >
                Welcome To LAMISPlus 2.0
              </p>
              <h4 className="text-danger">
                <i className="fa fa-thumbs-down text-danger" /> Missing
                Organisation
              </h4>
              <p style={{ fontSize: "24px" }}>
                Kindly reach out to the system admin to assign you an
                organisation
              </p>
              <div className="btn">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: "#0E8A74" }}
                  onClick={handleClick}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMissingOrganisation;
