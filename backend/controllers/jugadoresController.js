const pool = require('../config/database');

const getAll = async (req, res) => {
  try {
    const query = `
      SELECT 
        j.id,
        j.nombre,
        j.apellido,
        j.edad,
        j.posicion,
        j.numero_casaca,
        j.equipo_id,
        j.foto_url,
        e.nombre as equipo_nombre
      FROM jugadores j
      LEFT JOIN equipos e ON j.equipo_id = e.id
      ORDER BY j.apellido, j.nombre
    `;
    
    const [jugadores] = await pool.query(query);
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const { 
      nombre, 
      apellido,
      edad,
      posicion, 
      numero_casaca,
      equipo_id,
      foto_url
    } = req.body;
    
    const [result] = await pool.query(
      `INSERT INTO jugadores (
        nombre, 
        apellido,
        edad,
        posicion, 
        numero_casaca,
        equipo_id,
        foto_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto_url]
    );
    
    res.status(201).json({ 
      id: result.insertId,
      message: 'Jugador creado exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      nombre, 
      apellido,
      edad,
      posicion, 
      numero_casaca,
      equipo_id,
      foto_url
    } = req.body;
    
    await pool.query(
      `UPDATE jugadores 
       SET nombre = ?, 
           apellido = ?,
           edad = ?,
           posicion = ?, 
           numero_casaca = ?,
           equipo_id = ?,
           foto_url = ?
       WHERE id = ?`,
      [nombre, apellido, edad, posicion, numero_casaca, equipo_id, foto_url, id]
    );
    
    res.json({ message: 'Jugador actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Intentando eliminar jugador con ID:', id);
    
    const [result] = await pool.query('DELETE FROM jugadores WHERE id = ?', [id]);
    console.log('Resultado de la eliminación:', result);
    
    if (result.affectedRows === 0) {
      console.log('No se encontró el jugador');
      return res.status(404).json({ message: 'Jugador no encontrado' });
    }
    
    console.log('Jugador eliminado exitosamente');
    res.json({ message: 'Jugador eliminado exitosamente' });
  } catch (error) {
    console.error('Error en la eliminación:', error);
    res.status(500).json({ 
      message: error.message,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      code: error.code
    });
  }
};

const getPerfil = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const [rows] = await pool.query(`
      SELECT 
        j.*,
        e.nombre as equipo_nombre
      FROM jugadores j
      LEFT JOIN equipos e ON j.equipo_id = e.id
      WHERE j.user_id = ?
    `, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Perfil de jugador no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove,
  getPerfil
};