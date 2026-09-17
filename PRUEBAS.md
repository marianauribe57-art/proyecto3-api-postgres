# Guía de pruebas

Procedimiento para verificar el funcionamiento completo de la API una vez
levantado el entorno con `docker compose up -d --build`.

## Archivos de apoyo

Las pruebas de POST y PUT requieren el cuerpo de la petición en un archivo,
debido al manejo de comillas de PowerShell. Crear en la raíz del proyecto:

`nuevo.json`
```json
{ "nombre": "Andres Torres", "email": "andres.torres@sena.edu.co" }
```

`actualizar.json`
```json
{ "nombre": "Andres Torres Vega", "email": "andres.vega@sena.edu.co" }
```

`invalido.json`
```json
{ "nombre": "Sin Correo" }
```

Estos archivos están excluidos del repositorio mediante `.gitignore`, ya que
son auxiliares de prueba y no parte del proyecto.

## Verificación de la conexión

```powershell
curl.exe http://localhost:3000/health
```

Respuesta esperada: `{"estado":"ok","baseDatos":"conectada"}`

## Verificación de la migración automática

```powershell
curl.exe http://localhost:3000/usuarios
```

Debe devolver los tres registros insertados por `db/init.sql`. Si la lista
llega vacía, el script de inicialización no se ejecutó, lo que indica que el
volumen `postgres_data` ya existía antes de montar el script.

## CRUD completo

```powershell
curl.exe http://localhost:3000/usuarios
curl.exe http://localhost:3000/usuarios/1
curl.exe -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" -d "@nuevo.json"
curl.exe -X PUT http://localhost:3000/usuarios/4 -H "Content-Type: application/json" -d "@actualizar.json"
curl.exe -X DELETE http://localhost:3000/usuarios/4
```

El POST devuelve el id asignado. Si en ejecuciones previas se crearon
registros, el id no será 4: la secuencia `SERIAL` de PostgreSQL no reutiliza
valores, incluso después de eliminar filas. Usar el id devuelto en el PUT y el
DELETE.

## Validación y códigos de estado

```powershell
curl.exe -i -X POST http://localhost:3000/usuarios -H "Content-Type: application/json" -d "@invalido.json"
curl.exe -i http://localhost:3000/usuarios/999
```

El flag `-i` muestra los encabezados de respuesta, necesarios para verificar
que se devuelve `400 Bad Request` y `404 Not Found` respectivamente.

## Verificación desde pgAdmin

Acceder a `http://localhost:5050`, registrar el servidor con host `db` y
navegar a `usuarios_db → Esquemas → public → Tablas → usuarios`. Los registros
creados mediante la API deben aparecer en la tabla.