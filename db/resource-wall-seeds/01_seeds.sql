INSERT INTO users (
name, email, password)
VALUES (
'Devin Sanders', 'tristanjacobs@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'Iva Harrison', 'allisonjackson@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'Lloyd Jefferson', 'asherpoole@gmx.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'Dale Coleman', 'michaelgray@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'Alejandro Osborne', 'ariaatkinson@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'Nell Medina', 'juliansantos@aol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'Estelle Walsh', 'elistanton@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'Herbert Graves', 'emilyowen@live.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'John Stevens', 'charliebattle@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
name, email, password)
VALUES (
'Isabelle Robbins', 'miasutton@aol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO categories (name)
VALUES ('Software Development');
INSERT INTO categories (name)
VALUES ('Business');
INSERT INTO categories (name)
VALUES ('Photography');
INSERT INTO categories (name)
VALUES ('Design');
INSERT INTO categories (name)
VALUES ('Science');

INSERT INTO resources (url, title, description, user_id, category_name)
VALUES ('https://business.tutsplus.com/tutorials/how-to-start-a-business--cms-25638', 'Awesome business tutorial!', 'All you need to know to start yout own company', 1, 'Business');
INSERT INTO resources (url, title, description, user_id, category_name)
VALUES ('https://www.khanacademy.org/science/high-school-physics', 'Physics 101', 'The best way to learn physics!', 1, 'Science');
INSERT INTO resources (url, title, description, user_id, category_name)
VALUES ('https://www.youtube.com/watch?v=BAiN4Wyf_KY', 'Photography for beginners', 'Best photography tutorial ever!', 1, 'Photography');
INSERT INTO resources (url, title, description, user_id, category_name)
VALUES ('https://www.freecodecamp.org/news/free-online-programming-cs-courses/', 'Software development tutorial', 'Well explain software development intro', 2, 'Software Development');
INSERT INTO resources (url, title, description, user_id, category_name)
VALUES ('https://www.youtube.com/channel/UCjOijmRbauDXxScMjvt0rCw', 'Design made easy', 'This tutorial got me into design', 2, 'Design');
