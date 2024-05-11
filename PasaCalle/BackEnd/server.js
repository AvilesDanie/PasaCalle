const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors');
const fs = require('fs');

const multer = require('multer');
const storage = multer.memoryStorage(); // Almacenar la imagen en memoria en lugar de en el disco
const upload = multer({ storage: storage });


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const sequelize = new Sequelize('proyecto3p', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});


const Restaurante = sequelize.define('restaurante', {
    ID_RESTAURANTE: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    NOMBRE_RESTAURANTE: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    DIASLABORABLES_RESTAURANTE: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    HORAINICIOLABORAL_RESTAURANTE: {
        type: Sequelize.TIME,
        allowNull: false,
    },
    HORAFINLABORAL_RESTAURANTE: {
        type: Sequelize.TIME,
        allowNull: true,
    },
    IMAGEN_RESTAURANTE: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    DESCRIPCION_RESTAURANTE: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    UBICACION_RESTAURANTE: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    timestamps: false
});



const Plato = sequelize.define('PLATOS', {
    ID_PLATO: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    ID_RESTAURANTE: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    CATEGORIA_PLATO: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    NOMBRE_PLATO: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    IMAGEN_PLATO: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    DESCRIPCION_PLATO: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    PRECIO_PLATO: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
}, {
    timestamps: false
});


const Usuario = sequelize.define('usuarios', {
    ID_USUARIO : {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    FECHANACIMIENTO_USUARIO: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    CONTRASENIA: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    NOMBRE_USUARIO: {
        type: Sequelize.TIME,
        allowNull: false,
    },
    APELLIDO_USUARIO: {
        type: Sequelize.TIME,
        allowNull: true,
    },
    CORREOELECTRONICO_USUARIO: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    CUENTA_USUARIO: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    Telefono_Usuario: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    timestamps: false
});

const Reserva = sequelize.define('reservas', {
    ID_RESERVA  : {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    ID_RESTAURANTE : {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    ID_USUARIO : {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    FECHA_RESERVA: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    HORAINICIO_RESERVA: {
        type: Sequelize.TIME,
        allowNull: true,
    },
    CANTIDAD_PERSONAS: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    timestamps: false
});

Reserva.belongsTo(Restaurante, { foreignKey: 'ID_RESTAURANTE', as: 'restaurante' });
Reserva.belongsTo(Usuario, { foreignKey: 'ID_USUARIO', as: 'usuario' });

Plato.belongsTo(Restaurante, { foreignKey: 'ID_RESTAURANTE', as: 'restaurante' });



app.get('/comidas', async (req, res) => {
    try {
        const comidas = await Plato.findAll({
            attributes: ['ID_PLATO', 'CATEGORIA_PLATO', 'NOMBRE_PLATO', 'IMAGEN_PLATO', 'DESCRIPCION_PLATO', 'PRECIO_PLATO'],
            include: [{
                model: Restaurante,
                attributes: ['NOMBRE_RESTAURANTE'],
                where: {
                    ID_RESTAURANTE: Sequelize.col('PLATOS.ID_RESTAURANTE')
                },
                required: true,
                as: 'restaurante'
            }],
        });

        res.json(comidas);
    } catch (error) {
        console.error('Error al obtener comidas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.get('/categorias', async (req, res) => {
    try {
        const categorias = await Plato.findAll({
            attributes: [
                [Sequelize.fn('DISTINCT', Sequelize.col('CATEGORIA_PLATO')), 'categoria'],
                [Sequelize.fn('COUNT', Sequelize.col('CATEGORIA_PLATO')), 'cantidad']
            ],
            group: ['CATEGORIA_PLATO']
        });

        res.json(categorias);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


app.get('/restaurantes', async (req, res) => {
    try {
        const restaurentes = await Restaurante.findAll({ attributes: ['ID_RESTAURANTE', 'NOMBRE_RESTAURANTE', 'IMAGEN_RESTAURANTE', 'DESCRIPCION_RESTAURANTE','UBICACION_RESTAURANTE'] });
        res.json(restaurentes);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Agrega esta nueva ruta al final de tu archivo server.js

app.get('/nombreRestaurantes', async (req, res) => {
    try {
        const restaurantes = await Restaurante.findAll({
            attributes: ['NOMBRE_RESTAURANTE']
        });

        res.json(restaurantes);
    } catch (error) {
        console.error('Error al obtener nombres de restaurantes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});




app.post('/crearPlato', upload.single('logo'), async (req, res) => {
    try {
        // Obtener los datos de la imagen desde el buffer
        const datos_imagen = req.file.buffer.toString('base64');

        const nuevoPlato = await Plato.create({
            ID_RESTAURANTE: 1,
            CATEGORIA_PLATO: 'Entradas',
            NOMBRE_PLATO: 'MOTE CON CHICHARRÓN',
            IMAGEN_PLATO: datos_imagen,
            DESCRIPCION_PLATO: 'El mejor chicharrón selecto acompañado de mote hervido, perfecto para picar.',
            PRECIO_PLATO: 8.00,
        });

        console.log('Plato creado:', nuevoPlato.toJSON());
        res.status(201).json({ mensaje: 'Plato creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el plato:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/obtenerPlatos', async (req, res) => {
    try {
        const platos = await Plato.findAll();
        res.json(platos);
    } catch (error) {
        console.error('Error al obtener los platos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});









app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['ID_USUARIO', 'CUENTA_USUARIO', 'CONTRASENIA'],
        });

        res.json(usuarios);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



app.get('/usuarios/:id', async (req, res) => {
    const usuarioId = parseInt(req.params.id, 10);

    try {
        const usuario = await Usuario.findByPk(usuarioId, {
            attributes: ['ID_USUARIO','FECHANACIMIENTO_USUARIO', 'NOMBRE_USUARIO', 'APELLIDO_USUARIO', 'CORREOELECTRONICO_USUARIO', 'CONTRASENIA','Telefono_Usuario'],
        });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



app.get('/horarios/:idRestaurante', async (req, res) => {
    const idRestaurante = parseInt(req.params.idRestaurante, 10);

    // Validar que idRestaurante sea un número válido
    if (isNaN(idRestaurante)) {
        return res.status(400).json({ error: 'ID de restaurante no válido' });
    }

    try {
        const restaurante = await Restaurante.findByPk(idRestaurante, {
            attributes: [
                'DIASLABORABLES_RESTAURANTE',
                [Sequelize.fn('TIME_FORMAT', Sequelize.col('HORAINICIOLABORAL_RESTAURANTE'), '%H:%i:%s'), 'HORAINICIOLABORAL_RESTAURANTE'],
                [Sequelize.fn('TIME_FORMAT', Sequelize.col('HORAFINLABORAL_RESTAURANTE'), '%H:%i:%s'), 'HORAFINLABORAL_RESTAURANTE'],
            ],
        });

        if (!restaurante) {
            return res.status(404).json({ error: 'Restaurante no encontrado' });
        }

        res.json(restaurante);
    } catch (error) {
        console.error('Error al obtener horarios del restaurante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});









app.post('/reserva', async (req, res) => {
    const { ID_RESTAURANTE, ID_USUARIO, FECHA_RESERVA, HORAINICIO_RESERVA, CANTIDAD_PERSONAS } = req.body;

    try {
        const nuevaReserva = await Reserva.create({
            ID_RESTAURANTE,
            ID_USUARIO,
            FECHA_RESERVA,
            HORAINICIO_RESERVA,
            CANTIDAD_PERSONAS,
        });

        console.log('Reserva creada');
        res.status(201).json({ mensaje: 'Reserva creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la reserva:');
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



app.put('/usuarios/:id', async (req, res) => {
    const usuarioId = parseInt(req.params.id, 10);

    try {
        const { FECHANACIMIENTO_USUARIO, NOMBRE_USUARIO, APELLIDO_USUARIO, CORREOELECTRONICO_USUARIO, Telefono_Usuario } = req.body;

        const usuarioActualizado = await Usuario.update({
            FECHANACIMIENTO_USUARIO,
            NOMBRE_USUARIO,
            APELLIDO_USUARIO,
            CORREOELECTRONICO_USUARIO,
            Telefono_Usuario,
        }, {
            where: {
                ID_USUARIO: usuarioId,
            },
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});






app.post('/usuarios', async (req, res) => {
    try {
        const {
            FECHANACIMIENTO_USUARIO,
            CONTRASENIA,
            NOMBRE_USUARIO,
            APELLIDO_USUARIO,
            CORREOELECTRONICO_USUARIO,
            CUENTA_USUARIO,
            Telefono_Usuario,
        } = req.body;

        const nuevoUsuario = await Usuario.create({
            FECHANACIMIENTO_USUARIO,
            CONTRASENIA,
            NOMBRE_USUARIO,
            APELLIDO_USUARIO,
            CORREOELECTRONICO_USUARIO,
            CUENTA_USUARIO,
            Telefono_Usuario,
        });

        console.log('Usuario creado');
        res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});









app.listen(8081, () => {
    console.log('Servidor en ejecución en el puerto 8081');
});
