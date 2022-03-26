CREATE TABLE users (
  user_id bigserial NOT NULL PRIMARY KEY,
  username character varying(128) UNIQUE NOT NULL,
  password character varying(256) NOT NULL,
  email character varying(128) NOT NULL,
  enabled BOOL,
  secure BOOL,
  moderator BOOL) WITH (OIDS=FALSE);

ALTER TABLE users OWNER TO postgres;

CREATE TABLE posts (
  id bigserial NOT NULL PRIMARY KEY,
  username character varying(128) NOT NULL,
  picture_url character varying(128),
  text character varying(4096),
  likes_n BIGINT,
  saves_n BIGINT,
  post_time BIGINT,
  original_playlist_id bigserial,
  red REAL,
  green REAL,
  blue REAL,
  comments_n INT
);

ALTER TABLE posts OWNER TO postgres;

CREATE TABLE songs (
  id bigserial NOT NULL PRIMARY KEY,
  store_id character varying(64) NOT NULL,
  song_id character varying(64) NOT NULL,
  author character varying(256),
  name character varying(256),
  album character varying(256),
  year character varying(16)
);

ALTER TABLE songs OWNER TO postgres;

CREATE TABLE playlists (
  id bigserial NOT NULL PRIMARY KEY,
  post_id bigint NOT NULL,
  store_id character varying(64) NOT NULL,
  song_ids bigint[]
);

ALTER TABLE playlists OWNER TO postgres;

CREATE TABLE songconnections (
  id bigserial NOT NULL PRIMARY KEY,
  from_id bigserial NOT NULL,
  from_store_id character varying(64) NOT NULL,
  to_id bigserial NOT NULL,
  to_store_id character varying(64) NOT NULL
);

ALTER TABLE songconnections OWNER TO postgres;

CREATE TABLE playlistconnections (
  id bigserial NOT NULL PRIMARY KEY,
  from_id bigserial NOT NULL,
  from_store_id character varying(64) NOT NULL,
  to_id bigserial NOT NULL,
  to_store_id character varying(64) NOT NULL
);

ALTER TABLE playlistconnections OWNER TO postgres;

CREATE TABLE follows (
  id bigserial NOT NULL PRIMARY KEY,
  follower_name character varying(128) NOT NULL,
  followed_name character varying(128) NOT NULL
);

ALTER TABLE follows OWNER TO postgres;

CREATE TABLE usersdetails (
  username character varying(128) NOT NULL PRIMARY KEY,
  description character varying(512),
  followers_n BIGINT,
  following_n BIGINT
);

ALTER TABLE usersdetails OWNER TO postgres;

CREATE TABLE likes (
  id bigserial NOT NULL PRIMARY KEY,
  username character varying(128) NOT NULL,
  post_id bigserial NOT NULL
);

ALTER TABLE likes OWNER TO postgres;

CREATE TABLE saves (
  id bigserial NOT NULL PRIMARY KEY,
  username character varying(128) NOT NULL,
  post_id bigserial NOT NULL
);

ALTER TABLE saves OWNER TO postgres;



INSERT INTO users (username, password, email, enabled, secure, moderator) VALUES
  ('peter', '$2a$10$D4OLKI6yy68crm.3imC9X.P2xqKHs5TloWUcr6z5XdOqnTrAK84ri', 'peter@example.com', true, false, false),
  ('john', '$2a$10$D4OLKI6yy68crm.3imC9X.P2xqKHs5TloWUcr6z5XdOqnTrAK84ri', 'john@example.com', true, false, false),
  ('katie', '$2a$10$D4OLKI6yy68crm.3imC9X.P2xqKHs5TloWUcr6z5XdOqnTrAK84ri', 'katie@example.com', true, false, false);