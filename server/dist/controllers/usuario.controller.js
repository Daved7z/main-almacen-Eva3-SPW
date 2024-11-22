"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarPassword = exports.deleteUsuario = exports.updateUsuario = exports.postUsuario = exports.getUsuario = exports.getUsuarios = void 0;
const bcrypt_1 = __importDefault(require("bcrypt")); // Para cifrar contraseñas
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Para generar tokens
const usuario_1 = __importDefault(require("../models/usuario")); // Modelo Sequelize para la tabla `usuarios`
const JWT_SECRET = 'clave_secreta_super_segura'; // Cambiar a una clave segura
// Obtener todos los usuarios
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarios = yield usuario_1.default.findAll();
        res.json(usuarios);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al obtener los usuarios',
        });
    }
});
exports.getUsuarios = getUsuarios;
// Obtener un usuario por ID
const getUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const usuario = yield usuario_1.default.findByPk(id);
        if (usuario) {
            res.json(usuario);
        }
        else {
            res.status(404).json({
                msg: `No existe un usuario con el id ${id}`,
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al obtener el usuario',
        });
    }
});
exports.getUsuario = getUsuario;
// Crear un nuevo usuario con contraseña cifrada
const postUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, password } = req.body;
    try {
        // Cifrar la contraseña antes de guardarla
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Crear el usuario en la base de datos
        const usuario = yield usuario_1.default.create({ nombre, password: hashedPassword });
        // Generar un token
        const token = jsonwebtoken_1.default.sign({ id: usuario.id, nombre: usuario.nombre }, JWT_SECRET, { expiresIn: '1h' });
        res.json({
            msg: 'Usuario agregado con éxito',
            usuario,
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al crear el usuario',
        });
    }
});
exports.postUsuario = postUsuario;
// Actualizar un usuario existente
const updateUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre, password } = req.body;
    try {
        const usuario = yield usuario_1.default.findByPk(id);
        if (usuario) {
            // Cifrar la nueva contraseña si se envía
            const hashedPassword = password ? yield bcrypt_1.default.hash(password, 10) : usuario.password;
            yield usuario.update({ nombre, password: hashedPassword });
            res.json({
                msg: 'Usuario actualizado con éxito',
                usuario,
            });
        }
        else {
            res.status(404).json({
                msg: `No existe un usuario con el id ${id}`,
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al actualizar el usuario',
        });
    }
});
exports.updateUsuario = updateUsuario;
// Eliminar un usuario
const deleteUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const usuario = yield usuario_1.default.findByPk(id);
        if (!usuario) {
            res.status(404).json({
                msg: `No existe un usuario con el id ${id}`,
            });
        }
        else {
            yield usuario.destroy();
            res.json({
                msg: 'Usuario eliminado',
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al eliminar el usuario',
        });
    }
});
exports.deleteUsuario = deleteUsuario;
// Verificar contraseña y generar un token
const verificarPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre, password } = req.body;
    try {
        // Buscar usuario por nombre
        const usuario = yield usuario_1.default.findOne({ where: { nombre } });
        if (!usuario) {
            return res.status(404).json({
                msg: `No existe un usuario con el nombre ${nombre}`,
            });
        }
        // Comparar la contraseña enviada con la almacenada
        const passwordValida = yield bcrypt_1.default.compare(password, usuario.password);
        if (passwordValida) {
            // Generar un token si la contraseña es válida
            const token = jsonwebtoken_1.default.sign({ id: usuario.id, nombre: usuario.nombre }, JWT_SECRET, { expiresIn: '1h' });
            res.json({
                msg: 'Contraseña válida',
                token,
            });
        }
        else {
            res.status(401).json({
                msg: 'Contraseña incorrecta',
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al verificar la contraseña',
        });
    }
});
exports.verificarPassword = verificarPassword;
