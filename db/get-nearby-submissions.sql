drop function if exists get_nearby_submissions;
drop view if exists submissions_with_meta;

create or replace view submissions_with_meta as
  select
    *,
    json_build_object('latitude', ST_Y(geography::geometry), 'longitude', ST_X(geography::geometry)) as coordinates
  from submissions;

create or replace function get_nearby_submissions (
  longitude text,
  latitude text
)
	returns setof submissions_with_meta
	language plpgsql
as $$
begin
	return query
		select
			submissions_with_meta.*
		from
			submissions_with_meta
    where
      ST_DWithin(ST_GeographyFromText('POINT(' || longitude || ' ' || latitude ||')'), geography, 10000);
end;$$;


