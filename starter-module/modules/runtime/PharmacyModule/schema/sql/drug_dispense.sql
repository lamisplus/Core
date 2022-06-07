INSERT INTO public.drug_dispense (id, drug_order_id, drug_name, uuid, date_time_dispensed, comment, brand, quantity, unit, dispensed_by, start_date, dosage_strength, dosage_strength_unit, dosage_frequency, archived, organisation_unit_id, patient_id, duration, duration_unit, type, created_by, date_created, modified_by, date_modified, other_details) OVERRIDING SYSTEM VALUE VALUES (1, 3, 'panadol', '506af83b-591c-4173-8e77-e4b22d263193', '2022-05-13 12:35:00', NULL, 'Orange panadol', 10, 'tablet', 'Emeka John', '2022-05-09', NULL, 'MM', 10, 0, NULL, 1, 10, 'days', 'drug', 'guest@lamisplus.org', '2022-05-13 09:41:40.008', 'guest@lamisplus.org', '2022-05-13 09:41:40.008', NULL);


--
-- Name: drug_dispense_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drug_dispense_id_seq', 1, false);