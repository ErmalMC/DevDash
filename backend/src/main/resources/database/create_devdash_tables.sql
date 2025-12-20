-- DevDash Database Schema Setup Script
-- Run this script after connecting to the 'devdash' database

-- Enable UUID extension (if using PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS job_assignments CASCADE;
DROP TABLE IF EXISTS repair_requests CASCADE;
DROP TABLE IF EXISTS availability_slots CASCADE;
DROP TABLE IF EXISTS worker_skills CASCADE;
DROP TABLE IF EXISTS worker_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       role VARCHAR(20) NOT NULL CHECK (role IN ('CITIZEN', 'WORKER', 'ADMIN')),
                       full_name VARCHAR(100) NOT NULL,
                       phone_number VARCHAR(20) UNIQUE NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       is_verified BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Worker profiles
CREATE TABLE worker_profiles (
                                 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                 user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
                                 service_radius_km INTEGER NOT NULL CHECK (service_radius_km > 0),
                                 base_location_lat DOUBLE PRECISION NOT NULL CHECK (base_location_lat BETWEEN -90 AND 90),
                                 base_location_lng DOUBLE PRECISION NOT NULL CHECK (base_location_lng BETWEEN -180 AND 180),
                                 hourly_rate_min INTEGER CHECK (hourly_rate_min >= 0),
                                 hourly_rate_max INTEGER CHECK (hourly_rate_max >= hourly_rate_min),
                                 rating_average DOUBLE PRECISION DEFAULT 0.0 CHECK (rating_average BETWEEN 0 AND 5),
                                 rating_count INTEGER DEFAULT 0 CHECK (rating_count >= 0),
                                 is_approved BOOLEAN DEFAULT FALSE
);

-- Worker skills (ElementCollection)
CREATE TABLE worker_skills (
                               worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
                               skill VARCHAR(20) NOT NULL,
                               PRIMARY KEY (worker_id, skill)
);

-- Availability slots
CREATE TABLE availability_slots (
                                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                    worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
                                    day_of_week VARCHAR(10) NOT NULL CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY')),
                                    start_time TIME NOT NULL,
                                    end_time TIME NOT NULL,
                                    CHECK (end_time > start_time)
);

-- Repair requests
CREATE TABLE repair_requests (
                                 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                 citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
                                 category VARCHAR(20) NOT NULL,
                                 description TEXT NOT NULL,
                                 urgency VARCHAR(10) NOT NULL CHECK (urgency IN ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY')),
                                 address VARCHAR(255) NOT NULL,
                                 latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
                                 longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
                                 status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job assignments
CREATE TABLE job_assignments (
                                 id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                 repair_request_id UUID UNIQUE REFERENCES repair_requests(id) ON DELETE CASCADE,
                                 worker_id UUID REFERENCES worker_profiles(id) ON DELETE SET NULL,
                                 accepted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 scheduled_start TIMESTAMP,
                                 scheduled_end TIMESTAMP,
                                 final_price INTEGER CHECK (final_price >= 0),
                                 CHECK (scheduled_end IS NULL OR scheduled_start IS NULL OR scheduled_end > scheduled_start)
);

-- Ratings
CREATE TABLE ratings (
                         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         repair_request_id UUID UNIQUE REFERENCES repair_requests(id) ON DELETE CASCADE,
                         citizen_id UUID REFERENCES users(id) ON DELETE CASCADE,
                         worker_id UUID REFERENCES worker_profiles(id) ON DELETE CASCADE,
                         score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
                         comment TEXT,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_worker_profiles_user_id ON worker_profiles(user_id);
CREATE INDEX idx_worker_profiles_approved ON worker_profiles(is_approved);
CREATE INDEX idx_worker_profiles_location ON worker_profiles(base_location_lat, base_location_lng);

CREATE INDEX idx_worker_skills_worker_id ON worker_skills(worker_id);
CREATE INDEX idx_worker_skills_skill ON worker_skills(skill);

CREATE INDEX idx_availability_slots_worker_id ON availability_slots(worker_id);
CREATE INDEX idx_availability_slots_day ON availability_slots(day_of_week);

CREATE INDEX idx_repair_requests_citizen_id ON repair_requests(citizen_id);
CREATE INDEX idx_repair_requests_status ON repair_requests(status);
CREATE INDEX idx_repair_requests_category ON repair_requests(category);
CREATE INDEX idx_repair_requests_created_at ON repair_requests(created_at);
CREATE INDEX idx_repair_requests_location ON repair_requests(latitude, longitude);

CREATE INDEX idx_job_assignments_request_id ON job_assignments(repair_request_id);
CREATE INDEX idx_job_assignments_worker_id ON job_assignments(worker_id);
CREATE INDEX idx_job_assignments_scheduled_start ON job_assignments(scheduled_start);

CREATE INDEX idx_ratings_request_id ON ratings(repair_request_id);
CREATE INDEX idx_ratings_worker_id ON ratings(worker_id);
CREATE INDEX idx_ratings_citizen_id ON ratings(citizen_id);

-- Print success message
SELECT 'DevDash database tables created successfully!' AS status;