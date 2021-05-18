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
	returns submissions
	language plpgsql
as $$
declare
  created_submission submissions%ROWTYPE;
begin
  insert into submissions (geography, artist, width, height, image_id, name, location, state) values
    (ST_Point(longitude,latitude)::geography, artist, width, height, image_id, name, location, 'pending')
    returning * into created_submission;

  perform http((
    'POST',
    'https://show-me-your-art.samgarson.com/api/{ sekret }/submission-notify',
    null,
    'application/json',
    row_to_json(created_submission) #>> '{}'
  )::http_request);

  return created_submission;
end;
$$;

