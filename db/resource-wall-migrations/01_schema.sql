DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);
CREATE TABLE categories (
<<<<<<< HEAD
  id SERIAL,
=======
  id SERIAL ,
>>>>>>> newresource-page
  name VARCHAR(255) PRIMARY KEY NOT NULL
);
