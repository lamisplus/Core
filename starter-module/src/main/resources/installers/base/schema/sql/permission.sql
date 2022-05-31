INSERT INTO permission (id, description, name, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (1, 'Admin Operations Delete', 'admin_delete', '2020-11-23 00:00:00', 'Emeka', '2020-11-23 00:00:00', 'Emeka', 0);
INSERT INTO permission (id, description, name, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (2, 'Admin Operations Read', 'admin_read', '2020-11-23 00:00:00', 'Emeka', '2020-11-23 00:00:00', 'Emeka', 0);
INSERT INTO permission (id, description, name, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (3, 'Admin Operations Write', 'admin_write', '2020-11-23 00:00:00', 'Emeka', '2020-11-23 00:00:00', 'Emeka', 0);
INSERT INTO permission (id, description, name, date_created, created_by, date_modified, modified_by, archived) OVERRIDING SYSTEM VALUE VALUES (4, 'All Permission', 'all_permission', '2020-11-23 00:00:00', 'Emeka', '2020-11-23 00:00:00', 'Emeka', 0);

SELECT pg_catalog.setval('permission_id_seq', 4, true);
