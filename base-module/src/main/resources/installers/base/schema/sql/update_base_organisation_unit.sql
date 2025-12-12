UPDATE public.base_organisation_unit bou
SET name = SPLIT_PART(bou.name, ' ', 1) || ' Community Center'
    FROM base_organisation_unit_identifier boui
WHERE bou.id = boui.organisation_unit_id AND boui.code = ANY (ARRAY['xCya42gPOnU','TCJpqmlk9sK', 'iPViA45Cl3G', 'E1PW0PYkvDx', 'f0J277xHATh', 'cmkm8UQpvWk', 'ANblU3SrJb0',
    'rAiIIiFFqMN', 'fVcjpsyeO4q', 'cYdxH1tF7Di', 'R3rzxyzlNgM']);

UPDATE public.base_organisation_unit bou SET name = 'Birnin Kebbi Community Center'
    FROM base_organisation_unit_identifier boui
WHERE bou.id = boui.organisation_unit_id AND boui.code = 'th3IMCg3lQ1';



UPDATE public.base_organisation_unit bou SET name = 'Jalingo Community Center'
    FROM base_organisation_unit_identifier boui
WHERE bou.id = boui.organisation_unit_id AND boui.code = 'cmkm8UQpvWk';