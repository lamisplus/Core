--laboratory_order
CREATE SEQUENCE laboratory_order_id_seq;
CREATE TABLE public.laboratory_order
(
    id bigint NOT NULL DEFAULT nextval('laboratory_order_id_seq'),
    uuid character varying(100),
    patient_id integer,
	visit_id INTEGER,
	order_date date, 
	order_time TIME,
	userid character varying(100),
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.laboratory_order OWNER to postgres;
ALTER SEQUENCE laboratory_order_id_seq OWNED BY laboratory_order.id;


--laboratory_test
CREATE SEQUENCE laboratory_test_id_seq;
CREATE TABLE public.laboratory_test
(
    id bigint NOT NULL DEFAULT nextval('laboratory_test_id_seq'),
    uuid character varying(100),
	patient_id INTEGER,
	lab_test_id INTEGER,
    description character varying(300),
	lab_number character varying(300),
	lab_test_group_id INTEGER,
	order_priority INTEGER,
	unit_measurement character varying(300),
	lab_test_order_status INTEGER,
	viral_load_indication INTEGER,
	lab_order_id INTEGER,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.laboratory_test OWNER to postgres;
ALTER SEQUENCE laboratory_test_id_seq OWNED BY laboratory_test.id;


--laboratory_sample
CREATE SEQUENCE laboratory_sample_id_seq;
CREATE TABLE public.laboratory_sample
(
    id bigint NOT NULL DEFAULT nextval('laboratory_sample_id_seq'),
	sample_type_id INTEGER,
    uuid character varying(100),
    sample_order_date DATE,
	sample_order_time TIME,
    sample_collection_mode INTEGER,
    date_sample_collected DATE,
	time_sample_collected TIME,
    comment_sample_collected character varying(500),
    sample_collected_by character varying(100),
    date_sample_verified DATE,
	time_sample_verified TIME,
    comment_sample_verified character varying(500),
    sample_verified_by character varying(100),
	test_id INTEGER,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.laboratory_sample OWNER to postgres;
ALTER SEQUENCE laboratory_sample_id_seq OWNED BY laboratory_sample.id;


--laboratory_result
CREATE SEQUENCE laboratory_result_id_seq;
CREATE TABLE public.laboratory_result
(
    id bigint NOT NULL DEFAULT nextval('laboratory_result_id_seq'),
    uuid character varying(100),
    date_assayed DATE,
	time_assayed TIME,
    date_result_reported DATE,
	time_result_reported TIME,
    result_reported character varying(500),
    result_reported_by character varying(100),
	test_id INTEGER,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.laboratory_result OWNER to postgres;
ALTER SEQUENCE laboratory_result_id_seq OWNED BY laboratory_result.id;


--laboratory_labtest
CREATE SEQUENCE laboratory_labtest_id_seq;
CREATE TABLE public.laboratory_labtest
(
    id bigint NOT NULL DEFAULT nextval('laboratory_labtest_id_seq'),
    uuid character varying(100),
    lab_test_name character varying(500),
	unit character varying(500),
	labtestgroup_id INTEGER,
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.laboratory_labtest OWNER to postgres;
ALTER SEQUENCE laboratory_labtest_id_seq OWNED BY laboratory_labtest.id;


--laboratory_labtestgroup
CREATE SEQUENCE laboratory_labtestgroup_id_seq;
CREATE TABLE public.laboratory_labtestgroup
(
    id bigint NOT NULL DEFAULT nextval('laboratory_labtestgroup_id_seq'),
    uuid character varying(100),
    group_name character varying(500),
    PRIMARY KEY (id)
);
ALTER TABLE IF EXISTS public.laboratory_labtestgroup OWNER to postgres;
ALTER SEQUENCE laboratory_labtestgroup_id_seq OWNED BY laboratory_labtestgroup.id;