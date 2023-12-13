import React from "react";
import Container from "@mui/material/Container";

const Policy = () => {
  const styles = {
    main: {
      border: "1px solid rgb(1, 77, 136)",
    },
    h2: {
      textAlign: "center",
      color: "#fff",
      backgroundColor: "rgb(1, 77, 136)",
      margin: "20px",
      height: "50px",
      padding: "10px",
    },
    p: {
      textAlign: "center",
      fontSize: "16px",
    },
  };
  return (
    <div>
      <Container maxWidth="xl" style={styles.main}>
        <br />
        <h2 style={styles.h2}>Terms of Service</h2>
        <br />
        <p style={styles.p}>
          The LAMISPlus mobile and web app User Agreement comprises these Terms
          of Service, our Privacy Policy, and Rules.
        </p>
        <hr />
        <h3>1.1. THE LAMISPLUS MOBILE AND WEB APP TERMS OF SERVICE</h3>
        <p>
          This application is designed for medical record management and other
          related services. The Terms herein govern access to and use of the
          various features such as patient records, diagnostics, treatments, or
          other uploaded materials (otherwise known as content) on the LAMISPlus
          mobile and web applications.
        </p>
        <h3>1.2. BASIC TERMS</h3>
        <p>1. You are responsible for:</p>
        <ol>
          <li>a. the use of the features on the app</li>
          <li>b. Any data you volunteer and</li>
          <li>c. Any consequences thereof.</li>
        </ol>
        <p>
          2. The data you input or submit on the LAMISPlus app is securely
          stored and is accessible only to authorized personnel.
        </p>
        <p>
          3. You may use the services only in compliance with these terms and
          all applicable local, state, national, and international laws, rules,
          and regulations.
        </p>
        <p>
          4. To maintain and enhance our services, the LAMIS Plus app is subject
          to continuous updates and improvements. Hence, features may change
          occasionally without prior notice. We also reserve the right to
          install limits on storage space and use our sole discretion at any
          given time, without prior notice.
        </p>
        <h3>1.3. PRIVACY POLICY</h3>
        <p>
          Information provided on the LAMIS Plus app is governed by our
          principle on privacy, which oversees our use of your information. It
          dictates that your data is treated with the utmost confidentiality
          unless otherwise required by law.
        </p>
        <h3>1.4. PASSWORDS</h3>
        <p>
          You are responsible for safeguarding the password you set up. We
          cannot be held accountable for any damage or loss arising from your
          failure to maintain the confidentiality of your password.
        </p>
        <h3>1.5. CONTENT</h3>
        <p>
          While we aim to maintain data accuracy and security, we do not control
          every input. Hence, the authenticity and completeness of the data are
          the responsibility of the person who inputs or originates it.
        </p>
        <h3>1.6. RIGHTS</h3>
        <p>
          All rights, title, and interest in and to the app are and will remain
          the exclusive property of LAMISPlus. The services are protected by
          copyright in accordance with Nigerian laws.
        </p>
        <h3>1.7. INFORMATION COLLECTION AND USE</h3>
        <p>
          Your information is collected to offer tailored Services and improve
          available features over time. This information includes:
        </p>
        <ol>
          <li>
            a. Basic Account Details: When setting up an account, personal
            information such as name, profession, password, and email might be
            required.
          </li>
          <li>
            b. Contact Information: For communication, identification and
            verification purposes.
          </li>
          <li>
            c. Geo-location: The app captures geographical location data to
            provide location-specific services or recommendations. This data is
            handled with strict confidentiality and used solely for service
            enhancement.
          </li>
          <li>
            d. Confidential Information: Any patient or confidential data
            collected on the app is handled with the highest level of data
            protection and privacy standards.
          </li>
        </ol>
        <br />
        <h3>1.8. INFORMATION AND SHARING DISCLOSURE</h3>
        <p>
          Private personal information is not disclosed except when required by
          law or to address security or technical issues. With your explicit
          consent, we might share certain data for the purpose of improving our
          services.
        </p>
        <h3>1.9. USER AND SERVICE RESTRICTION</h3>
        <p>
          We retain the right to deactivate services and users based on rules
          violation or other criteria which would be communicated to the user.
        </p>
        <h3>1.10. LIMITATION OF LIABILITY</h3>
        <p>
          The LAMISPlus team strives for data accuracy and security but cannot
          guarantee 100% efficacy. Users are advised to verify critical
          information independently.
        </p>
        <h3>1.11. THE LAMISPLUS RULES</h3>
        <ol>
          <li>a. Uphold the confidentiality of patient and personal data.</li>
          <li>b. Abide by medical and data protection regulations.</li>
          <li>
            c. No sharing or distribution of information outside the platform
            and program intended.
          </li>
          <li>
            d. Do not use the platform for non-medical or unofficial purposes.
          </li>
        </ol>
        <br />
        <br />
      </Container>
    </div>
  );
};

export default Policy;
