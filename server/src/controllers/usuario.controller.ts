import { Request, Response } from 'express';
import bcrypt from 'bcrypt'; // Para cifrar contraseñas
import jwt from 'jsonwebtoken'; // Para generar tokens
import Usuario from '../models/usuario'; // Modelo Sequelize para la tabla `usuarios`

const JWT_SECRET = 'clave_secreta_super_segura'; // Cambiar a una clave segura

// Obtener todos los usuarios
export const getUsuarios = async (req: Request, res: Response) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al obtener los usuarios',
        });
    }
};

// Obtener un usuario por ID
export const getUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByPk(id);

        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({
                msg: `No existe un usuario con el id ${id}`,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al obtener el usuario',
        });
    }
};

// Crear un nuevo usuario con contraseña cifrada
export const postUsuario = async (req: Request, res: Response) => {
    const { nombre, password } = req.body;

    try {
        // Cifrar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario en la base de datos
        const usuario = await Usuario.create({ nombre, password: hashedPassword });

        // Generar un token
        const token = jwt.sign({ id: usuario.id, nombre: usuario.nombre }, JWT_SECRET, { expiresIn: '1h' });

        res.json({
            msg: 'Usuario agregado con éxito',
            usuario,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al crear el usuario',
        });
    }
};

// Actualizar un usuario existente
export const updateUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, password } = req.body;

    try {
        const usuario = await Usuario.findByPk(id);

        if (usuario) {
            // Cifrar la nueva contraseña si se envía
            const hashedPassword = password ? await bcrypt.hash(password, 10) : usuario.password;

            await usuario.update({ nombre, password: hashedPassword });
            res.json({
                msg: 'Usuario actualizado con éxito',
                usuario,
            });
        } else {
            res.status(404).json({
                msg: `No existe un usuario con el id ${id}`,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al actualizar el usuario',
        });
    }
};

// Eliminar un usuario
export const deleteUsuario = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            res.status(404).json({
                msg: `No existe un usuario con el id ${id}`,
            });
        } else {
            await usuario.destroy();
            res.json({
                msg: 'Usuario eliminado',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al eliminar el usuario',
        });
    }
};

// Verificar contraseña y generar un token
export const verificarPassword = async (req: Request, res: Response) => {
    const { nombre, password } = req.body;

    try {
        // Buscar usuario por nombre
        const usuario = await Usuario.findOne({ where: { nombre } });

        if (!usuario) {
            return res.status(404).json({
                msg: `No existe un usuario con el nombre ${nombre}`,
            });
        }

        // Comparar la contraseña enviada con la almacenada
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (passwordValida) {
            // Generar un token si la contraseña es válida
            const token = jwt.sign(
                { id: usuario.id, nombre: usuario.nombre },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({
                msg: 'Contraseña válida',
                token,
            });
        } else {
            res.status(401).json({
                msg: 'Contraseña incorrecta',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al verificar la contraseña',
        });
    }
};
