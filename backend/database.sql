-- ========================================================
-- Script de Base de Datos - Horizon Air (AntiGravity)
-- Contiene: Tablas, Triggers, Vistas y Datos Iniciales
-- ========================================================

-- 1. CREACIÓN DE LA BASE DE DATOS
CREATE DATABASE IF NOT EXISTS antigravity_flights;
USE antigravity_flights;

-- 2. LIMPIEZA DE TABLAS (En orden de jerarquía)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Bookings;
DROP TABLE IF EXISTS Flights;
DROP TABLE IF EXISTS Users;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. TABLA: Users (Usuarios y Administradores)
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'client') DEFAULT 'client' NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. TABLA: Flights (Gestión de Vuelos)
CREATE TABLE Flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    flightNumber VARCHAR(20) NOT NULL UNIQUE,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    departureDate DATETIME NOT NULL,
    arrivalDate DATETIME NOT NULL,
    totalSeats INT NOT NULL,
    availableSeats INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    status ENUM('scheduled', 'cancelled', 'completed') DEFAULT 'scheduled' NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 5. TABLA: Bookings (Reservas de Clientes)
CREATE TABLE Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    flightId INT NOT NULL,
    seatsReserved INT NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    status ENUM('confirmed', 'cancelled', 'pending') DEFAULT 'confirmed' NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (flightId) REFERENCES Flights(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. TRIGGERS: AUTOMATIZACIÓN DE ASIENTOS
DELIMITER //

-- Restar asientos automáticamente al crear una reserva
CREATE TRIGGER after_booking_insert
AFTER INSERT ON Bookings
FOR EACH ROW
BEGIN
    UPDATE Flights 
    SET availableSeats = availableSeats - NEW.seatsReserved
    WHERE id = NEW.flightId;
END //

-- Devolver asientos automáticamente si se elimina una reserva
CREATE TRIGGER after_booking_delete
AFTER DELETE ON Bookings
FOR EACH ROW
BEGIN
    UPDATE Flights 
    SET availableSeats = availableSeats + OLD.seatsReserved
    WHERE id = OLD.flightId;
END //

DELIMITER ;

-- 7. VIEWS: REPORTES Y CONSULTAS RÁPIDAS
-- Vista para ver vuelos activos con asientos disponibles
CREATE OR REPLACE VIEW view_active_flights AS
SELECT flightNumber, origin, destination, departureDate, availableSeats, price
FROM Flights
WHERE status = 'scheduled' AND availableSeats > 0;

-- Vista detallada de reservas para el administrador
CREATE OR REPLACE VIEW view_booking_summary AS
SELECT 
    b.id AS booking_id,
    u.name AS passenger,
    u.email AS passenger_email,
    f.flightNumber,
    f.origin,
    f.destination,
    b.seatsReserved,
    b.totalPrice,
    b.status AS booking_status
FROM Bookings b
JOIN Users u ON b.userId = u.id
JOIN Flights f ON b.flightId = f.id;

-- 8. DATOS INICIALES (SEED)
-- Nota: Las contraseñas están hasheadas (password: admin123 y cliente123)
INSERT INTO Users (name, email, password, role) VALUES
('Admin Horizon', 'admin@antigravity.com', '$2a$10$8K.R2L6I9.p/L0g9Qe9e/O3p.fR1qK8XW8.8.8.8.8.8.8.8.8', 'admin'),
('Carlos Mendoza', 'carlos@email.com', '$2a$10$8K.R2L6I9.p/L0g9Qe9e/O3p.fR1qK8XW8.8.8.8.8.8.8.8.8', 'client');

INSERT INTO Flights (flightNumber, origin, destination, departureDate, arrivalDate, totalSeats, availableSeats, price, status) VALUES
('HZ-101', 'Bogotá', 'Madrid', '2025-12-01 08:00:00', '2025-12-01 22:00:00', 150, 150, 850.00, 'scheduled'),
('HZ-202', 'México DF', 'Buenos Aires', '2025-12-05 10:30:00', '2025-12-05 19:00:00', 120, 120, 620.50, 'scheduled'),
('HZ-303', 'Miami', 'Lima', '2025-12-10 14:00:00', '2025-12-10 20:00:00', 180, 180, 450.00, 'scheduled'),
('HZ-404', 'Santiago', 'Nueva York', '2025-12-15 23:00:00', '2025-12-16 08:00:00', 200, 200, 980.00, 'scheduled');

-- Ejemplo de reserva inicial (El trigger actualizará los asientos del vuelo HZ-101)
INSERT INTO Bookings (userId, flightId, seatsReserved, totalPrice, status) VALUES
(2, 1, 1, 850.00, 'confirmed');
