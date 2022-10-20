const { sequelize, DataTypes } = require("../connect");

const Image = sequelize.define(
    "image",
    {
        imageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
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
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "链接",
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
        thumbnailUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: "缩略图链接",
        },
        thumbnailHeight: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "缩略图高度",
        },
        thumbnailWidth: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "缩略图宽度",
        },
        thumbnailSize: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "缩略图文件大小",
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
