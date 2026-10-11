-- Insert Roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator with full access to manage users, roles and exercises'),
('user', 'Regular user with access to routines and activity logs');

-- Insert Permissions
INSERT INTO permissions (name, description) VALUES
('create_routine', 'Create new workout routines'),
('read_routine', 'Read workout routines'),
('update_routine', 'Update existing workout routines'),
('delete_routine', 'Delete workout routines'),
('manage_users', 'Manage user accounts'),
('manage_roles', 'Manage roles and permissions'),
('manage_exercises', 'Manage exercise catalog'),
('read_exercise', 'Read the exercise catalog'),
('create_routine_exercise', 'Add exercises to a routine'),
('read_routine_exercise', 'Read the exercises of a routine'),
('update_routine_exercise', 'Update the exercises of a routine'),
('delete_routine_exercise', 'Remove exercises from a routine'),
('create_activity_log', 'Register a training session'),
('read_activity_log', 'Read training sessions'),
('update_activity_log', 'Update training sessions'),
('delete_activity_log', 'Delete training sessions'),
('create_activity_exercise', 'Register an exercise performed in a session'),
('read_activity_exercise', 'Read exercises performed in sessions'),
('update_activity_exercise', 'Update exercises performed in sessions'),
('delete_activity_exercise', 'Delete exercises performed in sessions');

-- Permiso dedicado para administrar el catálogo de permisos (CRUD de /permissions)
INSERT INTO permissions (name, description) VALUES
('manage_permissions', 'Create, read, update and delete permissions, and assign them to roles');

-- Insert Role-Permission relationships
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10),
(1, 11), (1, 12), (1, 13), (1, 14), (1, 15), (1, 16), (1, 17), (1, 18), (1, 19), (1, 20),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12),
(2, 13), (2, 14), (2, 15), (2, 16), (2, 17), (2, 18), (2, 19), (2, 20);

-- manage_permissions (id 21) solo se le otorga al rol admin
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 21);

-- Insert Users
-- Contraseñas reales (hasheadas con bcrypt, 10 salt rounds): admin -> admin123 | demás usuarios -> user1234
INSERT INTO users (username, email, password_hash, bio, role_id, created_at) VALUES
('admin_user', 'admin@gym.com', '$2b$10$v3KEOgWUlXmmZ7lt1EMHru9KPXhZM1LZrh54wKgYmwXx5T861Bqd2', 'System administrator', 1, NOW()),
('juan_perez', 'juan@example.com', '$2b$10$fSkGEc5NZ44B5QjUcaa5Le5y5d9wK6g.wy1spbRqmFOKEiY0jhDjq', 'Fitness enthusiast', 2, NOW()),
('maria_garcia', 'maria@example.com', '$2b$10$fSkGEc5NZ44B5QjUcaa5Le5y5d9wK6g.wy1spbRqmFOKEiY0jhDjq', 'Crossfit practitioner', 2, NOW()),
('carlos_lopez', 'carlos@example.com', '$2b$10$fSkGEc5NZ44B5QjUcaa5Le5y5d9wK6g.wy1spbRqmFOKEiY0jhDjq', 'Marathon runner', 2, NOW()),
('ana_martinez', 'ana@example.com', '$2b$10$fSkGEc5NZ44B5QjUcaa5Le5y5d9wK6g.wy1spbRqmFOKEiY0jhDjq', 'Powerlifting athlete', 2, NOW());

-- Insert Exercises
INSERT INTO exercises (name, description, type, estimated_calories, estimated_distance_km, estimated_duration_min, icon) VALUES
('Push-ups', 'Upper body strength exercise targeting chest and triceps', 'strength', 50.0, 0.0, 10, 'pushup_icon.png'),
('Squats', 'Lower body strength exercise targeting quads and glutes', 'strength', 80.0, 0.0, 15, 'squat_icon.png'),
('Outdoor Running', 'Cardio exercise for endurance and leg strength', 'cardio', 300.0, 5.0, 30, 'running_icon.png'),
('Bench Press', 'Barbell exercise for chest and triceps', 'strength', 120.0, 0.0, 20, 'benchpress_icon.png'),
('Plank', 'Core stability exercise', 'core', 40.0, 0.0, 5, 'plank_icon.png');

-- Insert Routines
INSERT INTO routines (user_id, name, description, created_at, updated_at) VALUES
(2, 'Full Body Routine', 'A balanced routine targeting all major muscle groups', NOW() - INTERVAL '5 days', NOW()),
(3, 'Cardio & Core Burst', 'High intensity cardio combined with core exercises', NOW() - INTERVAL '3 days', NOW()),
(4, 'Upper Body Strength', 'Heavy chest and triceps focus', NOW() - INTERVAL '2 days', NOW());

-- Insert Routine Exercises
INSERT INTO routine_exercises (routine_id, exercise_id, order_index, target_sets, target_reps, target_weight_kg, target_duration_min) VALUES
(1, 1, 1, 4, 15, 0.0, 10),
(1, 2, 2, 4, 12, 50.0, 15),
(1, 5, 3, 3, 1, 0.0, 5),
(2, 3, 1, 1, 1, 0.0, 30),
(2, 5, 2, 4, 1, 0.0, 5),
(3, 1, 1, 4, 20, 0.0, 10),
(3, 4, 2, 4, 8, 80.0, 20);

-- Insert Activity Logs
INSERT INTO activity_logs (user_id, routine_id, started_at, completed_at, created_at) VALUES
(2, 1, NOW() - INTERVAL '2 days' - INTERVAL '1 hour', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(3, 2, NOW() - INTERVAL '1 day' - INTERVAL '40 minutes', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- Insert Activity Exercises
INSERT INTO activity_exercises (activity_log_id, routine_exercise_id, actual_sets, actual_reps, actual_weight_kg, actual_duration_min, calories_burned, distance_covered_km, started_at, completed_at) VALUES
(1, 1, 4, 15, 0.0, 10, 55.0, 0.0, NOW() - INTERVAL '2 days' - INTERVAL '1 hour', NOW() - INTERVAL '2 days' - INTERVAL '50 minutes'),
(1, 2, 4, 12, 50.0, 15, 85.0, 0.0, NOW() - INTERVAL '2 days' - INTERVAL '50 minutes', NOW() - INTERVAL '2 days' - INTERVAL '35 minutes'),
(1, 3, 3, 1, 0.0, 5, 42.0, 0.0, NOW() - INTERVAL '2 days' - INTERVAL '35 minutes', NOW() - INTERVAL '2 days' - INTERVAL '30 minutes'),
(2, 4, 1, 1, 0.0, 32, 320.0, 5.2, NOW() - INTERVAL '1 day' - INTERVAL '40 minutes', NOW() - INTERVAL '1 day' - INTERVAL '8 minutes'),
(2, 5, 4, 1, 0.0, 5, 45.0, 0.0, NOW() - INTERVAL '1 day' - INTERVAL '8 minutes', NOW() - INTERVAL '1 day');
