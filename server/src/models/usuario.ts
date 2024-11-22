import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/connection';

// Define un tipo para los atributos del modelo (para crear un usuario)
interface UsuarioAttributes {
    id: number;
    nombre: string;
    password: string;
}

// Define un tipo para los atributos opcionales al crear un usuario (sin `id`)
interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id'> {}

class Usuario extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
    public id!: number;
    public nombre!: string;
    public password!: string;
}

Usuario.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'usuarios',
        timestamps: false,
    }
);

export default Usuario;
