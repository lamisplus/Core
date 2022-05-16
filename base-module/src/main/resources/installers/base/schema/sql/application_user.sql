INSERT INTO public.application_user (id, user_name, password, archived, activation_key, date_reset, reset_key, email, gender, phone_number, current_organisation_unit_id, first_name, last_name, created_by, date_created, modified_by, date_modified) OVERRIDING SYSTEM VALUE VALUES (1, 'guest@lamisplus.org', '$2b$10$bcg6DbcAP9W9PbjGbJnqVebza6610MGzk81FgBpSw0y6bUAcP/RA.', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Guest', 'Guest', NULL, NULL, NULL, NULL);

SELECT setval('application_user_id_seq', (1));
