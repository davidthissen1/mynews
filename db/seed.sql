-- Insert sample users
INSERT INTO users (username, email, password)
VALUES
('john_doe', 'john@example.com', 'hashedpassword123'),
('jane_doe', 'jane@example.com', 'hashedpassword456');

-- Insert sample preferences
INSERT INTO preferences (user_id, topic)
VALUES
(1, 'Technology'),
(1, 'Sports'),
(2, 'Health');

-- Insert sample articles
INSERT INTO articles (title, content, source, category, published_at, url)
VALUES
('AI Breakthrough!', 'Content about AI...', 'BBC', 'Technology', NOW(), 'https://bbc.com/ai'),
('Latest Sports News', 'Content about sports...', 'ESPN', 'Sports', NOW(), 'https://espn.com/sports');
