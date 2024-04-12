import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
// import { connect, useDispatch } from 'react-redux';
import { Alert, Button } from "react-bootstrap";

import logo from "../../images/lamisPlus/logo_200.png";
import { authentication } from "../../_services/authentication";

function Register(props) {
  /* Code from LamisPlus */
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState("");
  const [submitText, setSubmittext] = useState("Sign In");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [helperText, setHelperText] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (username.trim() && password.trim()) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [username, password]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsButtonDisabled(true);
    setSubmittext("Login Please wait...");
    setIsButtonDisabled(true);
    authentication.login(username, password, remember).then(
      (user) => {
        setError(false);
        setHelperText("Login Successfully");
        history.push("/dashboard", { user: user });
        window.location.href = "/dashboard";
      },
      (error) => {
        setIsButtonDisabled(false);
        setSubmittext("Sign In");
        setError(true);
        setHelperText("Incorrect username or password");
      }
    );
  };
  var d = new Date();
  const handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      isButtonDisabled || handleLogin();
    }
  };
  /* Endof the code */

  let errorsObj = { email: "", password: "" };
  const [errors, setErrors] = useState(errorsObj);

  return (
    <div className="authincation h-100 p-meddle">
      <div className="container h-100">
        <div className="row justify-content-center h-100 align-items-center">
          <div className="col-md-6">
            <div className="authincation-content">
              <div className="row no-gutters">
                <div className="col-xl-12">
                  <div className="auth-form">
                    <div className="text-center mb-3">
                      <Link to="/login">
                        <img src={logo} alt="" />
                      </Link>
                    </div>
                    <h4 className="text-center mb-4 ">
                      Login into your account
                    </h4>
                    {helperText !== "" ? (
                      <Alert variant="danger">
                        Incorrect Username /Password
                      </Alert>
                    ) : (
                      " "
                    )}

                    {props.errorMessage && (
                      <div className="">{props.errorMessage}</div>
                    )}
                    {props.successMessage && (
                      <div className="">{props.successMessage}</div>
                    )}
                    <form onSubmit={handleLogin}>
                      <div className="form-group mb-3">
                        <label className="mb-1 ">
                          <strong>Email/Username</strong>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={username}
                          //onChange={(e) => setEmail(e.target.value)}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                          name="email"
                          onChange={(e) => setUsername(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e)}
                        />
                        {errors.email && (
                          <div className="text-danger fs-12">
                            {errors.email}
                          </div>
                        )}
                      </div>
                      <div className="form-group mb-3">
                        <label className="mb-1 ">
                          <strong>Password</strong>
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          // onChange={(e) =>
                          //     setPassword(e.target.value)
                          // }
                          // helperText={helperText}
                          style={{
                            border: "1px solid #014D88",
                            borderRadius: "0.2rem",
                          }}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e)}
                        />
                        {errors.password && (
                          <div className="text-danger fs-12">
                            {errors.password}
                          </div>
                        )}
                      </div>

                      <div className="text-center mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary btn-block"
                          style={{
                            backgroundColor: "#0D3068",
                            borderRadius: "0.2rem",
                          }}
                          onClick={(e) => handleLogin(e)}
                          disabled={isButtonDisabled}
                        >
                          {submitText}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className=" col-sm-4"></div>
            <div className=" ml-10 col-sm-6">
              <p>
                Copyright © LAMISPlus 2.1.0 |{" "}
                <Link to="/policy">
                  <b>Terms & Policy</b>
                </Link>{" "}
                |{" "}
                <a href="https://hiscop.org/">
                  <b>Resources</b>
                </a>
                {/* {d.getFullYear()} */}
              </p>
            </div>
            <div className=" col-sm-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
