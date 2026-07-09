DROP DATABASE IF EXISTS course_db;
CREATE DATABASE course_db;
USE course_db;

-- 1. Students Profile table
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_STUDENT'
);

-- 2. Courses Catalog table
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    instructor VARCHAR(100) NOT NULL,
    capacity INT NOT NULL
);

-- 3. Student-Course Junction Enrollment table
CREATE TABLE student_courses (
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Seed Initial Admin User (username: admin, password: password123, encrypted using BCrypt)
-- Password 'password123' bcrypt hash: $2a$10$wN1kF1f74j9sS0vQ5D9k/.eIEx7840131o/xR/eY3eW3i3nQ4kX.C (actually we can also seed from the backend when booted)
INSERT INTO students (username, password, email, name, role) 
VALUES ('admin', '$2a$10$X56H.dM86s17Z/9yX3X3ZeA/lUaZ.s/GGeMhW92D41rNu8H6YyUeq', 'admin@apex.edu', 'Administrator', 'ROLE_ADMIN');
