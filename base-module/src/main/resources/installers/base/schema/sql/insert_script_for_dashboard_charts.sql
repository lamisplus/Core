-- Delete existing chart records to avoid conflicts
DELETE FROM public.chart
WHERE indicator_name IN (
                         'TOTAL_RECORDS',
                         'TOTAL_TESTED_FOR_HIV',
                         'TOTAL_POSITIVE',
                         'EVER_ENROLLED',
                         'PATIENT_ENROLLMENT_BY_SEX',
                         'PATIENT_ENROLLMENT_TRENDS_BY_YEAR_AND_SEX'
    );

-- 2 Insert updated chart definitions

-- Total Records
INSERT INTO public.chart(
    id, indicator_name, display_name, description, location, position, type, icon, query,
    created_date, created_by, last_modified_date, last_modified_by, archived,
    x_axis_field, y_axis_field, series_name_field, module
)
VALUES (
           '71f2ee2b-6299-41db-9bd0-bb60f1a1410b',
           'TOTAL_RECORDS',
           'Total Records',
           'Total Records',
           'core',
           0,
           'card',
           'fa-users',
           'SELECT COUNT(DISTINCT uuid) FROM patient_person WHERE facility_id=?facilityId AND archived=0',
           '2025-07-30 14:24:28.86492',
           'Schema',
           '2025-07-30 14:24:28.86492',
           'Schema',
           0,
           NULL, NULL, NULL,
           'PatientModule'
       );

-- Total Tested for HIV
INSERT INTO public.chart(
    id, indicator_name, display_name, description, location, position, type, icon, query,
    created_date, created_by, last_modified_date, last_modified_by, archived,
    x_axis_field, y_axis_field, series_name_field, module
)
VALUES (
           'bdd208a4-a646-486d-9898-c30cd7e907d2',
           'TOTAL_TESTED_FOR_HIV',
           'Total Tested For HIV',
           'Total Tested For HIV',
           'core',
           1,
           'card',
           'fa-user-md',
           'WITH fy AS (
             SELECT
               CASE
                 WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 10
                   THEN MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::int, 10, 1)
                 ELSE
                   MAKE_DATE((EXTRACT(YEAR FROM CURRENT_DATE)::int - 1), 10, 1)
               END AS start_date,

               CASE
                 WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 10
                   THEN MAKE_DATE((EXTRACT(YEAR FROM CURRENT_DATE)::int + 1), 10, 1)
                 ELSE
                   MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::int, 10, 1)
               END AS end_date
           )
           SELECT
               COUNT(*) AS total_persons_tested
           FROM hts_client, fy
           WHERE hiv_test_result IS NOT NULL
             AND date_visit >= fy.start_date
             AND date_visit < fy.end_date
             AND archived=0
             AND facility_id = ?facilityId',
           '2025-07-30 14:24:28.86492',
           'Schema',
           '2025-07-30 14:24:28.86492',
           'Schema',
           0,
           NULL, NULL, NULL,
           'HtsModule'
       );

-- Total HIV Positive
INSERT INTO public.chart(
    id, indicator_name, display_name, description, location, position, type, icon, query,
    created_date, created_by, last_modified_date, last_modified_by, archived,
    x_axis_field, y_axis_field, series_name_field, module
)
VALUES (
           'd43cffcf-8690-4b55-a7a4-d2c404fb0fe7',
           'TOTAL_POSITIVE',
           'Total HIV Positive',
           'Total Positive',
           'core',
           2,
           'card',
           'fa-plus-square',
           'WITH fy AS (
             SELECT
               CASE
                 WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 10
                   THEN MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::int, 10, 1)
                 ELSE
                   MAKE_DATE((EXTRACT(YEAR FROM CURRENT_DATE)::int - 1), 10, 1)
               END AS start_date,

               CASE
                 WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 10
                   THEN MAKE_DATE((EXTRACT(YEAR FROM CURRENT_DATE)::int + 1), 10, 1)
                 ELSE
                   MAKE_DATE(EXTRACT(YEAR FROM CURRENT_DATE)::int, 10, 1)
               END AS end_date
           )
           SELECT
               COUNT(DISTINCT hc.person_uuid) AS total_tested_positive
           FROM hts_client hc
           JOIN fy ON TRUE
           WHERE hc.hiv_test_result = ''Positive''
             AND hc.date_visit >= fy.start_date
             AND hc.date_visit < fy.end_date
             AND hc.archived=0
             AND hc.facility_id = ?facilityId',
           '2025-07-30 14:24:28.86492',
           'Schema',
           '2025-07-30 14:24:28.86492',
           'Schema',
           0,
           NULL, NULL, NULL,
           'HtsModule'
       );

-- Ever Enrolled
INSERT INTO public.chart(
    id, indicator_name, display_name, description, location, position, type, icon, query,
    created_date, created_by, last_modified_date, last_modified_by, archived,
    x_axis_field, y_axis_field, series_name_field, module
)
VALUES (
           'c1ecbdab-ef42-4435-af2a-5e16d283b097',
           'EVER_ENROLLED',
           'Ever Enrolled Into HIV',
           'Ever Enrolled',
           'core',
           3,
           'card',
           'fa-heartbeat',
           'SELECT
               COUNT(1) AS total_enrolled
           FROM patient_person p
           INNER JOIN hiv_enrollment he ON p.uuid=he.person_uuid
           WHERE he.archived = 0
             AND p.archived=0
             AND he.facility_id = ?facilityId',
           '2025-07-30 14:24:28.86492',
           'Schema',
           '2025-07-30 14:24:28.86492',
           'Schema',
           0,
           NULL, NULL, NULL,
           'HivModule'
       );

-- Patient Enrollment by Sex
INSERT INTO public.chart(
    id, indicator_name, display_name, description, location, position, type, icon, query,
    created_date, created_by, last_modified_date, last_modified_by, archived,
    x_axis_field, y_axis_field, series_name_field, module
)
VALUES (
           '94224e17-df1a-42a5-8d51-db9592a5a016',
           'PATIENT_ENROLLMENT_BY_SEX',
           'Patient Enrollment By Sex',
           'Patient Enrollment By Sex',
           'core',
           0,
           'pie',
           'fa-heartbeat',
           'SELECT
               CASE WHEN sex = ''Female'' THEN ''Female''
                    WHEN sex = ''Male'' THEN ''Male''
                    ELSE ''Others'' END AS name,
               COUNT(*) AS count
            FROM patient_person
            WHERE facility_id=?facilityId AND archived=0
            GROUP BY sex',
           '2025-07-30 14:24:28.86492',
           'Schema',
           '2025-07-30 14:24:28.86492',
           'Schema',
           0,
           'name', 'count', NULL,
           'PatientModule'
       );

-- Patient Enrollment Trends by Year and Sex
INSERT INTO public.chart(
    id, indicator_name, display_name, description, location, position, type, icon, query,
    created_date, created_by, last_modified_date, last_modified_by, archived,
    x_axis_field, y_axis_field, series_name_field, module
)
VALUES (
           'a835aec0-d41c-48d9-8ec8-382d051fa76d',
           'PATIENT_ENROLLMENT_TRENDS_BY_YEAR_AND_SEX',
           'Patient Enrollment Trends By Year and Sex',
           'Patient Enrollment Trends By Year and Sex',
           'core',
           0,
           'line',
           'fa-heartbeat',
           'SELECT
               EXTRACT(YEAR FROM date_of_registration) AS year,
               SUM(CASE WHEN sex = ''Male'' THEN 1 ELSE 0 END) AS male,
               SUM(CASE WHEN sex = ''Female'' THEN 1 ELSE 0 END) AS female
            FROM patient_person
            WHERE facility_id=1665 AND archived = 0
            GROUP BY EXTRACT(YEAR FROM date_of_registration)
            ORDER BY year',
           '2025-07-30 14:24:28.86492',
           'Schema',
           '2025-07-30 14:24:28.86492',
           'Schema',
           0,
           'year', NULL, NULL,
           'PatientModule'
       );
