const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usuariosController = {
    register: async (req, res) => {
        try {
            const { email, password, rol, jugador_id } = req.body;
            
            if (rol === 'jugador' && !jugador_id) {
                return res.status(400).json({ 
                    message: 'Debe seleccionar un jugador para usuarios tipo jugador' 
                });
            }

            if (jugador_id) {
                const [existingUser] = await pool.query(
                    'SELECT id FROM usuarios WHERE jugador_id = ?',
                    [jugador_id]
                );
                if (existingUser.length > 0) {
                    return res.status(400).json({ 
                        message: 'Este jugador ya está asociado a un usuario' 
                    });
                }
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const [result] = await pool.query(
                'INSERT INTO usuarios (email, password, rol, jugador_id) VALUES (?, ?, ?, ?)', 
                [email, hashedPassword, rol, jugador_id]
            );
            
            res.status(201).json({ 
                id: result.insertId, 
                email, 
                rol,
                jugador_id
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            const [users] = await pool.query(
                `SELECT u.*, j.id as jugador_id 
                 FROM usuarios u 
                 LEFT JOIN jugadores j ON u.jugador_id = j.id 
                 WHERE u.email = ?`, 
                [email]
            );

            if (users.length === 0) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            const user = users[0];
            const validPassword = await bcrypt.compare(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            console.log('Datos del usuario:', {
                id: user.id,
                rol: user.rol,
                jugadorId: user.jugador_id
            });

            let jugadorId = null;
            if (user.rol === 'jugador') {
                const [jugador] = await pool.query('SELECT id FROM jugadores WHERE id = ?', [user.id]);
                if (jugador.length > 0) {
                    jugadorId = jugador[0].id;
                }
            }

            const token = jwt.sign(
                { 
                    id: user.id, 
                    rol: user.rol,
                    jugadorId: jugadorId 
                }, 
                process.env.JWT_SECRET
            );

            console.log('Token generado con:', {
                userId: user.id,
                rol: user.rol,
                jugadorId: jugadorId
            });

            res.json({
                token,
                rol: user.rol,
                userId: user.id,
                jugadorId
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    getAll: async (req, res) => {
        try {
            const [rows] = await pool.query('SELECT id, email, rol FROM usuarios');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const [rows] = await pool.query('SELECT id, email, rol FROM usuarios WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json(rows[0]);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
            res.json({ message: 'Usuario eliminado' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = usuariosController;