CREATE DATABASE IF NOT EXISTS tenanttrails;

USE tenanttrails;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS apartments;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  initials VARCHAR(10) NULL
);

CREATE TABLE apartments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address VARCHAR(255) NOT NULL,
  neighbourhood VARCHAR(150) NOT NULL,
  landlord VARCHAR(200) NOT NULL,
  units INT NOT NULL,
  built INT NOT NULL,
  image_url VARCHAR(500) NULL
);

CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  apt_id INT NOT NULL,
  user_id INT NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  created DATE NOT NULL,
  image_url VARCHAR(500) NULL,

  CONSTRAINT fk_reviews_apartment
    FOREIGN KEY (apt_id)
    REFERENCES apartments(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_reviews_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT chk_reviews_rating
    CHECK (rating BETWEEN 1 AND 5)
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  review_id INT NOT NULL,
  user_id INT NOT NULL,
  body TEXT NOT NULL,
  created DATE NOT NULL,

  CONSTRAINT fk_comments_review
    FOREIGN KEY (review_id)
    REFERENCES reviews(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

INSERT INTO apartments (
  id,
  name,
  address,
  neighbourhood,
  landlord,
  units,
  built,
  image_url
)
VALUES
(
  1,
  'The Marlstone',
  '5540 Spring Garden Rd',
  'Spring Garden',
  'Marlstone Residential',
  104,
  1998,
  'https://res.cloudinary.com/dxvfxbine/image/upload/v1782408338/tenanttrails/reviews/lbu8bmhcyyezsfthoabz.jpg'
),
(
  2,
  'Park Victoria',
  '1496 Carlton St',
  'South End',
  'Victoria Living',
  88,
  1985,
  'https://res.cloudinary.com/dxvfxbine/image/upload/v1782408360/tenanttrails/reviews/req2wdqltuuiz4of21qb.jpg'
),
(
  3,
  'Le Marchant Towers',
  '1585 Le Marchant St',
  'West End',
  'Killam Properties',
  88,
  1976,
  'https://res.cloudinary.com/dxvfxbine/image/upload/v1782408380/tenanttrails/reviews/yfwlgp94fedoda6rlwnt.jpg'
),
(
  4,
  'Fenwick Tower',
  '5599 Fenwick St',
  'Downtown',
  'Fenwick Holdings',
  140,
  1971,
  'https://res.cloudinary.com/dxvfxbine/image/upload/v1782408338/tenanttrails/reviews/lbu8bmhcyyezsfthoabz.jpg'
),
(
  5,
  'Southpoint Apartments',
  '1050 South Park St',
  'South End',
  'Southpoint Rentals',
  72,
  2004,
  'https://res.cloudinary.com/dxvfxbine/image/upload/v1782408360/tenanttrails/reviews/req2wdqltuuiz4of21qb.jpg'
);

SELECT *
FROM apartments;