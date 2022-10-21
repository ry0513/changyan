const { sequelize, DataTypes } = require("../connect");

const User = sequelize.define(
    "user",
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            comment: "userId",
        },
        userCode: {
            type: DataTypes.STRING(),
            allowNull: false,
            comment: "用户码",
        },
        nickName: {
            type: DataTypes.STRING(20),
            allowNull: false,
            comment: "用户昵称",
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "头像地址",
        },
        ua: {
            type: DataTypes.TEXT,
            comment: "UA",
        },
        ip: {
            type: DataTypes.STRING(16),
            comment: "IP",
        },
        city: {
            type: DataTypes.STRING(64),
            comment: "城市",
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: "状态",
        },
    },
    {
        paranoid: true,
    }
);

module.exports = User;
