-- DROP TABLE IF EXISTS friendships;

-- DROP TABLE IF EXISTS password_reset_codes;

-- DROP TABLE IF EXISTS public_chat_messages;

-- DROP TABLE IF EXISTS users;

-- DROP TABLE IF EXISTS quotes;

CREATE TABLE users (
    id                      SERIAL primary key,
    first_name              VARCHAR(100) NOT NULL,
    last_name               VARCHAR(100) NOT NULL,
    email                   VARCHAR(100) NOT NULL UNIQUE,
    hash_password           VARCHAR NOT NULL,
    profile_picture_url     TEXT, 
    bio                     TEXT,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
  id                  SERIAL PRIMARY KEY,
  user_id             INT REFERENCES users (id) NOT NULL,
  bio                 TEXT,
  boy                 INT, 
  girl                INT, 
  on_the_way          INT, 
  from_country        TEXT,
  live_city           TEXT,
  live_state          TEXT,
  created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE password_reset_codes (
    id              SERIAL PRIMARY KEY,
    user_id         INT REFERENCES users (id) NOT NULL,
    code            VARCHAR(6) NOT NULL,
    email           VARCHAR(50) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships(
  id                SERIAL PRIMARY KEY,
  sender_id         INT REFERENCES users(id) NOT NULL,
  recipient_id      INT REFERENCES users(id) NOT NULL,
  accepted          BOOLEAN DEFAULT false,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public_chat_messages (
    id              SERIAL PRIMARY KEY,
    sender_id       INT REFERENCES users(id) NOT NULL,
    text            TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE private_chat_messages (
    id              SERIAL PRIMARY KEY,
    sender_id       INT REFERENCES users(id) NOT NULL,
     recipient_id       INT REFERENCES users(id) NOT NULL,
    text            TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE germany_cities (
  id    SERIAL PRIMARY KEY,
  city  TEXT NOT NULL,
  state TEXT NOT NULL
);

CREATE TABLE countries (
  id    SERIAL PRIMARY KEY,
  country  TEXT NOT NULL
);

CREATE TABLE quotes(
  id             SERIAL PRIMARY KEY,
  quotes         TEXT NOT NULL
);

-- INSERT INTO quotes (quotes) VALUES ('As a mama, I''m not perfect. I make mistakes. I forget things. I lose my cool. And some days I go a little crazy. But, it''s okay because in the end, no one could ever love my child the way I do.');
-- INSERT INTO quotes (quotes) VALUES ('It is ok to have strengths and weaknesses as a mama. Some mamas play games, others listen well, some cook with love, and others are great encouragers. We don''t have to be everything, every day to our kids. We just need to show up and love them hard.');
-- INSERT INTO quotes (quotes) VALUES ( 'If you''re worried about being a good mother, it means you already are one.');
-- INSERT INTO quotes (quotes) VALUES ('Becoming a mother doesn''t change you, it makes you realize the little people you created deserve the very best of you.' );
-- INSERT INTO quotes (quotes) VALUES ('There is no one size fits all when it comes to being a mom and raising a child. So, let''s all just do our best and support each other through it.' );
-- INSERT INTO quotes (quotes) VALUES ('Mama, you are doing better than you think you are. Believe in yourself.' );
-- INSERT INTO quotes (quotes) VALUES ('"There is no way to be a perfect mother, but a million ways to be a good one." – Jill Churchill' );
-- INSERT INTO quotes (quotes) VALUES ('Mama, you are enough. You are so much more than enough.' );
-- INSERT INTO quotes (quotes) VALUES ('Being a mom is the best reason you''ll ever have to take care of you.' );
-- INSERT INTO quotes (quotes) VALUES ('Mama, you are exactly what your child needs. Don''t ever doubt that, not even for a second.' );
-- INSERT INTO quotes (quotes) VALUES ('Bad moments don''t make bad moms.'' – Lisa Terkeurst');
-- INSERT INTO quotes (quotes) VALUES ('You can still be a mess and a good mom. You are allowed to be both.' );
-- INSERT INTO quotes (quotes) VALUES ('"Finding balance as a mother means accepting your imperfections." – Mary Organizes' );
-- INSERT INTO quotes (quotes) VALUES ('Behind every great child is a mom pretty sure she is screwing it up.' );
-- INSERT INTO quotes (quotes) VALUES ('"All great changes are preceded by chaos."– Deepak Chopra' );
-- INSERT INTO quotes (quotes) VALUES ('The world is too big to stay in one place and life is too short to do just one thing.' );
-- INSERT INTO quotes (quotes) VALUES ('"Everyone smiles in the same language." – George Carlin');
-- INSERT INTO quotes (quotes) VALUES ('"Our homes are not defined by geography or one particular location, but by memories, events, people, and places that span the globe." – Marilyn Gardner');
-- INSERT INTO quotes (quotes) VALUES ('"So, here you are. Too foreign for home, too foreign for here. Never enough for both." – Ijeoma Umebinyuo');
-- INSERT INTO quotes (quotes) VALUES ('"It is a bitter-sweet thing, knowing two cultures. Once you leave your birthplace nothing is ever the same." – Sarah Turnbull');