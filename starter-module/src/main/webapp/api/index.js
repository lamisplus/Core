//Online Server
//export const url =  'http://www.lamisplus.org/base-module/api/';

//Local Server
// export const url = "http://localhost:9091/api/v1/";
// // // export const url = "https://lamisplus-sync.org/api/v1/";
// export const token =
// "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBYmlvZHVuQFBldGVyIiwiYXV0aCI6IlN1cGVyIEFkbWluLE92ZXJhbGwgQWRtaW4iLCJuYW1lIjoiUGV0ZXIgQWJpb2R1biIsImV4cCI6MTcxNDY2NTgzM30.1sgfM91s1Zef3hQrrjLgQcyW7lkObfx4SiKz7SJARopFb_tvhG1oXnHxhBcXFZCkMHpsnlnYTVwWAql_UxxmTg";

export const token = new URLSearchParams(window.location.search).get("jwt");
export const url = "/api/v1/";
