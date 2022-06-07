--
-- Data for Name: drug_group; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.drug_group (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (1, 'Antiretroviral Therapy', '62043383-2c74-45c3-b27f-c21fbebcc17c', '2021-03-05 00:00:00', 'Alexander Alozie', '2021-03-05 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.drug_group (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (2, 'Isoniazid Preventive Therapy (IPT)', '279cd2bd-1797-4453-a0da-3f025959830a', '2021-03-05 00:00:00', 'Alexander Alozie', '2021-03-05 00:00:00', 'Alexander Alozie', 0);
INSERT INTO public.drug_group (id, name, code, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (3, 'Other Medicines', '35d79c54-831f-4cb4-a832-66b9e57e0b67', '2021-03-05 00:00:00', 'Alexander Alozie', '2021-03-05 00:00:00', 'Alexander Alozie', 0);


--
-- Name: drug_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

--SELECT pg_catalog.setval('public.drug_group_id_seq', 4, false);

SELECT setval('drug_group_id_seq', (4));

