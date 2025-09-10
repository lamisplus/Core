export const url =
process.env.NODE_ENV === "development"
? "http://localhost:9090/api/v1/"
: "/api/v1/";

export const token =
  process.env.NODE_ENV === "development"
    ? "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJndWVzdEBsYW1pc3BsdXMub3JnIiwiYXV0aCI6IlN1cGVyIEFkbWluIiwibmFtZSI6Ikd1ZXN0IEd1ZXN0IiwiZXhwIjoxNzU3NDU0Nzc4fQ.N8Gvfqc6CjWRsir-1qTq3h4a-_9gY7BZF1TFALseAZcvav_TOcntpU6gVExnCrjQjPoo2eup-3NjBH-G7zW-YQ"
    : new URLSearchParams(window.location.search).get("jwt");