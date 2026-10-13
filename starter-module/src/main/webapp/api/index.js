//Online Server
//export const url =  'http://www.lamisplus.org/base-module/api/';

//Local Server
// export const url = "http://localhost:9091/api/v1/";
// export const token =
// "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLEZhY2lsaXR5IEFkbWluLERhdGEgQ2xlcmssT25seUFkbWluUmVhZCxIYXNCb3RoQWRtaW5SZWFkQW5kV3JpdGUsVXNlcixSb2xlIFNhbXBsZSIsIm5hbWUiOiJHdWVzdCBHdWVzdCIsImV4cCI6MTc1NzUzNTAxNn0.1sQ7PSGOsXbF4J4V8lhhEcourhnYzTXilNDFGerKlb1hpR0X_SCqRL8hOyix0CeKBo3IL0sxcmk4L1L5sI_Q8Q";
export const url =
process.env.NODE_ENV === "development"
? "http://localhost:9091/api/v1/"
: "/api/v1/";

// export const token = new URLSearchParams(window.location.search).get("jwt");
// export const url = "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdCIsImF1dGgiOiJTdXBlciBBZG1pbixGYWNpbGl0eSBBZG1pbixEYXRhIENsZXJrLE9ubHlBZG1pblJlYWQsSGFzQm90aEFkbWluUmVhZEFuZFdyaXRlLFVzZXIsUm9sZSBTYW1wbGUsUkRFIiwiZXhwIjoxNzc5NDcyMDE2LCJuYW1lIjoiR3Vlc3QgR3Vlc3QifQ.5X3elPLyxJyMGCG8I-_CBgdd_N_R8ElAGRIDpV44M6Z5iazsGPh74EmTJImN-K6G8-0pDVf10hkfJSg1vMGuTg"
    : new URLSearchParams(window.location.search).get("jwt");