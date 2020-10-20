INSERT INTO users (
id, name, email, password)
VALUES (
1, 'Devin Sanders', 'tristanjacobs@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
id, name, email, password)
VALUES (
2, 'Iva Harrison', 'allisonjackson@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
id, name, email, password)
VALUES (
3, 'Lloyd Jefferson', 'asherpoole@gmx.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
id, name, email, password)
VALUES (
4, 'Dale Coleman', 'michaelgray@mail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
id, name, email, password)
VALUES (
5, 'Alejandro Osborne', 'ariaatkinson@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
id, name, email, password)
VALUES (
6, 'Nell Medina', 'juliansantos@aol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
id, name, email, password)
VALUES (
7, 'Estelle Walsh', 'elistanton@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
id, name, email, password)
VALUES (
8, 'Herbert Graves', 'emilyowen@live.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
id, name, email, password)
VALUES (
9, 'John Stevens', 'charliebattle@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');
INSERT INTO users (
id, name, email, password)
VALUES (
10, 'Isabelle Robbins', 'miasutton@aol.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO categories (id, name)
VALUES (1, 'Software Development');
INSERT INTO categories (id, name)
VALUES (2, 'Business');
INSERT INTO categories (id, name)
VALUES (3, 'Photography');
INSERT INTO categories (id, name)
VALUES (4, 'Design');
INSERT INTO categories (id, name)
VALUES (5, 'Science');

INSERT INTO resources (id, url, title, description, user_id, category_id)
VALUES (1, 'https://business.tutsplus.com/tutorials/how-to-start-a-business--cms-25638', 'Awesome business tutorial!', 'All you need to know to start yout own company', 1, 2);
INSERT INTO resources (id, url, title, description, user_id, category_id)
VALUES (2, 'https://www.khanacademy.org/science/high-school-physics', 'Physics 101', 'The best way to learn physics!', 1, 5);
INSERT INTO resources (id, url, title, description, user_id, category_id)
VALUES (3, 'https://www.youtube.com/watch?v=BAiN4Wyf_KY', 'Photography for beginners', 'Best photography tutorial ever!', 1, 3);
INSERT INTO resources (id, url, title, description, user_id, category_id)
VALUES (4, 'https://www.freecodecamp.org/news/free-online-programming-cs-courses/', 'Software development tutorial', 'Well explain software development intro', 2, 1);
INSERT INTO resources (id, url, title, description, user_id, category_id)
VALUES (5, 'https://www.youtube.com/channel/UCjOijmRbauDXxScMjvt0rCw', 'Design made easy', 'This tutorial got me into design', 2, 4);
