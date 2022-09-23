const {DataTypes} = require("sequelize")
const sequelize = require("../config/database/database")
const statusType = require("../utils/statusENUM")
const {hash} = require("bcrypt")

const Users = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastLoginTime: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    status: {
        type: DataTypes.ENUM(Object.values(statusType)),
        allowNull: false,
        defaultValue: statusType.ACTIVE
    }
}, {
    underscored: true,
    hooks: {
        async beforeCreate(user) {
            user.password = await hash(user.password, 8)
        }
    }
})

module.exports = Users