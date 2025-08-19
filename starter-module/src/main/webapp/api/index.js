//Online Server
//export const url =  'http://www.lamisplus.org/base-module/api/';

//Local Server
// export const url = "http://localhost:9091/api/v1/";
// export const token =
// "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBYmlvZHVuQFBldGVyIiwiYXV0aCI6IlN1cGVyIEFkbWluLE92ZXJhbGwgQWRtaW4iLCJuYW1lIjoiUGV0ZXIgQWJpb2R1biIsImV4cCI6MTc1MzgxMTAzM30.xDsYzdeuaq8UkdrWddQLowmH-SFcgRBJJlw-43o1LTXUkA7ttu5MPexIUd9Bj1zO1GtzDODHFMfqFwFsmxHhig";

export const token = new URLSearchParams(window.location.search).get("jwt");
export const url = "/api/v1/";
