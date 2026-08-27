UPDATE public.chart SET query = 'WITH fy AS (
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
FROM hts_encounter he
JOIN hiv_art_clinical hac ON hac.person_uuid = he.patient_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = he.patient_uuid
JOIN fy ON TRUE
WHERE he.observation ->> ''finalHivTestResult'' = ''Positive''
  AND he.date_of_visit >= fy.start_date
  AND he.date_of_visit < fy.end_date
  AND he.facility_id = ?facilityId

UNION ALL
SELECT ''15-19'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 15 AND 19 THEN 1 ELSE 0 END), 0) AS count
FROM hts_encounter he
JOIN hiv_art_clinical hac ON hac.person_uuid = he.patient_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = he.patient_uuid
JOIN fy ON TRUE
WHERE he.observation ->> ''finalHivTestResult'' = ''Positive''
  AND he.date_of_visit >= fy.start_date
  AND he.date_of_visit < fy.end_date
  AND he.facility_id = ?facilityId


UNION ALL
SELECT ''20-24'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 20 AND 29 THEN 1 ELSE 0 END), 0) AS count
FROM hts_encounter he
JOIN hiv_art_clinical hac ON hac.person_uuid = he.patient_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = he.patient_uuid
JOIN fy ON TRUE
WHERE he.observation ->> ''finalHivTestResult'' = ''Positive''
  AND he.date_of_visit >= fy.start_date
  AND he.date_of_visit < fy.end_date
  AND he.facility_id = ?facilityId

  UNION ALL
SELECT ''25-29'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 25 AND 29 THEN 1 ELSE 0 END), 0) AS count
FROM hts_encounter he
JOIN hiv_art_clinical hac ON hac.person_uuid = he.patient_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = he.patient_uuid
JOIN fy ON TRUE
WHERE he.observation ->> ''finalHivTestResult'' = ''Positive''
  AND he.date_of_visit >= fy.start_date
  AND he.date_of_visit < fy.end_date
  AND he.facility_id = ?facilityId


  UNION ALL
SELECT ''30-34'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 30 AND 34 THEN 1 ELSE 0 END), 0) AS count
FROM hts_encounter he
JOIN hiv_art_clinical hac ON hac.person_uuid = he.patient_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = he.patient_uuid
JOIN fy ON TRUE
WHERE he.observation ->> ''finalHivTestResult'' = ''Positive''
  AND he.date_of_visit >= fy.start_date
  AND he.date_of_visit < fy.end_date
  AND he.facility_id = ?facilityId


  UNION ALL
SELECT ''35-39'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 35 AND 39 THEN 1 ELSE 0 END), 0) AS count
FROM hts_encounter he
JOIN hiv_art_clinical hac ON hac.person_uuid = he.patient_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = he.patient_uuid
JOIN fy ON TRUE
WHERE he.observation ->> ''finalHivTestResult'' = ''Positive''
  AND he.date_of_visit >= fy.start_date
  AND he.date_of_visit < fy.end_date
  AND he.facility_id = ?facilityId


  UNION ALL
SELECT ''40-44'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 40 AND 44 THEN 1 ELSE 0 END), 0) AS count
FROM hts_encounter he
JOIN hiv_art_clinical hac ON hac.person_uuid = he.patient_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = he.patient_uuid
JOIN fy ON TRUE
WHERE he.observation ->> ''finalHivTestResult'' = ''Positive''
  AND he.date_of_visit >= fy.start_date
  AND he.date_of_visit < fy.end_date
  AND he.facility_id = ?facilityId


  UNION ALL
SELECT ''45-49'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth)) BETWEEN 45 AND 49 THEN 1 ELSE 0 END), 0) AS count
FROM hts_encounter he
JOIN hiv_art_clinical hac ON hac.person_uuid = he.patient_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = he.patient_uuid
JOIN fy ON TRUE
WHERE he.observation ->> ''finalHivTestResult'' = ''Positive''
  AND he.date_of_visit >= fy.start_date
  AND he.date_of_visit < fy.end_date
  AND he.facility_id = ?facilityId



  UNION ALL
SELECT ''50+'' AS age_distribution,
       COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM AGE(NOW(), pp.date_of_birth))  >= 50 THEN 1 ELSE 0 END), 0) AS count
FROM hts_encounter he
JOIN hiv_art_clinical hac ON hac.person_uuid = he.patient_uuid AND hac.is_commencement IS TRUE
JOIN patient_person pp ON pp.uuid = he.patient_uuid
JOIN fy ON TRUE
WHERE he.observation ->> ''finalHivTestResult'' = ''Positive''
  AND he.date_of_visit >= fy.start_date
  AND he.date_of_visit < fy.end_date
  AND he.facility_id = ?facilityId' WHERE indicator_name = 'AGE_DISTRIBUTION_POSITIVE_ART';



UPDATE public.chart SET query = 'WITH fy AS (
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
           FROM hts_encounter, fy
           WHERE observation ->> ''finalHivTestResult'' IS NOT NULL
		     AND observation ->> ''finalHivTestResult'' != ''''
             AND date_of_visit >= fy.start_date
             AND date_of_visit < fy.end_date
             AND archived=false
             AND facility_id = ?facilityId' WHERE indicator_name = 'TOTAL_TESTED_FOR_HIV';



UPDATE public.chart SET query = 'WITH fy AS (
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
               COUNT(DISTINCT hc.patient_uuid) AS total_tested_positive
           FROM hts_encounter hc
           JOIN fy ON TRUE
           WHERE observation ->> ''finalHivTestResult'' = ''Positive''
             AND hc.date_Of_visit >= fy.start_date
             AND hc.date_Of_visit < fy.end_date
             AND hc.archived=false
             AND hc.facility_id =  ?facilityId' WHERE indicator_name = 'TOTAL_POSITIVE';




UPDATE public.chart SET query = 'SELECT COUNT(1) AS total_enrolled
           FROM patient_person p
           INNER JOIN hiv_enrollment_commencement he ON p.uuid=he.person_uuid
           WHERE he.archived = 0
             AND p.archived=0
             AND he.facility_id = ?facilityId' WHERE indicator_name = 'EVER_ENROLLED';