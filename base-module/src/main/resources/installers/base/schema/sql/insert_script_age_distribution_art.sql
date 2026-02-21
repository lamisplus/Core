INSERT INTO public.chart(
    id, indicator_name, display_name, description, location, position, type, icon, query, created_date, created_by, last_modified_date, last_modified_by, archived, x_axis_field, y_axis_field, series_name_field, module
) VALUES ('93ac4f85-2dce-498e-8536-1e5bf4d943b4', 'AGE_DISTRIBUTION_POSITIVE_ART', 'Age Distribution Positive On ART for a fiscal year', 'Age Distribution Positive On ART', 'core', 0,'column', 'fa-heartbeat',
          'WITH fy AS (
  SELECT
    CASE
      WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 10
        THEN MAKE_DATE(CAST(EXTRACT(YEAR FROM CURRENT_DATE) AS INTEGER), 10, 1)
      ELSE
        MAKE_DATE((CAST(EXTRACT(YEAR FROM CURRENT_DATE) AS INTEGER) - 1), 10, 1)
    END AS start_date,

    CASE
      WHEN EXTRACT(MONTH FROM CURRENT_DATE) >= 10
        THEN MAKE_DATE((CAST(EXTRACT(YEAR FROM CURRENT_DATE) AS INTEGER) + 1), 10, 1)
      ELSE
        MAKE_DATE(CAST(EXTRACT(YEAR FROM CURRENT_DATE) AS INTEGER), 10, 1)
    END AS end_date
)
SELECT ''0-14'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 0 AND 14 THEN 1 ELSE 0 END), 0) AS count
FROM hts_client hc
JOIN hiv_art_clinical hac ON hac.person_uuid = hc.person_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = hc.person_uuid
JOIN fy ON TRUE
WHERE hc.hiv_test_result = ''Positive''
  AND hc.date_visit >= fy.start_date
  AND hc.date_visit < fy.end_date
  AND hc.facility_id = ?facilityId

UNION ALL
SELECT ''15-19'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 15 AND 19 THEN 1 ELSE 0 END), 0) AS count
FROM hts_client hc
JOIN hiv_art_clinical hac ON hac.person_uuid = hc.person_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = hc.person_uuid
JOIN fy ON TRUE
WHERE hc.hiv_test_result = ''Positive''
  AND hc.date_visit >= fy.start_date
  AND hc.date_visit < fy.end_date
  AND hc.facility_id = ?facilityId


UNION ALL
SELECT ''20-24'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 20 AND 29 THEN 1 ELSE 0 END), 0) AS count
FROM hts_client hc
JOIN hiv_art_clinical hac ON hac.person_uuid = hc.person_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = hc.person_uuid
JOIN fy ON TRUE
WHERE hc.hiv_test_result = ''Positive''
  AND hc.date_visit >= fy.start_date
  AND hc.date_visit < fy.end_date
  AND hc.facility_id = ?facilityId

  UNION ALL
SELECT ''25-29'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 25 AND 29 THEN 1 ELSE 0 END), 0) AS count
FROM hts_client hc
JOIN hiv_art_clinical hac ON hac.person_uuid = hc.person_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = hc.person_uuid
JOIN fy ON TRUE
WHERE hc.hiv_test_result = ''Positive''
  AND hc.date_visit >= fy.start_date
  AND hc.date_visit < fy.end_date
  AND hc.facility_id = ?facilityId


  UNION ALL
SELECT ''30-34'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 30 AND 34 THEN 1 ELSE 0 END), 0) AS count
FROM hts_client hc
JOIN hiv_art_clinical hac ON hac.person_uuid = hc.person_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = hc.person_uuid
JOIN fy ON TRUE
WHERE hc.hiv_test_result = ''Positive''
  AND hc.date_visit >= fy.start_date
  AND hc.date_visit < fy.end_date
  AND hc.facility_id = ?facilityId


  UNION ALL
SELECT ''35-39'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 35 AND 39 THEN 1 ELSE 0 END), 0) AS count
FROM hts_client hc
JOIN hiv_art_clinical hac ON hac.person_uuid = hc.person_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = hc.person_uuid
JOIN fy ON TRUE
WHERE hc.hiv_test_result = ''Positive''
  AND hc.date_visit >= fy.start_date
  AND hc.date_visit < fy.end_date
  AND hc.facility_id = ?facilityId


  UNION ALL
SELECT ''40-44'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 40 AND 44 THEN 1 ELSE 0 END), 0) AS count
FROM hts_client hc
JOIN hiv_art_clinical hac ON hac.person_uuid = hc.person_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = hc.person_uuid
JOIN fy ON TRUE
WHERE hc.hiv_test_result = ''Positive''
  AND hc.date_visit >= fy.start_date
  AND hc.date_visit < fy.end_date
  AND hc.facility_id = ?facilityId


  UNION ALL
SELECT ''45- 49'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 45 AND 49 THEN 1 ELSE 0 END), 0) AS count
FROM hts_client hc
JOIN hiv_art_clinical hac ON hac.person_uuid = hc.person_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = hc.person_uuid
JOIN fy ON TRUE
WHERE hc.hiv_test_result = ''Positive''
  AND hc.date_visit >= fy.start_date
  AND hc.date_visit < fy.end_date
  AND hc.facility_id = ?facilityId



  UNION ALL
SELECT ''50+'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth))  >= 50 THEN 1 ELSE 0 END), 0) AS count
FROM hts_client hc
JOIN hiv_art_clinical hac ON hac.person_uuid = hc.person_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = hc.person_uuid
JOIN fy ON TRUE
WHERE hc.hiv_test_result = ''Positive''
  AND hc.date_visit >= fy.start_date
  AND hc.date_visit < fy.end_date
  AND hc.facility_id = ?facilityId', '2025-07-30 14:24:28.86492', 'Schema', '2025-07-30 14:24:28.86492', 'Schema', 0, 'age_distribution', 'count', null, 'HivModule');


