export const url =
process.env.NODE_ENV === "development"
? "http://localhost:9090/api/v1/"
: "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzU3MzczMTY0fQ.s64Mt78dYZgLyHWn2iOFsaq_wgnAvna2cVHT-np1eYvL-l0Gn5ER279nsnhyn0ObLCC2KQpjqz1EKb4W1kNATg"
    : new URLSearchParams(window.location.search).get("jwt");