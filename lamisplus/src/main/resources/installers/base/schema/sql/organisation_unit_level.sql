--
-- Data for Name: organisation_unit_level; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO organisation_unit_level (id, name, description, archived, status, date_created, created_by, date_modified, modified_by) OVERRIDING SYSTEM VALUE VALUES (1, 'Country', 'National level', 0, 1, NULL, NULL, NULL, NULL);
INSERT INTO organisation_unit_level (id, name, description, archived, status, date_created, created_by, date_modified, modified_by) OVERRIDING SYSTEM VALUE VALUES (3, 'Province/LGA', 'Local government level', 0, 1, NULL, NULL, NULL, NULL);
INSERT INTO organisation_unit_level (id, name, description, archived, status, date_created, created_by, date_modified, modified_by) OVERRIDING SYSTEM VALUE VALUES (4, 'Facility', 'Facility level', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO organisation_unit_level (id, name, description, archived, status, date_created, created_by, date_modified, modified_by) OVERRIDING SYSTEM VALUE VALUES (5, 'Community Pharmacy', 'Community Pharmacy level', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO organisation_unit_level (id, name, description, archived, status, date_created, created_by, date_modified, modified_by) OVERRIDING SYSTEM VALUE VALUES (6, 'Laboratory', 'Laboratory level', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO organisation_unit_level (id, name, description, archived, status, date_created, created_by, date_modified, modified_by) OVERRIDING SYSTEM VALUE VALUES (7, 'PCR Laboratory', 'PCR Laboratory level', 0, 0, NULL, NULL, NULL, NULL);
INSERT INTO organisation_unit_level (id, name, description, archived, status, date_created, created_by, date_modified, modified_by) OVERRIDING SYSTEM VALUE VALUES (2, 'State', 'State level', 0, 1, NULL, NULL, NULL, NULL);

SELECT setval('organisation_unit_level_id_seq', (7));
