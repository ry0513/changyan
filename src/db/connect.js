const { Sequelize, DataTypes, Op } = require("sequelize");
const RUOYU = require("../config/ruoyu");

const sequelize = new Sequelize(RUOYU.DB.BASE, RUOYU.DB.USER, RUOYU.DB.PASSWD, {
    host: RUOYU.DB.HOST,
    dialect: "mysql",
    timezone: "+08:00",
    pool: {
        max: 20,
        min: 0,
        idle: 10000,
    },
    logging: false,

    define: {
        // 字段以下划线（_）来分割（默认是驼峰命名风格）
        underscored: true,
        freezeTableName: true,
    },
});

// 测试数据库能否正常使用
sequelize
    .authenticate()
    .then(() => {
        RUOYU.logInfo("[MYSQL 模块] 连接正常");
    })
    .catch((err) => {
        RUOYU.logError("[MYSQL 模块] 连接异常", err);
    });

module.exports = {
    sequelize,
    DataTypes,
    Op,
};
