export const url =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8383/api/v1/"
        : "/api/v1/";

export const wsUrl =
    process.env.NODE_ENV === "development"
        ? "http://localhost:8383/websocket-chat"
        : "/websocket-chat";

export const token =
    process.env.NODE_ENV === "development"
        ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluLEZhY2lsaXR5IEFkbWluLERhdGEgQ2xlcmssT25seUFkbWluUmVhZCxIYXNCb3RoQWRtaW5SZWFkQW5kV3JpdGUsVXNlcixSb2xlIFNhbXBsZSIsIm5hbWUiOiJHdWVzdCBHdWVzdCIsImV4cCI6MTc1NzU1MTExM30.M-vFcVnwzrs-NdZ77slfFoR3OkiBKfMP026t07CU8E5Ioay6PAR8tT-XkzES6-00gJsjpvCiizLKFf8b_khN7A"
        : new URLSearchParams(window.location.search).get("jwt");