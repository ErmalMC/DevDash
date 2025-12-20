-- Clear all existing data first
TRUNCATE TABLE ratings, job_assignments, repair_requests, availability_slots, worker_skills, worker_profiles, users CASCADE;

-- DevDash Mock Data Script (Fixed UUIDs)
-- This script populates the database with realistic test data

-- ========================================
-- USERS (Citizens and Workers)
-- ========================================

-- Citizens (5 users)
INSERT INTO users (id, role, full_name, phone_number, email, password_hash, is_verified, created_at) VALUES
                                                                                                         ('a0000001-0000-0000-0000-000000000001', 'CITIZEN', 'John Miller', '+38970123456', 'john.miller@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-01-15 10:30:00'),
                                                                                                         ('a0000002-0000-0000-0000-000000000002', 'CITIZEN', 'Sarah Johnson', '+38970234567', 'sarah.johnson@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-02-20 14:15:00'),
                                                                                                         ('a0000003-0000-0000-0000-000000000003', 'CITIZEN', 'Michael Brown', '+38970345678', 'michael.brown@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-03-10 09:00:00'),
                                                                                                         ('a0000004-0000-0000-0000-000000000004', 'CITIZEN', 'Emily Davis', '+38970456789', 'emily.davis@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-04-05 16:45:00'),
                                                                                                         ('a0000005-0000-0000-0000-000000000005', 'CITIZEN', 'David Wilson', '+38970567890', 'david.wilson@email.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', false, '2024-11-01 11:20:00');

-- Workers (8 users)
INSERT INTO users (id, role, full_name, phone_number, email, password_hash, is_verified, created_at) VALUES
                                                                                                         ('b0000001-0000-0000-0000-000000000001', 'WORKER', 'Alex Thompson', '+38971123456', 'alex.thompson@workers.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-01-05 08:00:00'),
                                                                                                         ('b0000002-0000-0000-0000-000000000002', 'WORKER', 'Maria Garcia', '+38971234567', 'maria.garcia@workers.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-01-10 10:30:00'),
                                                                                                         ('b0000003-0000-0000-0000-000000000003', 'WORKER', 'James Anderson', '+38971345678', 'james.anderson@workers.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-02-01 09:15:00'),
                                                                                                         ('b0000004-0000-0000-0000-000000000004', 'WORKER', 'Lisa Martinez', '+38971456789', 'lisa.martinez@workers.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-02-15 13:00:00'),
                                                                                                         ('b0000005-0000-0000-0000-000000000005', 'WORKER', 'Robert Taylor', '+38971567890', 'robert.taylor@workers.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-03-01 07:45:00'),
                                                                                                         ('b0000006-0000-0000-0000-000000000006', 'WORKER', 'Jennifer Lee', '+38971678901', 'jennifer.lee@workers.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-03-20 15:30:00'),
                                                                                                         ('b0000007-0000-0000-0000-000000000007', 'WORKER', 'William Clark', '+38971789012', 'william.clark@workers.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-04-10 11:00:00'),
                                                                                                         ('b0000008-0000-0000-0000-000000000008', 'WORKER', 'Patricia White', '+38971890123', 'patricia.white@workers.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', false, '2024-11-15 14:20:00');

-- Admin user
INSERT INTO users (id, role, full_name, phone_number, email, password_hash, is_verified, created_at) VALUES
    ('c0000001-0000-0000-0000-000000000001', 'ADMIN', 'Admin User', '+38972000000', 'admin@devdash.com', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', true, '2024-01-01 00:00:00');

-- ========================================
-- WORKER PROFILES
-- ========================================

INSERT INTO worker_profiles (id, user_id, service_radius_km, base_location_lat, base_location_lng, hourly_rate_min, hourly_rate_max, rating_average, rating_count, is_approved) VALUES
-- Alex Thompson - Electrician (Skopje Center)
('10000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 15, 41.9973, 21.4280, 800, 1200, 4.7, 23, true),
-- Maria Garcia - Plumber (Karpos)
('10000002-0000-0000-0000-000000000002', 'b0000002-0000-0000-0000-000000000002', 10, 41.9794, 21.4070, 700, 1000, 4.9, 31, true),
-- James Anderson - Carpenter (Centar)
('10000003-0000-0000-0000-000000000003', 'b0000003-0000-0000-0000-000000000003', 20, 41.9961, 21.4254, 900, 1500, 4.5, 18, true),
-- Lisa Martinez - HVAC Specialist (Aerodrom)
('10000004-0000-0000-0000-000000000004', 'b0000004-0000-0000-0000-000000000004', 12, 41.9447, 21.4927, 1000, 1600, 4.8, 27, true),
-- Robert Taylor - General Handyman (Kisela Voda)
('10000005-0000-0000-0000-000000000005', 'b0000005-0000-0000-0000-000000000005', 25, 41.9447, 21.4597, 600, 1100, 4.6, 42, true),
-- Jennifer Lee - Painter (Gazi Baba)
('10000006-0000-0000-0000-000000000006', 'b0000006-0000-0000-0000-000000000006', 18, 42.0089, 21.4586, 650, 950, 4.4, 15, true),
-- William Clark - Locksmith (Cair)
('10000007-0000-0000-0000-000000000007', 'b0000007-0000-0000-0000-000000000007', 30, 42.0153, 21.4147, 700, 1200, 4.9, 38, true),
-- Patricia White - Gardener (Pending approval)
('10000008-0000-0000-0000-000000000008', 'b0000008-0000-0000-0000-000000000008', 15, 41.9831, 21.4486, 500, 800, 0.0, 0, false);

-- ========================================
-- WORKER SKILLS
-- ========================================

INSERT INTO worker_skills (worker_id, skill) VALUES
-- Alex Thompson - Electrician
('10000001-0000-0000-0000-000000000001', 'ELECTRICAL'),
('10000001-0000-0000-0000-000000000001', 'LIGHTING'),
-- Maria Garcia - Plumber
('10000002-0000-0000-0000-000000000002', 'PLUMBING'),
('10000002-0000-0000-0000-000000000002', 'BATHROOM'),
-- James Anderson - Carpenter
('10000003-0000-0000-0000-000000000003', 'CARPENTRY'),
('10000003-0000-0000-0000-000000000003', 'FURNITURE'),
('10000003-0000-0000-0000-000000000003', 'DOORS_WINDOWS'),
-- Lisa Martinez - HVAC
('10000004-0000-0000-0000-000000000004', 'HVAC'),
('10000004-0000-0000-0000-000000000004', 'APPLIANCES'),
-- Robert Taylor - Handyman
('10000005-0000-0000-0000-000000000005', 'GENERAL_REPAIR'),
('10000005-0000-0000-0000-000000000005', 'ELECTRICAL'),
('10000005-0000-0000-0000-000000000005', 'PLUMBING'),
('10000005-0000-0000-0000-000000000005', 'CARPENTRY'),
-- Jennifer Lee - Painter
('10000006-0000-0000-0000-000000000006', 'PAINTING'),
('10000006-0000-0000-0000-000000000006', 'WALLS'),
-- William Clark - Locksmith
('10000007-0000-0000-0000-000000000007', 'LOCKSMITH'),
('10000007-0000-0000-0000-000000000007', 'DOORS_WINDOWS'),
-- Patricia White - Gardener
('10000008-0000-0000-0000-000000000008', 'GARDENING'),
('10000008-0000-0000-0000-000000000008', 'LANDSCAPING');

-- ========================================
-- AVAILABILITY SLOTS
-- ========================================

-- Alex Thompson - Monday to Friday, 8am-5pm
INSERT INTO availability_slots (id, worker_id, day_of_week, start_time, end_time) VALUES
                                                                                      ('20000001-0000-0000-0000-000000000001', '10000001-0000-0000-0000-000000000001', 'MONDAY', '08:00:00', '17:00:00'),
                                                                                      ('20000001-0000-0000-0000-000000000002', '10000001-0000-0000-0000-000000000001', 'TUESDAY', '08:00:00', '17:00:00'),
                                                                                      ('20000001-0000-0000-0000-000000000003', '10000001-0000-0000-0000-000000000001', 'WEDNESDAY', '08:00:00', '17:00:00'),
                                                                                      ('20000001-0000-0000-0000-000000000004', '10000001-0000-0000-0000-000000000001', 'THURSDAY', '08:00:00', '17:00:00'),
                                                                                      ('20000001-0000-0000-0000-000000000005', '10000001-0000-0000-0000-000000000001', 'FRIDAY', '08:00:00', '17:00:00');

-- Maria Garcia - All week including Saturday, 7am-3pm
INSERT INTO availability_slots (id, worker_id, day_of_week, start_time, end_time) VALUES
                                                                                      ('20000002-0000-0000-0000-000000000001', '10000002-0000-0000-0000-000000000002', 'MONDAY', '07:00:00', '15:00:00'),
                                                                                      ('20000002-0000-0000-0000-000000000002', '10000002-0000-0000-0000-000000000002', 'TUESDAY', '07:00:00', '15:00:00'),
                                                                                      ('20000002-0000-0000-0000-000000000003', '10000002-0000-0000-0000-000000000002', 'WEDNESDAY', '07:00:00', '15:00:00'),
                                                                                      ('20000002-0000-0000-0000-000000000004', '10000002-0000-0000-0000-000000000002', 'THURSDAY', '07:00:00', '15:00:00'),
                                                                                      ('20000002-0000-0000-0000-000000000005', '10000002-0000-0000-0000-000000000002', 'FRIDAY', '07:00:00', '15:00:00'),
                                                                                      ('20000002-0000-0000-0000-000000000006', '10000002-0000-0000-0000-000000000002', 'SATURDAY', '08:00:00', '14:00:00');

-- James Anderson - Tuesday to Saturday, 9am-6pm
INSERT INTO availability_slots (id, worker_id, day_of_week, start_time, end_time) VALUES
                                                                                      ('20000003-0000-0000-0000-000000000002', '10000003-0000-0000-0000-000000000003', 'TUESDAY', '09:00:00', '18:00:00'),
                                                                                      ('20000003-0000-0000-0000-000000000003', '10000003-0000-0000-0000-000000000003', 'WEDNESDAY', '09:00:00', '18:00:00'),
                                                                                      ('20000003-0000-0000-0000-000000000004', '10000003-0000-0000-0000-000000000003', 'THURSDAY', '09:00:00', '18:00:00'),
                                                                                      ('20000003-0000-0000-0000-000000000005', '10000003-0000-0000-0000-000000000003', 'FRIDAY', '09:00:00', '18:00:00'),
                                                                                      ('20000003-0000-0000-0000-000000000006', '10000003-0000-0000-0000-000000000003', 'SATURDAY', '09:00:00', '18:00:00');

-- Lisa Martinez - Monday to Friday, 10am-7pm
INSERT INTO availability_slots (id, worker_id, day_of_week, start_time, end_time) VALUES
                                                                                      ('20000004-0000-0000-0000-000000000001', '10000004-0000-0000-0000-000000000004', 'MONDAY', '10:00:00', '19:00:00'),
                                                                                      ('20000004-0000-0000-0000-000000000002', '10000004-0000-0000-0000-000000000004', 'TUESDAY', '10:00:00', '19:00:00'),
                                                                                      ('20000004-0000-0000-0000-000000000003', '10000004-0000-0000-0000-000000000004', 'WEDNESDAY', '10:00:00', '19:00:00'),
                                                                                      ('20000004-0000-0000-0000-000000000004', '10000004-0000-0000-0000-000000000004', 'THURSDAY', '10:00:00', '19:00:00'),
                                                                                      ('20000004-0000-0000-0000-000000000005', '10000004-0000-0000-0000-000000000004', 'FRIDAY', '10:00:00', '19:00:00');

-- Robert Taylor - Flexible schedule, all days, 6am-8pm
INSERT INTO availability_slots (id, worker_id, day_of_week, start_time, end_time) VALUES
                                                                                      ('20000005-0000-0000-0000-000000000001', '10000005-0000-0000-0000-000000000005', 'MONDAY', '06:00:00', '20:00:00'),
                                                                                      ('20000005-0000-0000-0000-000000000002', '10000005-0000-0000-0000-000000000005', 'TUESDAY', '06:00:00', '20:00:00'),
                                                                                      ('20000005-0000-0000-0000-000000000003', '10000005-0000-0000-0000-000000000005', 'WEDNESDAY', '06:00:00', '20:00:00'),
                                                                                      ('20000005-0000-0000-0000-000000000004', '10000005-0000-0000-0000-000000000005', 'THURSDAY', '06:00:00', '20:00:00'),
                                                                                      ('20000005-0000-0000-0000-000000000005', '10000005-0000-0000-0000-000000000005', 'FRIDAY', '06:00:00', '20:00:00'),
                                                                                      ('20000005-0000-0000-0000-000000000006', '10000005-0000-0000-0000-000000000005', 'SATURDAY', '08:00:00', '18:00:00'),
                                                                                      ('20000005-0000-0000-0000-000000000007', '10000005-0000-0000-0000-000000000005', 'SUNDAY', '10:00:00', '16:00:00');

-- ========================================
-- REPAIR REQUESTS
-- ========================================

INSERT INTO repair_requests (id, citizen_id, category, description, urgency, address, latitude, longitude, status, created_at) VALUES
-- Completed jobs
('30000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', 'ELECTRICAL', 'Kitchen light fixture not working. Need replacement and installation.', 'MEDIUM', 'Ul. Makedonija 23, Skopje', 41.9973, 21.4280, 'COMPLETED', '2024-11-01 09:30:00'),
('30000002-0000-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000002', 'PLUMBING', 'Bathroom sink leaking. Water damage under cabinet.', 'HIGH', 'Ul. Dame Gruev 45, Skopje', 41.9950, 21.4320, 'COMPLETED', '2024-11-05 14:20:00'),
('30000003-0000-0000-0000-000000000003', 'a0000003-0000-0000-0000-000000000003', 'CARPENTRY', 'Need custom shelving unit for home office. 2.5m wide.', 'LOW', 'Ul. Dimitrie Cupovski 12, Skopje', 41.9900, 21.4250, 'COMPLETED', '2024-11-10 10:15:00'),
('30000004-0000-0000-0000-000000000004', 'a0000004-0000-0000-0000-000000000004', 'HVAC', 'Air conditioning unit making strange noise. Not cooling properly.', 'HIGH', 'Ul. Partizanski Odredi 67, Skopje', 41.9850, 21.4400, 'COMPLETED', '2024-11-12 16:45:00'),

-- In progress jobs
('30000005-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000001', 'PAINTING', 'Living room and hallway need repainting. About 45 square meters.', 'LOW', 'Ul. Makedonija 23, Skopje', 41.9973, 21.4280, 'IN_PROGRESS', '2024-12-15 11:00:00'),
('30000006-0000-0000-0000-000000000006', 'a0000005-0000-0000-0000-000000000005', 'ELECTRICAL', 'Multiple outlets not working in bedroom. Possible wiring issue.', 'MEDIUM', 'Ul. 11 Oktomvri 89, Skopje', 41.9920, 21.4350, 'IN_PROGRESS', '2024-12-17 08:30:00'),

-- Assigned but not started
('30000007-0000-0000-0000-000000000007', 'a0000002-0000-0000-0000-000000000002', 'LOCKSMITH', 'Front door lock is stuck. Need lock replacement.', 'MEDIUM', 'Ul. Ilindenska 34, Skopje', 41.9880, 21.4290, 'ASSIGNED', '2024-12-18 13:20:00'),
('30000008-0000-0000-0000-000000000008', 'a0000003-0000-0000-0000-000000000003', 'PLUMBING', 'Water heater not heating. Unit is 5 years old.', 'HIGH', 'Ul. Londska 78, Skopje', 41.9940, 21.4380, 'ASSIGNED', '2024-12-19 07:45:00'),

-- Open requests (not yet assigned)
('30000009-0000-0000-0000-000000000009', 'a0000004-0000-0000-0000-000000000004', 'GENERAL_REPAIR', 'Door handle broken and closet door off hinges. Quick fix needed.', 'LOW', 'Ul. Kej 13 Noemvri 55, Skopje', 41.9960, 21.4330, 'OPEN', '2024-12-19 15:30:00'),
('30000010-0000-0000-0000-000000000010', 'a0000005-0000-0000-0000-000000000005', 'ELECTRICAL', 'Circuit breaker keeps tripping in kitchen. Urgent safety concern.', 'EMERGENCY', 'Ul. Kozle 12, Skopje', 41.9800, 21.4200, 'OPEN', '2024-12-20 06:00:00'),
('30000011-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000001', 'HVAC', 'Furnace not starting. House is getting cold.', 'EMERGENCY', 'Ul. Makedonija 23, Skopje', 41.9973, 21.4280, 'OPEN', '2024-12-20 07:15:00');

-- ========================================
-- JOB ASSIGNMENTS
-- ========================================

INSERT INTO job_assignments (id, repair_request_id, worker_id, accepted_at, scheduled_start, scheduled_end, final_price) VALUES
-- Completed assignments
('40000001-0000-0000-0000-000000000001', '30000001-0000-0000-0000-000000000001', '10000001-0000-0000-0000-000000000001', '2024-11-01 10:00:00', '2024-11-02 09:00:00', '2024-11-02 11:00:00', 2400),
('40000002-0000-0000-0000-000000000002', '30000002-0000-0000-0000-000000000002', '10000002-0000-0000-0000-000000000002', '2024-11-05 15:00:00', '2024-11-06 08:00:00', '2024-11-06 11:30:00', 2800),
('40000003-0000-0000-0000-000000000003', '30000003-0000-0000-0000-000000000003', '10000003-0000-0000-0000-000000000003', '2024-11-10 11:00:00', '2024-11-15 10:00:00', '2024-11-15 18:00:00', 7200),
('40000004-0000-0000-0000-000000000004', '30000004-0000-0000-0000-000000000004', '10000004-0000-0000-0000-000000000004', '2024-11-12 17:30:00', '2024-11-13 11:00:00', '2024-11-13 14:00:00', 3600),

-- In progress assignments
('40000005-0000-0000-0000-000000000005', '30000005-0000-0000-0000-000000000005', '10000006-0000-0000-0000-000000000006', '2024-12-15 12:00:00', '2024-12-18 09:00:00', '2024-12-20 17:00:00', 5400),
('40000006-0000-0000-0000-000000000006', '30000006-0000-0000-0000-000000000006', '10000005-0000-0000-0000-000000000005', '2024-12-17 09:15:00', '2024-12-19 14:00:00', '2024-12-19 17:00:00', 2700),

-- Assigned but not started
('40000007-0000-0000-0000-000000000007', '30000007-0000-0000-0000-000000000007', '10000007-0000-0000-0000-000000000007', '2024-12-18 14:00:00', '2024-12-21 10:00:00', '2024-12-21 12:00:00', 1800),
('40000008-0000-0000-0000-000000000008', '30000008-0000-0000-0000-000000000008', '10000002-0000-0000-0000-000000000002', '2024-12-19 08:30:00', '2024-12-22 08:00:00', '2024-12-22 12:00:00', 3200);

-- ========================================
-- RATINGS
-- ========================================

INSERT INTO ratings (id, repair_request_id, citizen_id, worker_id, score, comment, created_at) VALUES
                                                                                                   ('50000001-0000-0000-0000-000000000001', '30000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', '10000001-0000-0000-0000-000000000001', 5, 'Excellent work! Alex was professional, arrived on time, and fixed the issue quickly. Highly recommend!', '2024-11-02 12:00:00'),
                                                                                                   ('50000002-0000-0000-0000-000000000002', '30000002-0000-0000-0000-000000000002', 'a0000002-0000-0000-0000-000000000002', '10000002-0000-0000-0000-000000000002', 5, 'Maria did an outstanding job. Very thorough and explained everything. No more leaks!', '2024-11-06 13:30:00'),
                                                                                                   ('50000003-0000-0000-0000-000000000003', '30000003-0000-0000-0000-000000000003', 'a0000003-0000-0000-0000-000000000003', '10000003-0000-0000-0000-000000000003', 4, 'Good quality work. Shelving looks great. Took a bit longer than expected but result is solid.', '2024-11-15 19:00:00'),
                                                                                                   ('50000004-0000-0000-0000-000000000004', '30000004-0000-0000-0000-000000000004', 'a0000004-0000-0000-0000-000000000004', '10000004-0000-0000-0000-000000000004', 5, 'Lisa is an expert! Diagnosed the problem immediately and AC is working perfectly now. Great service!', '2024-11-13 15:00:00');

-- Print summary
SELECT '=== Mock Data Summary ===' AS info;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_workers FROM worker_profiles;
SELECT COUNT(*) AS approved_workers FROM worker_profiles WHERE is_approved = true;
SELECT COUNT(*) AS total_repair_requests FROM repair_requests;
SELECT status, COUNT(*) AS count FROM repair_requests GROUP BY status ORDER BY status;
SELECT COUNT(*) AS total_job_assignments FROM job_assignments;
SELECT COUNT(*) AS total_ratings FROM ratings;
SELECT AVG(score)::NUMERIC(3,2) AS average_rating FROM ratings;
SELECT '=== Mock Data Inserted Successfully! ===' AS info;