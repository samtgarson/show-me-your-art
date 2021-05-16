drop function if exists create_submission;

create or replace function create_submission (
  longitude float,
  latitude float,
  artist text,
  width int,
  height int,
  image_id text,
  name text,
  location text
)
	returns setof submissions
	language plpgsql
as $$
begin
	return query
  insert into submissions (geography, artist, width, height, image_id, name, location, state) values
    (ST_Point(longitude,latitude)::geography, artist, width, height, image_id, name, location, 'pending')
    returning *;
end;
$$;
