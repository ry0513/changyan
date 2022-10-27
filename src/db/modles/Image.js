const { sequelize, DataTypes } = require("../connect");

const Image = sequelize.define(
    "image",
    {
        imageId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV1,
            comment: "imageId",
        },

        dynamicId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "dynamicId",
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "userId",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "名称",
        },
        height: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "图片高度",
        },
        width: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "图片宽度",
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "文件大小",
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

module.exports = Image;
