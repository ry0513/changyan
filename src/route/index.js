import { Router } from "express";
import fs from "fs-extra";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();

router.get("/", async (req, res) => {
    console.log(res.locals);
    res.locals = {
        data: [
            {
                id: "dasdasdasda",
                name: "用户名",
                time: "2000-02-02 06:12:06",
                text: "Sass拥有比其他任何CSS扩展语言更多的功能和特性。Sass核心团队不懈努力，一直使其保持领先地位。Sass拥有比其他任何CSS扩展语言更多的功能和特性。Sass核心团队不懈努力，一直使其保持领先地位。Sass拥有比其他任何CSS扩展语言更多的功能和特性。Sass核心团队不懈努力，一直使其保持领先地位。 ",
                image: [
                    {
                        url: "https://files.catbox.moe/9nlvc6.jpg",
                        height: 200,
                        width: 100,
                        size: 2659,
                    },
                    {
                        url: "https://files.catbox.moe/9nlvc6.jpg",
                        height: 200,
                        width: 100,
                        size: 2659,
                    },
                    {
                        url: "https://files.catbox.moe/9nlvc6.jpg",
                        height: 200,
                        width: 100,
                        size: 2659,
                    },
                ],
            },
            {
                id: "dasdasda5sda",
                name: "用户名",
                time: "2000-02-02 06:12:06",
                text: "Sass拥有比其多的功能和特性。Sass核心团队不ss拥有比其他任何CSS扩展语言更多的功能和特性。领先地位。Sass拥有比其他任何CSS扩展语言更多力，一直使其保持领先地位。 ",
                image: [
                    {
                        url: "https://files.catbox.moe/9nlvc6.jpg",
                        height: 200,
                        width: 100,
                        size: 2659,
                    },
                ],
            },
            {
                id: "dasdasdssa5sda",
                name: "用户名",
                time: "2000-02-02 06:12:06",
                text: "Sass拥有比其多的功能和特性。Sass核心团队不ss拥有比其他任何CSS扩展语言更多的功能和特性。领先地位。Sass拥有比其他任何CSS扩展语言更多力，一直使其保持领先地位。 ",
                image: null,
            },
        ],
    };
    res.render("layout/web");
});

const routeList = fs.readdirSync(__dirname).filter((item) => {
    return item !== "index.js";
});
console.log(routeList);
export default router;
