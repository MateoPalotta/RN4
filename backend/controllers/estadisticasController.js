const pool = require('../config/database');

const getAll = async (req, res) => {
    try {
        const query = `
            SELECT 
                e.*,
                j.nombre,
                j.apellido,
                j.foto_url,
                eq.nombre as equipo_nombre
            FROM estadisticas e
            LEFT JOIN jugadores j ON e.jugador_id = j.id
            LEFT JOIN equipos eq ON j.equipo_id = eq.id
            ORDER BY e.goles DESC, e.asistencias DESC
        `;
        
        const [estadisticas] = await pool.query(query);
        res.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { jugador_id, goles, asistencias, tarjetas_amarillas, tarjetas_rojas } = req.body;
        const [result] = await pool.query(
            'INSERT INTO estadisticas (jugador_id, goles, asistencias, tarjetas_amarillas, tarjetas_rojas) VALUES (?, ?, ?, ?, ?)',
            [jugador_id, goles, asistencias, tarjetas_amarillas, tarjetas_rojas]
        );
        res.status(201).json({ id: result.insertId, message: 'Estadística creada exitosamente' });
    } catch (error) {
        console.error('Error al crear estadística:', error);
        res.status(500).json({ message: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { goles, asistencias, tarjetas_amarillas, tarjetas_rojas } = req.body;

        const [estadisticaActual] = await pool.query(
            'SELECT * FROM estadisticas WHERE id = ?',
            [id]
        );

        if (estadisticaActual.length === 0) {
            return res.status(404).json({ message: 'Estadística no encontrada' });
        }

        const userJugadorId = parseInt(req.user.jugadorId);
        const estadisticaJugadorId = parseInt(estadisticaActual[0].jugador_id);

        const tienePermiso = 
            req.user.rol === 'admin' || 
            (req.user.rol === 'jugador' && userJugadorId === estadisticaJugadorId);

        if (!tienePermiso) {
            return res.status(403).json({
                message: req.user.rol === 'jugador' 
                    ? 'Solo puedes editar tus propias estadísticas'
                    : 'No tienes permiso para editar estadísticas'
            });
        }

        const [result] = await pool.query(
            `UPDATE estadisticas 
             SET goles = ?, 
                 asistencias = ?, 
                 tarjetas_amarillas = ?, 
                 tarjetas_rojas = ? 
             WHERE id = ?`,
            [goles, asistencias, tarjetas_amarillas, tarjetas_rojas, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Error al actualizar la estadística' });
        }

        res.json({ message: 'Estadística actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Backend: Intentando eliminar estadística con ID:', id);

        const [result] = await pool.query(
            'DELETE FROM estadisticas WHERE id = ?',
            [id]
        );

        console.log('Backend: Resultado de la eliminación:', result);

        if (result.affectedRows === 0) {
            console.log('Backend: No se encontró la estadística');
            return res.status(404).json({ 
                success: false,
                message: 'Estadística no encontrada' 
            });
        }

        console.log('Backend: Estadística eliminada exitosamente');
        res.json({ 
            success: true,
            message: 'Estadística eliminada exitosamente' 
        });
    } catch (error) {
        console.error('Backend: Error al eliminar estadística:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error al eliminar la estadística',
            error: error.message 
        });
    }
};

module.exports = {
    getAll,
    create,
    update,
    eliminar
};