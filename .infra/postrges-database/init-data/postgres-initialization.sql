-- CREATE ROLE "user" LOGIN PASSWORD 'password';

CREATE DATABASE "demo-db"
    WITH
    OWNER = "user"
    ENCODING = "UTF8"
    CONNECTION LIMIT = -1;

GRANT ALL PRIVILEGES ON DATABASE "demo-db" TO "user";

