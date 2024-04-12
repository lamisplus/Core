//Online Server
//export const url =  'http://www.lamisplus.org/base-module/api/';

//Local Server
//export const url = "http://localhost:8383/api/v1/";

//export const token =
//  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzEyOTU3MzMwfQ.Dc_hmHHjyuPyMPGNJ7s3uh2jL1UBc-Vak6FIbNbBJ_NHMN4SEiLovtnN2AWS4Js2LWTfK2w_1-MdLWnuQzzslg";

export const token = new URLSearchParams(window.location.search).get("jwt");
export const url = "/api/v1/";
