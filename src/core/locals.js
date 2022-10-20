const RUOYU = require("../config/ruoyu");
module.exports = (app) => {
    app.locals = {
        websiteTitle: "若",
        websiteDescription: "description",
        websiteKeywords: "keyword",
        RUOYU: {
            title: "若",
            description: "description",
        },
        cssList: [], // 占位，防止报错
        jsList: [], // 占位，防止报错
        cdnUrl: "./",
        version: "0.0.1",
        dayjs: (date, format = "YYYY-MM-DD HH:mm:ss") => {
            return RUOYU.dayjs(date).format(format);
        },
    };
};
