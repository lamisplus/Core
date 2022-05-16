INSERT INTO role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (1, 'Super Admin', '358939e0-bfe0-4fcb-a8a6-fe1320e77ffd', '2020-11-23 00:00:00', 'Emeka', '2020-11-23 00:00:00', 'Emeka', 0);
INSERT INTO role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (2, 'Facility Admin', '5e0df9cf-a212-4168-8a6b-dcdae4c47c9c', '2020-11-23 00:00:00', 'Emeka', '2020-11-23 00:00:00', 'Emeka', 0);
INSERT INTO role (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (3, 'Data Clerk', '20523411-3713-4cf2-a1e4-4238e693f884', '2020-11-23 00:00:00', 'Emeka', '2021-03-04 00:00:00', 'Emeka', 0);

SELECT pg_catalog.setval('role_id_seq', 3, true);
