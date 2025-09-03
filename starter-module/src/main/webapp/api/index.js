//Online Server
//export const url =  'http://www.lamisplus.org/base-module/api/';

//Local Server
// export const url = "http://localhost:9091/api/v1/";
// export const token =
// "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLEZhY2lsaXR5IEFkbWluLERhdGEgQ2xlcmssT25seUFkbWluUmVhZCxIYXNCb3RoQWRtaW5SZWFkQW5kV3JpdGUsVXNlcixSb2xlIFNhbXBsZSIsIm5hbWUiOiJHdWVzdCBHdWVzdCIsImV4cCI6MTc1NDA3MTc1OX0.Sun2g1w3NtZZHiZitWdSlSs_6nAlvcxSvrVYL-PgMptmJhVCG9zA0OWNOrFiP-FDMCPkx8H9ZCMiUmITlgVq8w";

export const token = new URLSearchParams(window.location.search).get("jwt");
export const url = "/api/v1/";
