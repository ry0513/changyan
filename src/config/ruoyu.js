const { resolve, extname } = require("path");
const fileType = require("file-type");
const fs = require("fs-extra");
const logger = require("./log");
const dayjs = require("dayjs");
const UUID = require("uuid");

// 响应
const response = {
    success: (res, obj = {}) => {
        res.send({ code: 0, msg: "操作成功", ...obj });
    },
    error: (res, obj = {}) => {
        res.send({ code: -1, msg: "操作失败", ...obj });
    },
    parameter: (res, obj = {}) => {
        res.send({ code: -2, msg: "请检查参数", ...obj });
    },
    // needLogin: (res, obj = {}) => {
    //     res.send({
    //         code: -2,
    //         msg: "没有找到登录信息，未登录或登录过期",
    //         ...obj,
    //     });
    // },
    // permission: (res, obj = {}) => {
    //     res.send({ code: -3, msg: "权限不足", ...obj });
    // },
};

const RUOYU = {
    // 静态变量
    mimeType: {
        image: ["image/png", "image/jpeg", "image/gif"],
    },

    // 客户端基本信息
    clientInfo: (req) => {
        return {
            ua: req.headers["user-agent"],
            ip: req.ips[0] || req.ip || "未知",
            city: "未知",
        };
    },

    // 路径拼接
    path: (dir, ...other) => resolve(dir, ...other),
    // 获取后缀名
    extname: (path) => extname(path),
    // 日期
    dayjs: (date = new Date()) => dayjs(date),
    // UUID
    uuid: () => UUID.v1().replace(/-/g, ""),
    // 根据文件头获取类型
    fileType: async (buffer) => await fileType.fromBuffer(buffer),
    // 是否为图片
    isMimeType: async (fileList = [], mimeType = []) => {
        return new Promise(async (resolve, reject) => {
            if (!Array.isArray(fileList)) {
                fileList = [fileList];
            }
            for (let i = 0; i < fileList.length; i++) {
                const item = fileList[i];
                if (
                    !mimeType.includes(
                        ((await fileType.fromBuffer(item.buffer)) || {}).mime
                    )
                ) {
                    return resolve(false);
                }
            }
            resolve(true);
        });
    },

    // 日志
    logInfo: (msg) => {
        logger.info(msg);
    },
    logError: (msg, err) => {
        logger.error(msg);
        err && logger.error(`原因: ${err.message}`);
        process.exit(1);
    },

    // 响应
    res: response,
};

// 加载配置文件
const configDefaultPath = RUOYU.path(__dirname, "./config_default.js");
const configPath = RUOYU.path(__dirname, "./config.js");
let CONFIG = {};
if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, fs.readFileSync(configDefaultPath, "utf8"));
    RUOYU.logError("未检测到配置文件，已重新生成，位置src/config/config.js");
    RUOYU.logError("请打开文件配置后重新启动");
    process.exit(1);
} else {
    CONFIG = require(configPath);
}

// 创建图片文件夹
const imagePath = resolve(__dirname, "../../images");
if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath);
    fs.mkdirSync(resolve(imagePath, "./original"));
    fs.mkdirSync(resolve(imagePath, "./thumbnail"));
    RUOYU.logInfo("创建图片[images]文件夹成功！");
}

module.exports = { ...RUOYU, ...CONFIG };
