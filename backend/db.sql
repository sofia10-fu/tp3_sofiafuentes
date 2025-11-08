CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(45),
  email VARCHAR(45) UNIQUE,
  password VARCHAR(100)
);

CREATE TABLE vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca VARCHAR(45),
  modelo VARCHAR(45),
  patente VARCHAR(20),
  ano INT,
  capacidad_carga DECIMAL(10,2)
);

CREATE TABLE conductores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(45),
  apellido VARCHAR(45),
  dni VARCHAR(20),
  telefono INT,
  licencia VARCHAR(45),
);

CREATE TABLE viajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vehiculo_id INT,
  conductor_id INT,
  fecha_salida DATE,
  fecha_llegada DATE,
  origen VARCHAR(45),
  destino VARCHAR(45),
  kilometros DECIMAL(10,2),
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id),
  FOREIGN KEY (conductor_id) REFERENCES conductores(id)conductores
);