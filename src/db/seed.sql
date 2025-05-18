-- Reset user ID sequence
ALTER SEQUENCE users_id_seq RESTART WITH 3;
-- Reset recipe ID sequence
ALTER SEQUENCE recipes_id_seq RESTART WITH 4;

-- Insert test users
INSERT INTO users (id, username, email, password, created_at, updated_at) VALUES
(1, 'john_doe', 'john@example.com', '$2b$10$kz.WznMux4m8bVAJtXAZk.XyqnHaBCw6drzFhdm3PLDUptiiBnoji', NOW(), NOW()),
(2, 'jane_smith', 'jane@example.com', '$2b$10$kz.WznMux4m8bVAJtXAZk.XyqnHaBCw6drzFhdm3PLDUptiiBnoji', NOW(), NOW());

-- Insert test recipes
INSERT INTO recipes (id, title, description, instructions, cooking_time, servings, difficulty, user_id, created_at, updated_at) VALUES
(1, 'Classic Margherita Pizza', 'A simple and delicious pizza with fresh ingredients', '1. Preheat oven to 450°F\n2. Roll out pizza dough\n3. Add tomato sauce\n4. Add fresh mozzarella\n5. Add basil leaves\n6. Bake for 12-15 minutes', 30, 4, 'easy', 1, NOW(), NOW()),
(2, 'Chocolate Chip Cookies', 'Classic homemade chocolate chip cookies', '1. Preheat oven to 350°F\n2. Mix butter and sugar\n3. Add eggs and vanilla\n4. Mix in dry ingredients\n5. Add chocolate chips\n6. Bake for 10-12 minutes', 45, 24, 'easy', 1, NOW(), NOW()),
(3, 'Chicken Curry', 'Spicy Indian-style chicken curry', '1. Cook onions and spices\n2. Add chicken and cook\n3. Add coconut milk\n4. Simmer for 20 minutes\n5. Add fresh cilantro', 60, 6, 'medium', 2, NOW(), NOW());

-- Insert test ingredients
INSERT INTO ingredients (name, amount, unit, recipe_id, created_at, updated_at) VALUES
-- Margherita Pizza ingredients
('Pizza dough', 1, 'piece', 1, NOW(), NOW()),
('Tomato sauce', 0.5, 'cup', 1, NOW(), NOW()),
('Fresh mozzarella', 200, 'grams', 1, NOW(), NOW()),
('Fresh basil', 10, 'leaves', 1, NOW(), NOW()),

-- Chocolate Chip Cookies ingredients
('Butter', 1, 'cup', 2, NOW(), NOW()),
('Sugar', 0.75, 'cup', 2, NOW(), NOW()),
('Brown sugar', 0.75, 'cup', 2, NOW(), NOW()),
('Eggs', 2, 'pieces', 2, NOW(), NOW()),
('Vanilla extract', 1, 'tablespoon', 2, NOW(), NOW()),
('Flour', 2.25, 'cups', 2, NOW(), NOW()),
('Chocolate chips', 2, 'cups', 2, NOW(), NOW()),

-- Chicken Curry ingredients
('Chicken thighs', 1.5, 'pounds', 3, NOW(), NOW()),
('Onion', 2, 'pieces', 3, NOW(), NOW()),
('Garlic', 4, 'cloves', 3, NOW(), NOW()),
('Curry powder', 2, 'tablespoons', 3, NOW(), NOW()),
('Coconut milk', 1, 'can', 3, NOW(), NOW()),
('Fresh cilantro', 0.25, 'cup', 3, NOW(), NOW()); 