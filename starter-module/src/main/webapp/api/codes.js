/**
 * @CODES
 * ==============================================
 * PROGRAM CODES
 */

export const GENERAL_SERVICE = '25216afc-d158-4696-ada6-00df609b9a4c'
export const RETROSPECTIVE_SERVICE = 'eca42373-057d-4a18-be50-622ceba0d931'


/**
 * @CODES
 * ==============================================
 * FORM CODES
 */

export const VITAL_SIGNS_FORM = 'bc5d44b8-8ed1-4de0-85de-c3c6f2c91cd0'
export const DRUG_PRESCRIPTION_FORM = '4ab293ff-6837-41e8-aa85-14f25ce59ef0'
export const REGIMEN_PRESCRIPTION_FORM = 'e5b39440-13fc-4f61-82e9-c7bd74b44729'
export const LAB_TEST_ORDER_FORM = '87cb9bc7-ea0d-4c83-a70d-b57a5fb7769e'
export const LAB_SAMPLE_ORDER_FORM = '7f60f2b1-4d33-4f2c-b8d5-4b7e60b592c8'
export const CHECK_IN_FORM = '7f38c3e4-f765-4a9f-9a12-cbc1d26d9864'
export const CONSULTATION_FORM = 'd157d4e2-4031-499d-b32b-7562208a10cf'
export const PATIENT_REGISTRATION_FORM = 'bbc01821-ff3b-463d-842b-b90eab4bdacd'
export const ADMIT_PATIENT_FORM = 'f47b2db9-cf1b-4972-8c22-3f353b5fa222'
export const DISCHARGE_PATIENT_FORM = '8e07eb78-0449-42bd-bd21-9ef9b489ad7d'
export const TRANSFER_INPATIENT_FORM = '4c0db2ee-7916-4ea6-b24d-42234c8ac0a7'
export const CHECK_OUT_PATIENT_FORM = 'ec84dd9a-9493-4b73-b501-6201a06982a6'
export const PATIENT_ALLERGY_FORM = '796f2a0f-1e76-42af-a24a-e6f09dfedbe7'
export const APPOINTMENT_FORM = '22ec08bd-eeae-4f5e-9041-44461d511e90'
export const RADIOLOGY_TEST_ORDER = 'bdf039fb-06e8-4aec-bb28-20c09eb3651d'
export const ART_COMMENCEMENT_FORM = '0a8b31d2-9397-42f8-9300-688b62c75571'
export const LAB_SAMPLE_VERIFICATION_CODE_FORM = '8e3f8867-d5fc-4ddf-9972-004abed1960d'
export const LAB_SAMPLE_TRANSFER_CODE_FORM = 'cca9fb2e-9f1e-4836-b982-705378b7b55e'
export const LAB_SAMPLE_RESULT_CODE_FORM = '4fcabd08-5f7a-43fc-b246-da15e9a05f43'
export const LAB_SAMPLE_DISPATCHED_CODE_FORM = '58220e59-e468-4a4b-91f1-53341068f0a1'
export const PHARMARCY_DRUG_DISPENSE = '01a75846-83ed-4caa-9c78-136697742b72'
export const PHARMARCY_DRUG_DISPENSE_REGIMEN = 'c9b1b50f-6544-42b6-a868-91a5bf320671'
export const DATA_VISUALIZATION = '738ed64d-f96b-433f-a096-13896f7a3509'
export const BIOMETRICS_CAPTURE_FORM = 'e8a5260c-3f07-404e-a718-cd7f669c9aae'
/**
 * @CODES
 * ==============================================
 * TYPE PATIENT CODES
 */
export const IN_PATIENT_BOOKED = 3
export const IN_PATIENT_UNBOOKED = 2
export const OUT_PATIENT_BOOKED = 1
export const OUT_PATIENT_UNBOOKED = '0'
export const EMERGENCY_PATIENT = 4

/**
 * @CODES
 * ==============================================
 * LAB ORDER STATUS CODES
 */
export const LAB_ORDER_STATUS = [{name:"Sample Collected", id: 1},
{name:"Sample Transfer", id: 2},
{name:"Sample Verified", id: 3},
{name:"Sample Rejected", id: 4},
{name:"Result Available", id: 5},
{name:"Pending", id:0}];


export const DRUG_ORDER_STATUS = [{name:"Not Dispensed", id: 0},
{name:"Dispensed", id: 1}];

/**
 * @CODES
 * ==============================================
 * RADIOLOGY ORDER STATUS CODES
 */
export const RADIOLOGY_ORDER_STATUS = [{name:"Result Available", id: 1},
    {name:"Pending", id:0}];