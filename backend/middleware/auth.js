const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('Auth Middleware - Token recibido:', token);
    
    if (!token) {
      return res.status(401).json({ message: 'No hay token de autenticación' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth Middleware - Token decodificado:', decoded);
    
    req.user = {
      id: decoded.id,
      rol: decoded.rol,
      jugadorId: decoded.jugadorId
    };
    
    console.log('Auth Middleware - Usuario configurado:', req.user);
    
    next();
  } catch (error) {
    console.error('Auth Middleware - Error:', error);
    res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports = auth;