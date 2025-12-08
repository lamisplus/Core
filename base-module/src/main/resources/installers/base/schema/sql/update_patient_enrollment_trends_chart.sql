UPDATE chart set query = 'SELECT
               EXTRACT(YEAR FROM date_of_registration) AS year,
               SUM(CASE WHEN sex = ''Male'' THEN 1 ELSE 0 END) AS male,
               SUM(CASE WHEN sex = ''Female'' THEN 1 ELSE 0 END) AS female
            FROM patient_person
            WHERE facility_id=?facilityId AND archived = 0
            GROUP BY EXTRACT(YEAR FROM date_of_registration)
            ORDER BY year'
WHERE indicator_name = 'PATIENT_ENROLLMENT_TRENDS_BY_YEAR_AND_SEX';