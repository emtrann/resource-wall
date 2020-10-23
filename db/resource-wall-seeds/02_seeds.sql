INSERT INTO comments (user_id, resource_id, message)
VALUES (1, 4, 'I really enjoyed this tutorial. Thank you for posting this');
INSERT INTO comments (user_id, resource_id, message)
VALUES (1, 5, 'This is one of the best design workshops I have ever seen. Thanks!');
INSERT INTO comments (user_id, resource_id, message)
VALUES (2, 2, 'What a great resource!');
INSERT INTO comments (user_id, resource_id, message)
VALUES (2, 3, 'I love photography. This tutorial has taught me so much');

INSERT INTO user_likes (user_id, resource_id)
VALUES (1, 4);
INSERT INTO user_likes (user_id, resource_id)
VALUES (1, 5);
INSERT INTO user_likes (user_id, resource_id)
VALUES (2, 2);
INSERT INTO user_likes (user_id, resource_id)
VALUES (2, 3);
