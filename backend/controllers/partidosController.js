const pool = require('../config/database');

const partidosController = {
  getPartidos: async (req, res) => {
    try {
      const [partidos] = await pool.query(`
        SELECT p.*, 
               el.nombre as equipo_local, 
               el.escudo_url as escudo_local,
               ev.nombre as equipo_visitante,
               ev.escudo_url as escudo_visitante,
               DATE_FORMAT(p.fecha, '%Y-%m-%d') as fecha_formateada
        FROM partidos p
        JOIN equipos el ON p.equipo_local_id = el.id
        JOIN equipos ev ON p.equipo_visitante_id = ev.id
        ORDER BY p.fecha DESC
      `);
      res.json(partidos);
    } catch (error) {
      console.error('Error al obtener partidos:', error);
      res.status(500).json({ message: error.message });
    }
  },

  createPartido: async (req, res) => {
    try {
      const { 
        equipo_local_id, 
        equipo_visitante_id, 
        fecha, 
        hora,
        lugar,
        goles_local,
        goles_visitante 
      } = req.body;
      
      const [result] = await pool.query(
        `INSERT INTO partidos (
          equipo_local_id, 
          equipo_visitante_id, 
          fecha, 
          hora,
          lugar,
          goles_local,
          goles_visitante
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          equipo_local_id, 
          equipo_visitante_id, 
          fecha, 
          hora || null,
          lugar,
          goles_local || null,
          goles_visitante || null
        ]
      );
      
      res.status(201).json({ 
        id: result.insertId,
        message: 'Partido creado exitosamente' 
      });
    } catch (error) {
      console.error('Error al crear partido:', error);
      res.status(500).json({ message: error.message });
    }
  },

  updatePartido: async (req, res) => {
    try {
      const { id } = req.params;
      const { 
        equipo_local_id, 
        equipo_visitante_id, 
        fecha, 
        hora,
        lugar,
        goles_local,
        goles_visitante 
      } = req.body;
      
      await pool.query(
        `UPDATE partidos 
         SET equipo_local_id = ?, 
             equipo_visitante_id = ?, 
             fecha = ?, 
             hora = ?,
             lugar = ?,
             goles_local = ?,
             goles_visitante = ?
         WHERE id = ?`,
        [
          equipo_local_id, 
          equipo_visitante_id, 
          fecha, 
          hora || null,
          lugar,
          goles_local || null,
          goles_visitante || null,
          id
        ]
      );
      
      res.json({ message: 'Partido actualizado exitosamente' });
    } catch (error) {
      console.error('Error al actualizar partido:', error);
      res.status(500).json({ message: error.message });
    }
  },

  deletePartido: async (req, res) => {
    try {
      const { id } = req.params;
      
      const [result] = await pool.query('DELETE FROM partidos WHERE id = ?', [id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Partido no encontrado' });
      }
      
      res.json({ message: 'Partido eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar partido:', error);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = partidosController;