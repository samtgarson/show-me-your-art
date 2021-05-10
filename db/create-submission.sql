drop function if exists create_submission;

create or replace function create_submission (
  longitude float,
  latitude float,
  print text,
  artist text,
  width int,
  height int,
  image_id string
)
	returns setof submissions
	language plpgsql
as $$
begin
	return query
  insert into submissions (geography, print, artist, width, height, image_id) values
    (ST_Point(longitude,latitude)::geography, print, artist, width, height, image_id)
    returning *;
end;
$$;
