const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint de salud
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ estado: 'ok', baseDatos: 'conectada' });
  } catch (error) {
    res.status(500).json({ estado: 'error', baseDatos: 'sin conexion' });
  }
});

// Validación de datos de entrada
function validarUsuario(body) {
  const { nombre, email } = body;
  if (!nombre || !email) {
    return 'Los campos nombre y email son obligatorios';
  }
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formatoEmail.test(email)) {
    return 'El formato del email no es valido';
  }
  return null;
}

// Listar todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios ORDER BY id');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar los usuarios' });
  }
});

// Obtener un usuario por id
app.get('/usuarios/:id', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar el usuario' });
  }
});

// Crear un usuario
app.post('/usuarios', async (req, res) => {
  const errorValidacion = validarUsuario(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }
  try {
    const { nombre, email } = req.body;
    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, email) VALUES ($1, $2) RETURNING *',
      [nombre, email]
    );
    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya esta registrado' });
    }
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Actualizar un usuario
app.put('/usuarios/:id', async (req, res) => {
  const errorValidacion = validarUsuario(req.body);
  if (errorValidacion) {
    return res.status(400).json({ error: errorValidacion });
  }
  try {
    const { nombre, email } = req.body;
    const resultado = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2 WHERE id = $3 RETURNING *',
      [nombre, email, req.params.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// Eliminar un usuario
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const resultado = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [req.params.id]);
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado', usuario: resultado.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API de usuarios escuchando en el puerto ${PORT}`);
});