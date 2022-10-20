const { sequelize, DataTypes } = require("../connect");

const Dynamic = sequelize.define(
    "dynamic",
    {
        dynamicId: {
            type: DataTypes.INTEGER,
            allowNull: false, // 是否允许为空
            autoIncrement: true,
            primaryKey: true, // 是否主键
            comment: "dynamicID",
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "userID",
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: "内容",
        },
        isTop: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: "置顶",
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
    },
    {
        paranoid: true,
    }
);

module.exports = Dynamic;
