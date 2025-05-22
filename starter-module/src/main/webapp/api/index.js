//Online Server
//export const url =  'http://www.lamisplus.org/base-module/api/';

//Local Server
//export const url = "http://localhost:8383/api/v1/";
//export const token =
// "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzEzMjM1ODU2fQ.Wih2d5SI7SxoflK9ikavrM7pZt0M3wGiDZM5P7sNE2V5B6M_1vITxdjhtdSOS9OMWjl0-_aCOLFRGvK_if8zkQ";

export const token = new URLSearchParams(window.location.search).get("jwt");
export const url = "/api/v1/";
