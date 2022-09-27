import express from "express";
import { resolve } from "path";
// import Api from "./api/index";
import Route from "./route/index.js";
import Locals from "./core/app.js";
const app = express();

// 设置模板文件
app.set("views", resolve("./views"));
app.set("view engine", "ejs");
Locals(app);

// 路由和api
// app.use("/api/", Api);
app.use("/", Route);
// 设置静态文件基础根目录
app.use("/", express.static("./static"));

app.listen(3005, () => {
    console.log(`http://127.0.0.1:3005`);
});
