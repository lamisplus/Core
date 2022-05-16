// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import * as CODES from "api/codes";


// export const [showCurrentForm, setShowCurrentForm] = useState(false);
// export const [currentForm, setCurrentForm] = useState(false);

//  export const onSuccess = () => {
//     toast.success("Form saved successfully!", { appearance: "success" });
//     setShowCurrentForm(false);
//   };

//  export const onError = () => {
//     toast.error("Something went wrong, request failed.");
//     setShowCurrentForm(false);
//   };

  

//  export const editAppointment = (patientId, visitId, encounterId) => {
//     setCurrentForm({
//       code:CODES.APPOINTMENT_FORM,
//       programCode:CODES.GENERAL_SERVICE,
//       formName:"PATIENT APPOINTMENT",
//       patientId: patientId,
//       visitId: visitId,
//       type: 'EDIT',
//       options:{
//         modalSize: "modal-lg"
//       },
//   });
//   setShowCurrentForm(true);
// }

// export const viewAppointment = (patientId, visitId, encounterId) => {
//   setCurrentForm({
//     code:CODES.APPOINTMENT_FORM,
//     programCode:CODES.GENERAL_SERVICE,
//     formName:"PATIENT APPOINTMENT",
//     patientId: patientId,
//     visitId: visitId,
//     type: 'VIEW',
//     options:{
//       modalSize: "modal-lg"
//     },
// });
// setShowCurrentForm(true);
// }
