const express = require("express");
const bodyParser = require("body-parser");
const { resolve } = require("path");
const Api = require("./api");
const Route = require("./route");
const Locals = require("./core/locals");
const RUOYU = require("./config/ruoyu");
require("./db/index");

const app = express();
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

// 设置模板文件
app.set("views", resolve("./views"));
app.set("view engine", "ejs");
Locals(app);

// 路由和api
app.use("/api/", Api);
app.use("/", Route);
// 设置静态文件基础根目录
app.use("/", express.static("./static"));
app.use("*", (req, res) => {
    res.status(404).json({
        code: 404,
        msg: "sorry, this page does not exist",
    });
});
app.listen(RUOYU.HTTP.PORT, "0.0.0.0", () => {
    RUOYU.logInfo(`[HTTP 模块] http://localhost:${RUOYU.HTTP.PORT}`);
});
