import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('almacen', 'root', 'cisco123y4nbow', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;


