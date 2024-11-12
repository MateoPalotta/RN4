-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 11-11-2024 a las 04:25:42
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `torneo_futbol`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `escudo_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id`, `nombre`, `escudo_url`) VALUES
(1, 'Velez Sarsfield', 'https://logodetimes.com/times/velez-sarsfield/logo-velez-sarsfield-1536.png'),
(2, 'River Plate', 'https://www.cariverplate.com.ar/images/escudo-river.png?cache=a57'),
(3, 'Boca Juniors', 'https://logodownload.org/wp-content/uploads/2016/10/Boca-Juniors-logo-escudo.png'),
(4, 'Racing Club', 'https://logodownload.org/wp-content/uploads/2018/10/racing-logo-escudo-1.png'),
(5, 'Independiente', 'https://es.logodownload.org/wp-content/uploads/2018/10/independiente-logo-0-2048x2048.png'),
(6, 'San Lorenzo', 'https://logodownload.org/wp-content/uploads/2018/09/san-lorenzo-logo-escudo-2.png'),
(7, 'Argentinos Juniors', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Escudo_de_la_Asociaci%C3%B3n_Atl%C3%A9tica_Argentinos_Juniors.svg/767px-Escudo_de_la_Asociaci%C3%B3n_Atl%C3%A9tica_Argentinos_Juniors.svg.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadisticas`
--

CREATE TABLE `estadisticas` (
  `id` int(11) NOT NULL,
  `jugador_id` int(11) DEFAULT NULL,
  `goles` int(11) DEFAULT 0,
  `tarjetas` int(11) DEFAULT 0,
  `asistencias` int(11) DEFAULT 0,
  `tarjetas_amarillas` int(11) DEFAULT 0,
  `tarjetas_rojas` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estadisticas`
--

INSERT INTO `estadisticas` (`id`, `jugador_id`, `goles`, `tarjetas`, `asistencias`, `tarjetas_amarillas`, `tarjetas_rojas`) VALUES
(9, 10, 17, 0, 3, 3, 1),
(12, 25, 6, 0, 2, 0, 0),
(13, 19, 9, 0, 1, 2, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores`
--

CREATE TABLE `jugadores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `posicion` varchar(50) DEFAULT NULL,
  `numero_casaca` int(11) DEFAULT NULL,
  `equipo_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadores`
--

INSERT INTO `jugadores` (`id`, `nombre`, `apellido`, `edad`, `posicion`, `numero_casaca`, `equipo_id`) VALUES
(2, 'Milton', 'Casco', 33, 'Defensor', 20, 2),
(5, 'Miguel', 'Borja', 29, 'Delantero', 9, 2),
(6, 'Sergio', 'Romero', 35, 'Arquero', 1, 3),
(7, 'Marcos', 'Rojo', 32, 'Defensor', 6, 3),
(10, 'Edinson', 'Cavani', 36, 'Delantero', 10, 3),
(11, 'Gabriel', 'Arias', 35, 'Arquero', 1, 4),
(12, 'Leonardo', 'Sigali', 31, 'Defensor', 30, 4),
(15, 'Roger', 'Martínez', 29, 'Delantero', 9, 4),
(16, 'Rodrigo', 'Rey', 32, 'Arquero', 1, 5),
(18, 'Federico', 'Mancuello', 29, 'Mediocampista', 5, 5),
(19, 'Martín', 'Avalos', 34, 'Delantero', 9, 5),
(20, 'Matías', 'Giménez', 25, 'Delantero', 34, 5),
(25, 'Adam', 'Bareiro', 27, 'Delantero', 9, 2),
(29, 'Tomás', 'Marchiori', 29, 'Arquero', 1, 1),
(30, 'Valentin', 'Gomez', 21, 'Defensor', 31, 1),
(31, 'Claudio', 'Aquino', 33, 'Mediocampista', 22, 1),
(32, 'Agustin', 'Bouzat', 30, 'Mediocampista', 26, 1),
(33, 'Braian', 'Romero', 33, 'Delantero', 9, 1),
(34, 'Franco', 'Mastantuono', 17, 'Mediocampista', 30, 2),
(36, 'Kevin', 'Zenón', 23, 'Mediocampista', 22, 3),
(37, 'Exequiel', 'Zeballos', 22, 'Delantero', 7, 3),
(38, 'Juan', 'Nardoni', 22, 'Mediocampista', 5, 4),
(39, 'Juan Fernando', 'Quintero', 0, 'Mediocampista', 8, 4),
(40, 'Franco', 'Armani', 38, 'Arquero', 1, 2),
(41, 'Kevin', 'Lomonaco', 22, 'Defensor', 26, 5),
(42, 'Iker', 'Muniain', 31, 'Mediocampista', 10, 6),
(43, 'Elian', 'Irala', 22, 'Mediocampista', 17, 6),
(44, 'Nahuel', 'Bustos', 26, 'Delantero', 77, 6),
(45, 'Facundo', 'Altamirano', 28, 'Arquero', 13, 6),
(46, 'Nicolas', 'Tripichio', 28, 'Defensor', 24, 6),
(47, 'Alan', 'Lescano', 22, 'Mediocampista', 22, 7),
(48, 'Diego', 'Rodríguez', 35, 'Arquero', 1, 7),
(49, 'Roman', 'Vega', 20, 'Defensor', 6, 7),
(50, 'Maximiliano', 'Romero', 25, 'Delantero', 9, 7),
(51, 'Francis', 'Mac Allister', 30, 'Mediocampista', 29, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidos`
--

CREATE TABLE `partidos` (
  `id` int(11) NOT NULL,
  `equipo_local_id` int(11) DEFAULT NULL,
  `equipo_visitante_id` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `lugar` varchar(255) DEFAULT NULL,
  `resultado` varchar(50) DEFAULT NULL,
  `goles_local` int(11) DEFAULT NULL,
  `goles_visitante` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `partidos`
--

INSERT INTO `partidos` (`id`, `equipo_local_id`, `equipo_visitante_id`, `fecha`, `hora`, `lugar`, `resultado`, `goles_local`, `goles_visitante`) VALUES
(6, 5, 7, '2024-11-11 14:57:18', '12:00:00', 'Estadio Ricardo Bochini', '1-1', 1, 3),
(9, 7, 1, '2024-11-10 00:00:00', '21:00:00', 'Estadio Diego Armando Maradona', NULL, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','jugador','seguidor') NOT NULL DEFAULT 'seguidor',
  `jugador_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `email`, `password`, `rol`, `jugador_id`) VALUES
(2, 'admin@admin.com', '$2b$10$CFGvZlGzHHik0KgBB5LVcO4mgvRx0JVV/SD9VNPH.dZgjk/Qno822', 'admin', NULL),
(3, 'seguidor@seguidor.com', '$2b$10$xGu5RLCRiqj5QTFI3tg9w.418jWQ8/9U/cj3XY98y.ciKaQEx6TMG', 'seguidor', NULL),
(4, 'cavani@cavani.com', '$2b$10$sHTGsFJhPfOEyoZATI8WxOpiD/g1ae9bWTr3Q9qJqp0aW9TcBJBMq', 'jugador', 10);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jugador_id` (`jugador_id`);

--
-- Indices de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipo_id` (`equipo_id`);

--
-- Indices de la tabla `partidos`
--
ALTER TABLE `partidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipo_local_id` (`equipo_local_id`),
  ADD KEY `equipo_visitante_id` (`equipo_visitante_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `jugador_id` (`jugador_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de la tabla `partidos`
--
ALTER TABLE `partidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estadisticas`
--
ALTER TABLE `estadisticas`
  ADD CONSTRAINT `estadisticas_ibfk_1` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores` (`id`);

--
-- Filtros para la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD CONSTRAINT `jugadores_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`id`);

--
-- Filtros para la tabla `partidos`
--
ALTER TABLE `partidos`
  ADD CONSTRAINT `partidos_ibfk_1` FOREIGN KEY (`equipo_local_id`) REFERENCES `equipos` (`id`),
  ADD CONSTRAINT `partidos_ibfk_2` FOREIGN KEY (`equipo_visitante_id`) REFERENCES `equipos` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores` (`id`),
  ADD CONSTRAINT `usuarios_ibfk_2` FOREIGN KEY (`jugador_id`) REFERENCES `jugadores` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;