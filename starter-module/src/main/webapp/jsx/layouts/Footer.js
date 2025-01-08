 import React from "react";

const Footer = () => {
  var d = new Date();
  return (
    <div className="footer">
      <div className="copyright">
        <p>
          Copyright © LAMISPlus 2.2.2 &amp; Developed by{" "}
          <a href="" target="_blank" rel="noreferrer">
            Data.FI
          </a>{" "}
          {d.getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
