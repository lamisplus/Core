//Online Server
//export const url =  'http://www.lamisplus.org/base-module/api/';

//Local Server
//export const url = "http://localhost:8383/api/v1/";
//export const token =
//  "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzEzMjIwNTU2fQ.11E-CsXIe1aKwDM2h8lsZjHojqxeBf7cte2GAXo_R7Sger54Iw6rTnBeCmabn4_SGtL9VtuCYxEvpJSUGYzTzA";

export const token = new URLSearchParams(window.location.search).get("jwt");
export const url = "/api/v1/";
