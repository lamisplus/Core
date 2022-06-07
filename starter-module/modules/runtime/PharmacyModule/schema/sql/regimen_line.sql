--
-- Data for Name: regimen_line; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.regimen_line (id, name, archived, created_by, date_created, date_modified, modified_by, code) OVERRIDING SYSTEM VALUE VALUES (1, 'ART First Line', 0, 'Alexander Alozie', '2021-03-05 00:00:00', '2021-03-05 00:00:00', 'Alexander Alozie', 'a6093325-2276-4c81-b79e-d3d79a536a15');
INSERT INTO public.regimen_line (id, name, archived, created_by, date_created, date_modified, modified_by, code) OVERRIDING SYSTEM VALUE VALUES (2, 'ART Second Line', 0, 'Alexander Alozie', '2021-03-05 00:00:00', '2021-03-05 00:00:00', 'Alexander Alozie', 'dac624ba-5a18-4c8f-9580-bdcbcb0c4b2f');
INSERT INTO public.regimen_line (id, name, archived, created_by, date_created, date_modified, modified_by, code) OVERRIDING SYSTEM VALUE VALUES (3, 'ART Third Line', 0, 'Alexander Alozie', '2021-03-05 00:00:00', '2021-03-05 00:00:00', 'Alexander Alozie', '7d84813e-11b1-4edf-9357-ddd5cbefdc75');
INSERT INTO public.regimen_line (id, name, archived, created_by, date_created, date_modified, modified_by, code) OVERRIDING SYSTEM VALUE VALUES (4, 'ARV Prophylaxis for Pregnant Women', 0, 'Alexander Alozie', '2021-03-05 00:00:00', '2021-03-05 00:00:00', 'Alexander Alozie', '12bf5c07-0a07-4cde-8fde-829ad9d5576d');
INSERT INTO public.regimen_line (id, name, archived, created_by, date_created, date_modified, modified_by, code) OVERRIDING SYSTEM VALUE VALUES (5, 'ARV Prophylaxis for Infants', 0, 'Alexander Alozie', '2021-03-05 00:00:00', '2021-03-05 00:00:00', 'Alexander Alozie', '09fb3d40-16e5-411e-b0c7-24b8f080d554');
INSERT INTO public.regimen_line (id, name, archived, created_by, date_created, date_modified, modified_by, code) OVERRIDING SYSTEM VALUE VALUES (6, 'Post Exposure Prophylaxis (PEP)', 0, 'Alexander Alozie', '2021-03-05 00:00:00', '2021-03-05 00:00:00', 'Alexander Alozie', '5e3e72bf-78e7-4b8d-84a2-a72ff25002ca');


--
-- Name: regimen_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

--SELECT pg_catalog.setval('public.regimen_line_id_seq', 7, false);

SELECT setval('regimen_line_id_seq', (7));

