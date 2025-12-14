-- Migration 008: Add Login Attempts Table for Rate Limiting
-- Purpose: Track failed login attempts by IP address to prevent brute force attacks
-- Created: 2025-12-14

USE all_day_every_day;

CREATE TABLE IF NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    attempt_count INT DEFAULT 1,
    first_attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    lockout_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ip_address (ip_address),
    INDEX idx_lockout_until (lockout_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note: Automatic cleanup requires EVENT privilege
-- Run this manually periodically or use a cron job:
-- DELETE FROM login_attempts 
-- WHERE last_attempt_at < DATE_SUB(NOW(), INTERVAL 24 HOUR)
-- AND (lockout_until IS NULL OR lockout_until < NOW());
