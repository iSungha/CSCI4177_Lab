USE tenanttrails;

-- Show all of the apartments
SELECT *
FROM apartments;

-- Show specific columns
SELECT name, address, neighbourhood, built
FROM apartments;

-- Use WHERE: apartments in the South End
SELECT name, address, neighbourhood
FROM apartments
WHERE neighbourhood = 'South End';

-- Show WHERE with sorting
SELECT name, neighbourhood, built
FROM apartments
WHERE built >= 1980
ORDER BY built DESC;

-- Use JOIN: reviews with apartment names and users
SELECT
  a.name AS apartment_name,
  u.name AS reviewer,
  r.rating,
  r.body,
  r.created
FROM reviews r
JOIN apartments a ON r.apt_id = a.id
JOIN users u ON r.user_id = u.id
ORDER BY r.created DESC;

-- Use the LEFT JOIN: every apartment, including apartments with no reviews
SELECT
  a.name,
  COUNT(r.id) AS review_count,
  ROUND(AVG(r.rating), 1) AS average_rating
FROM apartments a
LEFT JOIN reviews r ON r.apt_id = a.id
GROUP BY a.id, a.name
ORDER BY average_rating DESC;

-- Use the JOIN comments to reviews and users
SELECT
  a.name AS apartment_name,
  r.id AS review_id,
  commenter.name AS commenter,
  c.body AS comment_body,
  c.created
FROM comments c
JOIN reviews r ON c.review_id = r.id
JOIN apartments a ON r.apt_id = a.id
JOIN users commenter ON c.user_id = commenter.id
ORDER BY c.created DESC;