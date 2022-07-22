import React, { Fragment, useContext, useState } from "react";
/// React router dom
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../context/ThemeContext";
import logo from "../../../images/lamisPlus/lamislogo.png";

const NavHader = () => {
  const [toggle, setToggle] = useState(false);
  const {openMenuToggle} = useContext(
    ThemeContext
  );
  return (
  /*  <div className="nav-header" style={{ backgroundColor: '#f2f7f8',height:'65px' }}>*/
    <div className="nav-header" style={{ backgroundColor: '#fff',height:'65px', border:'solid 2px #ddd',marginRight:'1px' }}>
      <Link to="/dashboard" className="brand-logo" >
			<Fragment style={{padding:'5px'}}>
                <img src={logo} alt="" className="logo-abbr"  width="60" height="60"/>
                {"  "}
                <text style={{color:'#014d88'}}>{!toggle?'LAMISPlus':''}</text>
			</Fragment>
      </Link>

      <div
        className="nav-control"
        onClick={() => {
          setToggle(!toggle);
          openMenuToggle();
        }}
      >
        <div className={`hamburger ${toggle ? "is-active" : ""}`}>
          <span className="line" ></span>
          <span className="line" ></span>
          <span className="line"></span>
        </div>
      </div>
    </div>
  );
};

export default NavHader;
