const pool = require('../config/database');

const equiposController = {
    getAll: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT * FROM equipos');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await pool.query('SELECT * FROM equipos WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    create: async (req, res) => {
        try {
            const [existing] = await pool.query(
                'SELECT id FROM equipos WHERE nombre = ?',
                [req.body.nombre]
            );

            if (existing.length > 0) {
                return res.status(400).json({
                    message: 'Ya existe un equipo con ese nombre'
                });
            }

            const [result] = await pool.query(
                'INSERT INTO equipos (nombre, escudo_url) VALUES (?, ?)',
                [req.body.nombre, req.body.escudo_url]
            );

            res.status(201).json({
                id: result.insertId,
                nombre: req.body.nombre,
                escudo_url: req.body.escudo_url
            });
        } catch (error) {
            console.error('Error al crear equipo:', error);
            res.status(500).json({
                message: 'Error al crear el equipo'
            });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, escudo_url } = req.body;
            const [result] = await pool.query('UPDATE equipos SET nombre = ?, escudo_url = ? WHERE id = ?', [nombre, escudo_url, id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }
            res.json({ id, nombre, escudo_url });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const [result] = await pool.query('DELETE FROM equipos WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Equipo no encontrado' });
            }
            res.json({ message: 'Equipo eliminado' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = equiposController;